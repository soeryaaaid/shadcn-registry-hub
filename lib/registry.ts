export interface Registry {
  name: string;
  homepage: string;
  url: string;
  description: string;
}

const REGISTRIES_URL = "https://ui.shadcn.com/r/registries.json";

/**
 * Fetches all registries from shadcn/ui.
 * Uses Next.js built-in fetch caching.
 */
export async function fetchAllRegistries(): Promise<Registry[]> {
  try {
    const res = await fetch(REGISTRIES_URL, {
      next: {
        // Cache the list for 24 hours
        revalidate: 86400,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch registries: ${res.statusText}`);
    }

    const data = await res.json();
    return data as Registry[];
  } catch (error) {
    console.error("Error in fetchAllRegistries:", error);
    throw error;
  }
}

