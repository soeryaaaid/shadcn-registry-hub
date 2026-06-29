"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Registry } from "@/lib/registry";
import { getTagsForRegistry } from "@/lib/tags";
import { HugeiconsIcon } from "@hugeicons/react";
import { ExternalLinkIcon } from "@hugeicons/core-free-icons";

interface RegistryCardProps {
  registry: Registry;
  onTagClick?: (tag: string) => void;
}

export function RegistryCard({ registry, onTagClick }: RegistryCardProps) {
  const [meta, setMeta] = React.useState<{ title: string; favicon: string } | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const tags = getTagsForRegistry(registry.name, registry.description);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        fetch(`/api/registry-metadata?url=${encodeURIComponent(registry.homepage)}`)
          .then(res => res.json())
          .then(setMeta)
          .catch(() => setMeta({ title: "", favicon: "" }));
        observer.disconnect();
      }
    }, { rootMargin: "100px" });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [registry.homepage]);

  return (
    <Card ref={cardRef} className="flex flex-col h-full justify-between hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      <div>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded overflow-hidden ${!meta ? "animate-pulse" : ""}`}>
            {meta?.favicon ? (
              <img src={meta.favicon} alt="" className="h-full w-full object-contain"
                loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                {registry.name.substring(1, 3).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-[10px] text-muted-foreground truncate">{registry.name}</CardTitle>
            <span className="text-xs font-bold truncate block">{meta?.title || registry.name}</span>
          </div>
        </CardHeader>
        <CardContent className="mt-2">
          <CardDescription className="text-[11px] line-clamp-2 leading-snug">
            {registry.description}
          </CardDescription>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col items-start gap-2 mt-auto">
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary"
              className={`text-[9px] px-1 py-0 ${onTagClick ? "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" : ""}`}
              onClick={() => onTagClick?.(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <a href={registry.homepage} target="_blank" rel="noreferrer"
          className="text-[10px] text-primary hover:underline font-medium inline-flex items-center gap-1"
        >
          Visit Homepage
          <HugeiconsIcon icon={ExternalLinkIcon} className="w-3 h-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
