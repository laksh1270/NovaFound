import StartupForm from "@/components/StartupForm"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default function Page() {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Showcase your startup</h1>
      </section>

      <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
        <AuthWrapper />
      </Suspense>
    </>
  );
}

import { client } from "@/sanity/lib/client"
import { ADMIN_CATEGORIES_QUERY } from "@/sanity/lib/queries"

const AuthWrapper = async () => {
  const session = await auth();

  if (!session) redirect("/");

  const categories = await client.fetch(ADMIN_CATEGORIES_QUERY) as { _id: string, name: string }[];
  console.log("Fetched categories from Sanity:", categories);
  const categoryNames = categories?.map(c => c.name) || [];

  return <StartupForm categoriesList={categoryNames} />;
};