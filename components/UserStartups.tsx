import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard from "@/components/StartupCard";
import DeleteStartupButton from "@/components/DeleteStartupButton";

const UserStartups = async ({ id }: { id: string }) => {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

  if (!startups || startups.length === 0) {
    return (
      <div className="col-span-full no-result">
        No posts yet
      </div>
    );
  }

  return (
    <>
      {startups.map((startup: any) => (
        <div key={startup._id} className="relative">
          {/* StartupCard already renders <li /> */}
          <StartupCard post={startup} />

          <div className="mt-3 flex justify-end">
            <DeleteStartupButton id={startup._id} />
          </div>
        </div>
      ))}
    </>
  );
};

export default UserStartups;
