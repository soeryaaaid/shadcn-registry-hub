"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { RegistryHub } from "@/components/RegistryHub";
import { Registry } from "@/lib/registry";

export function RegistryPageClient({ registries }: { registries: Registry[] }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <RegistryHub
        initialRegistries={registries}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
