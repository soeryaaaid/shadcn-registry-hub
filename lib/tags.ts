type TagRule = { tag: string; patterns: RegExp[] };

/**
 * Ordered from most specific to most general.
 * The first 3 matched tags are shown on each card.
 */
const TAG_RULES: TagRule[] = [
  // ── Functional ────────────────────────────────────────────────────────────
  { tag: "AI",           patterns: [/\bai\b/i, /\bllm\b/i, /\bgpt\b/i, /language model/i, /generative ai/i, /ai[\s-]native/i, /ai[\s-]powered/i, /webllm/i, /ai sdk/i, /ai app/i, /ai chat/i, /ai agent/i, /ai interface/i, /ai component/i, /ai element/i, /ai vis/i] },
  { tag: "Agent",        patterns: [/\bagent\b/i, /\bagentic\b/i, /human[\s-]in[\s-]the[\s-]loop/i, /mcp app/i, /\blanggraph\b/i, /\bmastra\b/i, /tool invoc/i, /workflow automat/i, /intent[\s-]bound/i] },
  { tag: "Auth",         patterns: [/\bauthentication\b/i, /\bsso\b/i, /\bmfa\b/i, /user management/i, /organization management/i, /\boauth\b/i, /universal login/i] },
  { tag: "Payment",      patterns: [/\bpayment/i, /\bbilling\b/i, /\bsubscription\b/i, /\bcheckout\b/i, /\binvoice\b/i, /\bstripe\b/i, /\bpaddle\b/i, /e[\s-]commerce/i, /monetiz/i, /saas billing/i] },
  { tag: "Chart",        patterns: [/\bchart\b/i, /\brecharts\b/i, /\bvisx\b/i, /data visuali/i, /data grid/i] },
  { tag: "Map",          patterns: [/\bmap\b/i, /\bleaflet\b/i, /\bmapbox\b/i, /\bmaplibre\b/i, /svg map/i, /flight route/i, /great[\s-]circle/i] },
  { tag: "Form",         patterns: [/\bforms?\b/i, /date picker/i, /date range/i, /file upload/i, /react hook form/i, /tanstack form/i, /form builder/i] },
  { tag: "Editor",       patterns: [/\beditor\b/i, /rich[\s-]text/i, /\blexical\b/i, /\bprosekit\b/i, /\bwysiwyg\b/i, /content block/i, /\bnotebook\b/i] },
  { tag: "Loader",       patterns: [/\bloader\b/i, /\bspinner\b/i, /\bskeleton\b/i, /loading anim/i, /dot[\s-]matrix/i, /\bbraille\b/i] },
  { tag: "Icon",         patterns: [/\bicons?\b/i, /\blucide\b/i, /\bheroicons?\b/i, /\bphosphor\b/i, /\btabler\b/i, /svg logos?/i] },
  { tag: "Video",        patterns: [/\bvideo\b/i, /media player/i, /\bhls\b/i, /shaka player/i, /\bremotion\b/i] },
  { tag: "Game",         patterns: [/\bgames?\b/i, /\bgamif/i, /\bsnake\b/i, /\bminesweeper\b/i, /\b2048\b/i] },
  { tag: "Dashboard",    patterns: [/\bdashboard\b/i, /admin panel/i, /admin template/i] },
  { tag: "Crypto",       patterns: [/\bcrypto\b/i, /\bweb3\b/i, /\bblockchain\b/i, /\bdefi\b/i, /\bnfts?\b/i] },
  { tag: "Terminal",     patterns: [/\bterminal\b/i, /command[\s-]line/i] },
  { tag: "Slide",        patterns: [/slide[\s-]deck/i, /build.*slides?\b/i, /\bslide\b.*component/i] },
  { tag: "Social",       patterns: [/social protocol/i, /social media/i, /readme badge/i, /github badge/i] },
  { tag: "Hooks",        patterns: [/\bhooks?\b/i, /url state/i, /\bnuqs\b/i] },
  { tag: "Primitive",    patterns: [/\bprimitive/i, /\bheadless\b/i, /react[\s-]aria/i, /base[\s-]ui/i, /\bark[\s-]ui\b/i, /\bkobalte\b/i, /\bcomposable\b/i] },
  { tag: "Sound",        patterns: [/\bsound\b/i, /sound effect/i] },

  // ── Aesthetic ─────────────────────────────────────────────────────────────
  { tag: "Animation",    patterns: [/\banimat/i, /framer[\s-]motion/i, /\bgsap\b/i, /spring anim/i, /motion[\s-]driven/i, /microinteract/i, /motion[\s-]react/i, /motion[\s-]component/i] },
  { tag: "Glassmorphism",patterns: [/glassmorphi/i, /frosted glass/i, /glassmorphic/i] },
  { tag: "Neobrutalism", patterns: [/neobrutalism/i, /neubrutalism/i, /brutalist/i, /thick border/i, /hard shadow/i] },
  { tag: "Retro",        patterns: [/\bretro\b/i, /\b8[\s-]bit\b/i, /pixel art/i, /\bvintage\b/i, /skeuomorphic/i] },
  { tag: "3D",           patterns: [/\b3d\b/i, /three\.js/i, /\bwebgl\b/i, /floating particle/i] },
  { tag: "Gradient",     patterns: [/\bgradient\b/i, /\boklch\b/i, /display[\s-]p3/i, /theme editor/i] },

  // ── Use Case / Type ───────────────────────────────────────────────────────
  { tag: "Landing",      patterns: [/landing page/i, /marketing page/i, /marketing website/i, /hero section/i, /pricing section/i] },
  { tag: "Block",        patterns: [/ui blocks?\b/i, /page sections?\b/i, /building blocks?\b/i, /blocks?\s+for\b/i, /react blocks?\b/i] },
  { tag: "Template",     patterns: [/\btemplate\b/i, /starter kit/i, /\bboilerplate\b/i] },
  { tag: "Typography",   patterns: [/\bfont\b/i, /\btypograph/i, /type scale/i, /font pairing/i, /\bserif\b/i, /long[\s-]form/i] },
  { tag: "Theme",        patterns: [/\btheme\b/i, /color scheme/i, /design tokens?\b/i, /theme generator/i, /color system/i, /design system/i] },
  { tag: "Simple",       patterns: [/\bsimple\b/i, /\beasy\b/i, /made simple/i, /zero[\s-]dependenc/i, /no server/i, /no api key/i, /single[\s-]file/i, /zero config/i, /drop[\s-]in/i, /copy[\s-]paste/i] },
  { tag: "Modern",       patterns: [/\bmodern\b/i, /\belegant\b/i, /\brefined\b/i, /\bpolished\b/i, /\bpremium\b/i, /\bbespoke\b/i, /\btastefully\b/i, /\bclean\b/i, /\bbeautiful/i, /\bcurated\b/i, /hand[\s-]crafted/i, /carefully crafted/i, /well[\s-]crafted/i, /\bsophisticated\b/i] },
];

/**
 * Returns up to 3 tags for a registry based on its name and description.
 * Falls back to ["Others"] if no patterns match.
 */
export function getTagsForRegistry(name: string, description: string): string[] {
  const text = `${name} ${description}`;
  const matched = TAG_RULES
    .filter(({ patterns }) => patterns.some(p => p.test(text)))
    .map(({ tag }) => tag);
  return matched.length > 0 ? matched.slice(0, 3) : ["Others"];
}

/** All tag labels in definition order — used to build the filter UI. */
export const ALL_TAGS = TAG_RULES.map(({ tag }) => tag).concat("Others");
