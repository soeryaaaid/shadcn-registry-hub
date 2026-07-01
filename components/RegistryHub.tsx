"use client";

import * as React from "react";
import { RegistryCard } from "@/components/RegistryCard";
import { Registry } from "@/lib/registry";
import { ALL_TAGS, getTagsForRegistry } from "@/lib/tags";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01FreeIcons, ArrowDownAzFreeIcons, FilterRemoveFreeIcons } from "@hugeicons/core-free-icons";

interface RegistryHubProps {
  initialRegistries: Registry[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

type SortBy = "stars" | "name";

export function RegistryHub({ initialRegistries, searchQuery, onSearchChange }: RegistryHubProps) {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [sortBy, setSortBy] = React.useState<SortBy>("stars");

  // Combined Memo: Map, filter, and sort in one single clean pass
  const filtered = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialRegistries
      .map(r => ({ r, tags: getTagsForRegistry(r.name, r.description) }))
      .filter(({ r, tags }) => 
        (!activeTag || tags.includes(activeTag)) && 
        (!q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
      )
      .sort((a, b) => sortBy === "stars" 
        ? (b.r.stars ?? -1) - (a.r.stars ?? -1) 
        : a.r.name.localeCompare(b.r.name)
      );
  }, [initialRegistries, searchQuery, activeTag, sortBy]);

  // Count active tags efficiently
  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    initialRegistries.forEach(r => 
      getTagsForRegistry(r.name, r.description).forEach(t => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    return counts;
  }, [initialRegistries]);

  const hasFilters = activeTag !== null || searchQuery.trim() !== "";

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 h-14 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex gap-3">
          {/* Scrollable Tags */}
          <div className="relative min-w-0 flex">
            <ToggleGroup
              type="single"
              value={activeTag || "all"}
              onValueChange={(val) => setActiveTag(val === "all" || !val ? null : val)}
              variant="outline"
              className="overflow-x-auto scrollbar-none pr-8"
            >
              <ToggleGroupItem value="all" className="text-xs bg-card data-[state=on]:bg-primary/20 cursor-pointer">
                All <span className="ml-1 opacity-50 text-[10px]">{initialRegistries.length}</span>
              </ToggleGroupItem>
              {ALL_TAGS.filter(t => tagCounts.has(t)).map((tag) => (
                <ToggleGroupItem key={tag} value={tag} className="text-xs bg-card data-[state=on]:bg-primary/20 cursor-pointer">
                  {tag} <span className="ml-1 opacity-50 text-[10px]">{tagCounts.get(tag)}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent z-10" />
          </div>

          {/* Controls */}
          <div className="flex items-center shrink-0 gap-3">
            {hasFilters && (
              <Button variant="outline" className="text-xs text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => { setActiveTag(null); onSearchChange(""); }}>
                <HugeiconsIcon icon={FilterRemoveFreeIcons} />
                Clear
              </Button>
            )}

            <ToggleGroup type="single" value={sortBy} onValueChange={(val) => val && setSortBy(val as SortBy)} variant="outline" className="border rounded-lg p-0.5 gap-0.5">
              <ToggleGroupItem value="stars" className="text-[11px] rounded-md data-[state=on]:bg-muted data-[state=on]:text-foreground data-[state=on]:shadow-sm border-none cursor-pointer">
                <HugeiconsIcon icon={Github01FreeIcons} />
                <span>Stars</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="name" className="text-[11px] rounded-md data-[state=on]:bg-muted data-[state=on]:text-foreground data-[state=on]:shadow-sm border-none cursor-pointer">
                <HugeiconsIcon icon={ArrowDownAzFreeIcons} />
                <span>Name</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <main className="w-full max-w-7xl mx-auto p-4 md:px-6 space-y-4">
        <p className="text-xs text-muted-foreground">
          {filtered.length === initialRegistries.length
            ? `${initialRegistries.length} registries`
            : `${filtered.length} of ${initialRegistries.length} registries`}
          {activeTag && <> · <strong>{activeTag}</strong></>}
          {searchQuery.trim() && <> · &ldquo;{searchQuery.trim()}&rdquo;</>}
        </p>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-200px)] border border-dashed rounded-xl gap-3">
            <p className="text-sm text-muted-foreground">No registries found</p>
            <Button variant={"outline"} className="bg-muted text-muted-foreground cursor-pointer" onClick={() => { setActiveTag(null); onSearchChange(""); }}>
              <HugeiconsIcon icon={FilterRemoveFreeIcons} />
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(({ r }) => (
              <RegistryCard key={r.name} registry={r} onTagClick={(tag) => setActiveTag(tag)} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
