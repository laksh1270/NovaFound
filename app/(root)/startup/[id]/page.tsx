// app/(root)/startup/[id]/page.tsx
import { STARTUPS_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it"
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdownit();

export const experimental_ppr = true;

export default async function Page(props: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // ✅ Handle both async and sync params
  const resolvedParams = await Promise.resolve(props.params);
  const { id } = resolvedParams;

  if (!id) {
    console.error("❌ No ID provided in route params");
    return notFound();
  }

  const post = await client.fetch(STARTUPS_BY_ID_QUERY, { id });

  if (!post) return notFound();
  
  const parsedContent = md.render(post?.pitch || ''); 

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
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
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
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
            
            <p className="category-tag">{post.category}</p>
          </div>
            <h3 className="text-30-bold">Pitch Details</h3>
            {parsedContent ?(
              <article className="prose test-prose max-w-4xl font-work-sans font-bold break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} />
            ) : (
              <p className="no-result">No Deatils provider</p>
            )}
        </div>
        
        <hr className="divider" />
        {/* TODO: EDITIOR SELECTED STARTUPS  */}
        
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
        </Suspense>
        
      </section>
    </>
  );
}
