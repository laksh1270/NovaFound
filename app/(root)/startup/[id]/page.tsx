import { STARTUPS_BY_ID_QUERY, COMMENTS_BY_STARTUP_QUERY, IS_STARTUP_SAVED_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it"
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import CommentsClient from "@/components/CommentsClient";
import SaveButton from "@/components/SaveButton";
import ShareStartupButton from "@/components/ShareStartupButton";
import { auth } from "@/auth";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const md = markdownit();

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Suspense fallback={
        <>
          <section className="pink_container !min-h-[230px]">
            <p className="tag">Loading...</p>
            <h1 className="heading mt-5">Startup Details</h1>
            <p className="sub-heading !max-w-5xl">Loading details...</p>
          </section>
          <section className="section_container">
            <Skeleton className="w-full max-w-7xl mx-auto h-[300px] rounded-xl" />
          </section>
        </>
      }>
        <StartupDetailsWrapper params={params} />
      </Suspense>

      <section className="section_container">
        <hr className="divider" />

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <ViewWrapper params={params} />
        </Suspense>
      </section>
    </>
  );
}

const StartupDetailsWrapper = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const post = await client.fetch(STARTUPS_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const session = await auth();
  const parsedContent = md.render(post?.pitch || '');

  // Fetch comments
  const comments = await client.fetch(COMMENTS_BY_STARTUP_QUERY, { startupId: id }) ?? [];

  // Check if saved by current user
  let isSaved = false;
  if (session?.user?.id) {
    const savedDoc = await client.fetch(IS_STARTUP_SAVED_QUERY, {
      authorId: session.user.id,
      startupId: id,
    });
    isSaved = !!savedDoc?._id;
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading mt-5">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <div className="aspect-[16/6] w-full max-w-7xl mx-auto">
          <img
            src={post.image}
            alt="thumbnail"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3 sm:mb-0"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">@{post.author.username}</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 flex-wrap">
              <p className="category-tag">{post.category}</p>
              <ShareStartupButton />
              {session?.user?.id && (
                <SaveButton startupId={id} initialSaved={isSaved} />
              )}
            </div>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article className="prose test-prose max-w-4xl font-work-sans font-bold break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} />
          ) : (
            <p className="no-result">No Details provided</p>
          )}

          {/* Contact Details Section */}
          {post.contactInfo && (
            <div className="mt-8 mb-8 border-[3px] border-black rounded-3xl p-6 bg-white shadow-100 flex flex-col gap-4">
              <h3 className="text-24-black">Contact Information</h3>

              {!session?.user?.id ? (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 text-center">
                  <p className="text-black font-medium mb-3">To protect the founder's privacy, contact details are hidden for guests.</p>
                  <form
                    action={async () => {
                      "use server";
                      const { signIn } = await import("@/auth");
                      await signIn("github");
                    }}
                  >
                    <button type="submit" className="startup-card_btn w-fit mx-auto">
                      Login with GitHub to View
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  {post.contactInfo.email && (
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <Mail className="size-5 text-primary" />
                      </div>
                      <a href={`mailto:${post.contactInfo.email}`} className="text-16-medium font-bold text-black hover:text-primary transition-colors truncate">
                        {post.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {post.contactInfo.phone && (
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <Phone className="size-5 text-primary" />
                      </div>
                      <a href={`tel:${post.contactInfo.phone}`} className="text-16-medium font-bold text-black hover:text-primary transition-colors truncate">
                        {post.contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {post.contactInfo.address && (
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <MapPin className="size-5 text-primary" />
                      </div>
                      <span className="text-16-medium font-bold text-black break-words">
                        {post.contactInfo.address}
                      </span>
                    </div>
                  )}
                  {post.contactInfo.website && (
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <Globe className="size-5 text-primary" />
                      </div>
                      <a href={post.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-16-medium font-bold text-black hover:text-primary transition-colors truncate">
                        {post.contactInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <hr className="divider" />

          {/* Comments Section */}
          <CommentsClient
            startupId={id}
            initialComments={comments}
            sessionUserId={session?.user?.id}
            startupOwnerId={post.author._id}
          />
        </div>
      </section>
    </>
  );
};

const ViewWrapper = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return <View id={id} />;
};
