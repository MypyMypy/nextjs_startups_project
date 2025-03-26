import { Home } from "@/src/pages/home";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const sParams = await searchParams;

  return <Home searchParams={sParams} />;
}
