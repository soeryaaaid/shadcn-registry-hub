import { RegistryPageClient } from "@/components/RegistryPageClient";
import { fetchAllRegistries } from "@/lib/registry";

export default async function Home() {
  const registries = await fetchAllRegistries();
  return <RegistryPageClient registries={registries} />;
}
