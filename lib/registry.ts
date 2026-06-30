export interface Registry {
  name: string;
  homepage: string;
  url: string;
  description: string;
  stars?: number;
  githubRepo?: string;
}

const REGISTRIES_URL = "https://ui.shadcn.com/r/registries.json";
const GIST_ID = process.env.GIST_ID;

/** Fetch star data from the GitHub Gist. Returns empty object on failure. */
async function fetchStarsData(): Promise<Record<string, { repo: string; stars: number }>> {
  if (!GIST_ID) {
    console.warn("GIST_ID is not defined in environment variables.");
    return {};
  }
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        "User-Agent": "shadcn-registry-hub",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch Gist: ${res.status} ${res.statusText}`);
      return {};
    }
    const gist = await res.json();
    const content = gist.files?.["shadcn-registry-hub-stars.json"]?.content;
    return content ? JSON.parse(content) : {};
  } catch (error) {
    console.error("Error fetching stars data from Gist:", error);
    return {};
  }
}

/**
 * Fetches all registries from shadcn/ui and merges in star counts from the Gist.
 * Both fetches run concurrently.
 */
export async function fetchAllRegistries(): Promise<Registry[]> {
  try {
    const [res, starsData] = await Promise.all([
      fetch(REGISTRIES_URL, { next: { revalidate: 86400 } }),
      fetchStarsData(),
    ]);

    if (!res.ok) throw new Error(`Failed to fetch registries: ${res.statusText}`);

    const data = (await res.json()) as Registry[];
    return data.map((r) => ({
      ...r,
      ...(starsData[r.name]
        ? { stars: starsData[r.name].stars, githubRepo: starsData[r.name].repo }
        : {}),
    }));
  } catch (error) {
    console.error("Error in fetchAllRegistries:", error);
    throw error;
  }
}
