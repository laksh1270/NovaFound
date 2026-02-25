import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY, ADMIN_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import UserStartupsClient from "./UserStartupsClient";

import { auth } from "@/auth";

const UserStartups = async ({ id }: { id: string }) => {
  const session = await auth();
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

  const categoriesDocs = await client.fetch(ADMIN_CATEGORIES_QUERY) as { _id: string, name: string }[];
  const adminCategories = categoriesDocs?.map(c => c.name) || [];

  if (!startups || startups.length === 0) {
    return (
      <div className="col-span-full no-result">
        No posts yet
      </div>
    );
  }

  const isAdmin = (session?.user as any)?.username === "laksh1270";

  return <UserStartupsClient startups={startups} currentUserId={session?.user?.id} isAdmin={isAdmin} adminCategories={adminCategories} />;
};

export default UserStartups;
