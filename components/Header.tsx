"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { BoxesIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"

export function Header() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg border bg-muted">
          <HugeiconsIcon icon={BoxesIcon} strokeWidth={2} size={24} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-lg font-bold">Shadcn Registry Hub</h1>
          <p className="text-xs text-muted-foreground">Find the best components for your project</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
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