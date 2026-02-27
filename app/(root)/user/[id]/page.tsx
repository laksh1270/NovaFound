import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { ADMIN_CATEGORIES_QUERY, AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import AdminPanel from "@/components/AdminPanel";


export default function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  return (
    <>
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfileWrapper params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const UserProfileWrapper = async ({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) => {
  const { id } = await params;
  const { tab } = await searchParams;

  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) return notFound();

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <Image
          src={user.image}
          alt={user.name}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-30-extrabold mt-7 text-center">
          @{user?.username}
        </p>
        <p className="mt-1 text-center text-14-normal">{user?.bio}</p>

        {session?.user?.id === id && (
          <div className="mt-4 flex flex-col gap-3 w-full">
            <a
              href="/saved"
              className="flex items-center justify-center gap-2 border-[3px] border-black dark:border-[#374151] rounded-full px-5 py-2 font-bold text-sm bg-white dark:bg-[#1a1c23] text-black dark:text-white hover:bg-primary-100 dark:hover:bg-[#374151] shadow-100 hover:shadow-none transition-all"
            >
              🔖 Saved Startups
            </a>

            {(session?.user as any)?.username === "laksh1270" && (
              tab === "admin" ? (
                <a
                  href={`/user/${id}`}
                  className="flex items-center justify-center gap-2 border-[3px] border-black dark:border-[#374151] rounded-full px-5 py-2 font-bold text-sm bg-white dark:bg-[#1a1c23] text-black dark:text-white hover:bg-primary-100 dark:hover:bg-[#374151] shadow-100 hover:shadow-none transition-all"
                >
                  🚀 View Startups
                </a>
              ) : (
                <a
                  href={`/user/${id}?tab=admin`}
                  className="flex items-center justify-center gap-2 border-[3px] border-black dark:border-[#374151] rounded-full px-5 py-2 font-bold text-sm bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                >
                  🛠️ Admin Panel
                </a>
              )
            )}
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {tab === "admin" ? "Admin Control Panel" : (session?.user?.id === id ? "Your Startups" : "All Startups")}
        </p>

        {tab === "admin" && (session?.user as any)?.username === "laksh1270" ? (
          <Suspense fallback={<p>Loading Admin Panel...</p>}>
            <AdminPanelLoader />
          </Suspense>
        ) : (
          <div className="w-full">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  );
};

const AdminPanelLoader = async () => {
  const categories = await client.fetch(ADMIN_CATEGORIES_QUERY);
  return <AdminPanel initialCategories={categories} />;
};
