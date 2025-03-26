import { sanityApi } from "@/sanity/lib/queries";
import { SearchForm, StartupList } from "@/src/widgets";
import { StartupListSkeleton } from "@/src/widgets/StartupList/ui/StartupListSkeleton";
import { Suspense } from "react";

interface HomeProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export const Home: React.FC<HomeProps> = async ({ searchParams }) => {
  const query =
    typeof searchParams?.query === "string" ? searchParams.query : undefined;

  const posts = await sanityApi.useStartupsBySearchQuery({
    params: { search: query ?? null },
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup, <br /> Connect with entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Submit Ideas, Submit Ideas
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All "}
        </p>
        <Suspense fallback={<StartupListSkeleton />}>
          <StartupList posts={posts || []} />
        </Suspense>
      </section>
    </>
  );
};
