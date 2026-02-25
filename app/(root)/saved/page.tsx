import { Suspense } from "react";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { SAVED_STARTUPS_QUERY } from "@/sanity/lib/queries";
import { redirect } from "next/navigation";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { Bookmark } from "lucide-react";
import { StartupCardSkeleton } from "@/components/StartupCard";

export default function SavedStartupsPage() {
    return (
        <>
            <section className="pink_container !min-h-[160px]">
                <h1 className="heading flex items-center gap-3">
                    <Bookmark className="inline-block" /> Saved Startups
                </h1>
                <p className="sub-heading !max-w-3xl">Your bookmarked startup pitches.</p>
                <a
                    href="/"
                    className="mt-4 inline-flex items-center gap-2 border-[3px] border-black rounded-full px-5 py-2 bg-white text-black font-bold text-sm shadow-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                    ← Back to Home
                </a>
            </section>

            <section className="section_container">
                <Suspense fallback={
                    <ul className="mt-7 card_grid"><StartupCardSkeleton /></ul>
                }>
                    <SavedGrid />
                </Suspense>
            </section>
        </>
    );
}

const SavedGrid = async () => {
    const session = await auth();

    if (!session?.user?.id) redirect("/");

    const savedDocs = await client.fetch(SAVED_STARTUPS_QUERY, {
        authorId: session.user.id,
    });
    const isAdmin = (session.user as any)?.username === "laksh1270";

    const savedStartups: StartupTypeCard[] = savedDocs
        ?.map((doc: any) => doc.startup)
        .filter(Boolean) ?? [];

    return (
        <>
            <p className="text-30-semibold">
                {savedStartups.length} Saved {savedStartups.length === 1 ? "Startup" : "Startups"}
            </p>
            <ul className="mt-7 card_grid">
                {savedStartups.length > 0 ? (
                    savedStartups.map((post) => <StartupCard key={post._id} post={post} currentUserId={session.user.id} isAdmin={isAdmin} />)
                ) : (
                    <p className="no-result">
                        Nothing saved yet. Browse startups and bookmark the ones you love!
                    </p>
                )}
            </ul>
        </>
    );
};
