import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";

// Use same type structure as repo
export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

import DeleteStartupButton from "@/components/DeleteStartupButton";

const StartupCard = ({
  post,
  currentUserId,
  isAdmin,
}: {
  post: StartupTypeCard;
  currentUserId?: string;
  isAdmin?: boolean;
}) => {
  const {
    _id,
    _createdAt,
    title,
    views,
    author,
    image,
    description,
    category,
  } = post;

  const canDelete = currentUserId === author?._id || isAdmin;

  return (
    <li className="startup-card group overflow-hidden w-full h-full flex flex-col">
      {/* Top: Date + Views */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views ?? 0}</span>
        </div>
      </div>

      {/* Middle: Author + Title */}
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1 min-w-0">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1 break-words">
              {author?.name || "Unknown"}
            </p>
          </Link>

          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1 break-all">
              {title ?? "Untitled"}
            </h3>
          </Link>
        </div>

        <Link href={`/user/${author?._id}`}>
          <Image
            src={author?.image || "https://placehold.co/48x48"}
            alt={author?.name || "User"}
            width={48}
            height={48}
            className="rounded-full shrink-0"
          />
        </Link>
      </div>

      {/* Description + Image */}
      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc line-clamp-2 break-words">
          {description ?? "No description available"}
        </p>

        {image && (
          <img
            src={image}
            alt={title || "Startup image"}
            className="startup-card_img"
            loading="lazy"
          />
        )}
      </Link>

      {/* Bottom: Category + Button */}
      <div className="flex-between gap-3 mt-5 mt-auto">
        {category && (
          <Link
            href={`/?query=${category.toLowerCase()}`}
            className="text-sm text-primary line-clamp-1 break-words"
          >
            {category}
          </Link>
        )}

        <div className="flex gap-2 items-center">
          {canDelete && <DeleteStartupButton id={_id} />}
          <Button
            asChild
            className="rounded-3xl bg-black text-white px-4 py-2 hover:bg-gray-900 inline-flex items-center justify-center shrink-0"
          >
            <Link href={`/startup/${_id}`}>View Startup</Link>
          </Button>
        </div>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={index}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
