"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Registry } from "@/lib/registry";
import { getTagsForRegistry } from "@/lib/tags";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01FreeIcons, ArrowRight02FreeIcons } from "@hugeicons/core-free-icons"

interface RegistryCardProps {
  registry: Registry;
  onTagClick?: (tag: string) => void;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
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

  const initials = registry.name.replace(/^@/, "").substring(0, 2).toUpperCase();

  return (
    <Card ref={cardRef} className="flex flex-col h-full justify-between hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in">
      <div className="space-y-3">
        {/* Header: Favicon & Name */}
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded">
              {meta?.favicon ? (
                <img src={meta.favicon} alt="" className="h-full w-full rounded object-contain" />
              ) : (
                <span className="text-xs font-mono font-bold text-muted-foreground">{initials}</span>
              )}
            </div>
            <CardTitle className="text-sm font-mono font-bold text-muted-foreground/75">
              {registry.name}
            </CardTitle>
          </div>
          {registry.githubRepo && (
            <a 
              href={`https://github.com/${registry.githubRepo}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={Github01FreeIcons} className="h-5 w-5" />
              {registry.stars !== undefined && <span>{formatStars(registry.stars)}</span>}
            </a>
          )}
        </CardHeader>

        {/* Content: Title & Description */}
        <CardContent className="space-y-1.5">
          <CardTitle className="text-xs truncate">
            {meta?.title || registry.name.replace(/^@/, "")}
          </CardTitle>
          <CardDescription className="text-[11px] leading-relaxed line-clamp-3">
            {registry.description || "No description provided."}
          </CardDescription>
        </CardContent>
      </div>

      {/* Footer: Tags & Explore Button */}
      <CardFooter className="justify-between">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map(tag => (
            <Badge 
              key={tag} 
              className="text-[9px] text-muted-foreground hover:text-primary bg-muted transition-colors cursor-pointer"
              onClick={() => onTagClick?.(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <a 
          href={registry.homepage} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-semibold group/btn transition-colors"
        >
          <span className="group-hover/btn:text-primary">Explore</span>
          <HugeiconsIcon icon={ArrowRight02FreeIcons} className="h-5 w-5 p-0.5 rounded-full bg-muted group-hover/btn:bg-primary group-hover/btn:text-primary-foreground" />
        </a>
      </CardFooter>
    </Card>
  );
}
