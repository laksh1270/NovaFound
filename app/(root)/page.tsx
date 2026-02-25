// app/(root)/page.tsx
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY, ADMIN_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { auth } from "@/auth";
import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";

const STARTUPS_PER_PAGE = 9;

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; sort?: string; type?: string; category?: string; page?: string }>;
}) {
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>

        <Suspense fallback={<p>Loading search form...</p>}>
          <SearchFormWrapper searchParams={searchParams} />
        </Suspense>
      </section>

      <Suspense fallback={<p>Loading startups...</p>}>
        <StartupsWrapper searchParams={searchParams} />
      </Suspense>

      <SanityLive />

      <Footer />
    </>
  );
}

const SearchFormWrapper = async ({ searchParams }: { searchParams: Promise<{ query?: string; sort?: string; type?: string; category?: string; page?: string }> }) => {
  const query = (await searchParams).query;
  const categoriesDocs = await client.fetch(ADMIN_CATEGORIES_QUERY) as { _id: string, name: string }[];
  const categories = categoriesDocs?.map(c => c.name) || [];
  return <SearchForm query={query} categories={categories} />;
};

const StartupsWrapper = async ({ searchParams }: { searchParams: Promise<{ query?: string; sort?: string; type?: string; category?: string; page?: string }> }) => {
  const { query, sort, type, category, page } = await searchParams;
  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAdmin = (session?.user as any)?.username === "laksh1270";

  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  // Build a dynamic GROQ query based on sort/type
  const sortOrder =
    sort === "popular" || sort === "trending"
      ? "views desc"
      : "_createdAt desc"; // default: newest

  const typeFilter =
    type === "government"
      ? `&& (startupType == "government" || startupType == "both")`
      : type === "private"
        ? `&& (startupType == "private" || startupType == "both")`
        : "";

  const categoryFilter = category
    ? `&& category match "${category}*"`
    : "";

  const searchFilter = query
    ? `&& (title match "${query}*" || category match "${query}*")`
    : "";

  const groqQuery = `*[_type == "startup" && defined(slug.current) ${searchFilter} ${categoryFilter} ${typeFilter}] | order(${sortOrder}) {
    _id, title, slug, _createdAt,
    author -> { _id, name, image, bio },
    views, description, category, image, startupType
  }`;

  const allPosts = (await client.fetch(groqQuery)) as StartupTypeCard[];

  const totalPages = Math.ceil(allPosts.length / STARTUPS_PER_PAGE);
  const startIndex = (currentPage - 1) * STARTUPS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + STARTUPS_PER_PAGE);

  const filterLabel =
    sort === "trending" ? "🔥 Trending"
      : sort === "popular" ? "⭐ Most Popular"
        : type === "government" ? "🏛️ Government Startups"
          : type === "private" ? "🏢 Private Startups"
            : category ? `📂 Category: ${category}`
              : query ? `Search results for "${query}"`
                : "🆕 Newest Startups";

  return (
    <section className="section_container">
      {/* Filter Bar */}
      <div className="mb-6">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <p className="text-30-semibold">{filterLabel}</p>

      <ul className="mt-7 card_grid">
        {posts?.length ? (
          posts.map((post) => <StartupCard key={post._id} post={post} currentUserId={currentUserId} isAdmin={isAdmin} />)
        ) : (
          <p className="no-result">No startups found</p>
        )}
      </ul>

      {/* Pagination */}
      <Suspense>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </section>
  );
};
