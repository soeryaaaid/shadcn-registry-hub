#!/usr/bin/env node
/**
 * Fetches GitHub star counts for all shadcn/ui registries and updates a GitHub Gist.
 * Optimized for simplicity, reliability, and strict rate-limit safety.
 */

import { env } from "process";

const { GITHUB_TOKEN, GIST_ID } = env;
if (!GITHUB_TOKEN || !GIST_ID) throw new Error("Missing GITHUB_TOKEN or GIST_ID");

const GH_HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "shadcn-registry-hub",
};

// Excludes for owner or repo names to prevent matching common framework/library links
// Segments to exclude to prevent matching general GitHub pages
const EXCLUDE_OWNERS = new Set([
  "sponsors", "orgs", "marketplace", "topics", "apps",
  "explore", "features", "pricing", "login", "signup",
  "about", "contact", "settings", "issues", "pulls",
  "discussions", "trending", "collections",
]);

// Specific framework/library repos to exclude (common false positives)
const EXCLUDE_REPOS = new Set([
  "shadcn-ui/ui",
  "shadcn/ui",
  "tailwindlabs/tailwindcss",
  "vercel/next.js",
  "facebook/react",
  "microsoft/typescript",
  "shadcn-ui/blocks",
  "shadcn-ui/taxonomy",
]);

// Overrides for anomalies (wrong names, SPA rendering, or websites with strict rate-limits/errors)
const MANUAL_MAP = {
  "@ai-blocks": "webllm-org/ai-blocks",
  "@cognicatch": "CogniCatch/react",
  "@doras-ui": "dorasto/ui",
  "@darx": "Darshh09/darshit-portfolio",
  "@intentui": "leamsigc/intent-ui",
  "@motion-primitives": "ibelick/motion-primitives",
  "@paletteui": "lior-pesoa/paletteui",
  "@pixelact-ui": "pixelact/pixelact-ui",
  "@react-bits": "g1apa/react-bits",
};

/** Resolves the best GitHub repository for a registry. */
async function getRepo(registry) {
  // 1. Check manual overrides first
  if (MANUAL_MAP[registry.name]) return MANUAL_MAP[registry.name];

  // 2. Try HTML scraping (Zero GitHub API cost)
  try {
    const res = await fetch(registry.homepage, { 
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" }
    });
    if (res.ok) {
      const html = await res.text();
      const matches = [...html.matchAll(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/gi)];
      for (const [, owner, repo] of matches) {
        const cleanRepo = repo.replace(/["'#?()<>]/g, "").replace(/\.git$/, "").replace(/\/$/, "");
        const fullRepo = `${owner}/${cleanRepo}`;
        if (!EXCLUDE_OWNERS.has(owner.toLowerCase()) && !EXCLUDE_REPOS.has(fullRepo.toLowerCase())) {
          return fullRepo;
        }
      }
    }
  } catch {}

  // 3. Fallback: Search GitHub API (Only triggered for a few edge cases to avoid rate-limits)
  try {
    const cleanName = registry.name.replace(/^@/, "");
    const res = await fetch(`https://api.github.com/search/repositories?q=${cleanName}+in:name`, { headers: GH_HEADERS });
    const data = await res.json();
    const match = data.items?.find(item => item.name.toLowerCase().includes(cleanName.toLowerCase()));
    if (match) return match.full_name;
  } catch {}

  return null;
}

// ── Main Execution ──────────────────────────────────────────────────────────

const registries = await fetch("https://ui.shadcn.com/r/registries.json").then((r) => r.json());
console.log(`\nProcessing ${registries.length} registries...\n`);

const results = {};
let found = 0;

// Process registries in batches of 10 to avoid hitting GitHub API rate limits
for (let i = 0; i < registries.length; i += 10) {
  const batch = registries.slice(i, i + 10);
  
  await Promise.all(batch.map(async (reg) => {
    const repo = await getRepo(reg);
    if (!repo) return;
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, { headers: GH_HEADERS });
      if (res.ok) {
        const { stargazers_count } = await res.json();
        results[reg.name] = { repo, stars: stargazers_count };
        found++;
      }
    } catch {}
  }));

  process.stdout.write(`\r  Progress: ${Math.min(i + 10, registries.length)}/${registries.length} · Found: ${found}`);
  
  // Minimal delay between batches to be polite to rate limits
  if (i + 10 < registries.length) {
    await new Promise(r => setTimeout(r, 200));
  }
}

console.log(`\n\n✓ Found GitHub data for ${found}/${registries.length} registries`);
console.log(`  Updating Gist ${GIST_ID}...`);

await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  method: "PATCH",
  headers: { ...GH_HEADERS, "Content-Type": "application/json" },
  body: JSON.stringify({
    files: { "shadcn-registry-hub-stars.json": { content: JSON.stringify(results, null, 2) } },
  }),
});

console.log("✓ Gist updated successfully!\n");
