"use client"

import * as React from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { HugeiconsIcon } from "@hugeicons/react"
import { BoxesIcon, SearchIcon, Github01Icon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [])

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 px-4 border-b bg-background">
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-1.5 rounded-lg border bg-muted">
          <HugeiconsIcon icon={BoxesIcon} strokeWidth={2} size={20} />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-sm font-bold">Shadcn Registry Hub</span>
          <span className="text-[10px] text-muted-foreground">Find the best components for your project</span>
        </div>
      </div>

      {/* Search — center */}
      <InputGroup className="max-w-md">
        <InputGroupInput
          ref={inputRef}
          type="search"
          placeholder="Search registries..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon>
          <HugeiconsIcon icon={SearchIcon} />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>Ctrl K</Kbd>
        </InputGroupAddon>
      </InputGroup>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md cursor-pointer"
        >
          <a
            href="https://github.com/soeryaaaid/shadcn-registry-hub"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
          >
            <HugeiconsIcon icon={Github01Icon} className="size-4" />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-md cursor-pointer"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className="size-4">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 3l0 18" />
            <path d="M12 9l4.65 -4.65" />
            <path d="M12 14.3l7.37 -7.37" />
            <path d="M12 19.6l8.85 -8.85" />
          </svg>
        </Button>
      </div>
    </header>
  )
}