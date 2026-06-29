"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { RegistryCard } from "@/components/RegistryCard";
import { Registry } from "@/lib/registry";
import { ALL_TAGS, getTagsForRegistry } from "@/lib/tags";
import { Button } from "./ui/button";

interface RegistryHubProps {
  initialRegistries: Registry[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function RegistryHub({ initialRegistries, searchQuery, onSearchChange }: RegistryHubProps) {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  // Pre-compute tags once per registry so filtering is O(n) not O(n * regex)
  const registriesWithTags = React.useMemo(
    () => initialRegistries.map((r) => ({
      registry: r,
      tags: getTagsForRegistry(r.name, r.description),
    })),
    [initialRegistries]
  );

  const filteredRegistries = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return registriesWithTags.filter(({ registry, tags }) => {
      const matchesTag = !activeTag || tags.includes(activeTag);
      const matchesSearch =
        !query ||
        registry.name.toLowerCase().includes(query) ||
        (registry.description && registry.description.toLowerCase().includes(query));
      return matchesTag && matchesSearch;
    });
  }, [searchQuery, activeTag, registriesWithTags]);

  // Only show tags that have at least one matching registry + count per tag
  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const { tags } of registriesWithTags) {
      for (const tag of tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return counts;
  }, [registriesWithTags]);

  const availableTags = ALL_TAGS.filter((t) => tagCounts.has(t));

  const hasFilters = activeTag !== null || searchQuery.trim() !== "";

  return (
    <div className="flex-1 flex flex-col">
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-1.5 w-max pr-10">
                <Badge
                  variant={activeTag === null ? "default" : "outline"}
                  className="cursor-pointer select-none whitespace-nowrap"
                  onClick={() => setActiveTag(null)}
                >
                  All <span className="ml-1 opacity-60">{initialRegistries.length}</span>
                </Badge>
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={activeTag === tag ? "default" : "outline"}
                    className="cursor-pointer select-none whitespace-nowrap"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  >
                    {tag} <span className="ml-1 opacity-60">{tagCounts.get(tag)}</span>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
          </div>

          {/* Clear filters - only visible when filters active */}
          {hasFilters && (
            <Badge
              className="cursor-pointer"
              onClick={() => { setActiveTag(null); onSearchChange(""); }}
            >
              Clear
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4">
        {/* Result count */}
        <p className="text-xs text-muted-foreground">
          {filteredRegistries.length === initialRegistries.length
            ? `${initialRegistries.length} registries`
            : `${filteredRegistries.length} of ${initialRegistries.length} registries`}
          {activeTag && <> · <strong>{activeTag}</strong></>}
          {searchQuery.trim() && <> · &ldquo;{searchQuery.trim()}&rdquo;</>}
        </p>

        {/* Grid */}
        {filteredRegistries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-xl bg-muted/10 text-center gap-2">
            <p className="text-sm text-muted-foreground">No registries found</p>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => { setActiveTag(null); onSearchChange(""); }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRegistries.map(({ registry }) => (
              <RegistryCard key={registry.name} registry={registry} onTagClick={(tag) => setActiveTag(tag)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
