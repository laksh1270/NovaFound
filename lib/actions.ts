"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeclient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "@/lib/utils";

/* ===============================
   CREATE STARTUP
   =============================== */
export async function createPitch(
  _prevState: any,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not authenticated",
    });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const pitch = formData.get("pitch") as string;

  if (!title || !description || !category || !imageUrl || !pitch) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "All fields are required",
    });
  }

  const doc = await writeclient.create({
    _type: "startup",
    title,
    description,
    category,
    pitch,
    views: 0,
    slug: {
      _type: "slug",
      current: slugify(title, { lower: true, strict: true }),
    },
    author: {
      _type: "reference",
      _ref: session.user.id,
    },
    image: imageUrl,
  });

  return parseServerActionResponse({
    status: "SUCCESS",
    _id: doc._id,
  });
}

/* ===============================
   DELETE STARTUP
   =============================== */
export async function deleteStartup(startupId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Not authenticated",
    });
  }

  try {
    const startup = await writeclient.fetch(
      `*[_type=="startup" && _id==$id][0]{ _id, author->{_id} }`,
      { id: startupId }
    );

    if (!startup) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Startup not found",
      });
    }

    if (startup.author?._id !== session.user.id) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Not allowed",
      });
    }

    // find all references
    const refs: { _id: string }[] = await writeclient.fetch(
      `*[_id != $id && references($id)]{ _id }`,
      { id: startupId }
    );

    const tx = writeclient.transaction();

    refs.forEach((ref) => tx.delete(ref._id));
    tx.delete(`drafts.${startupId}`);
    tx.delete(startupId);

    await tx.commit({ visibility: "async" });

    return parseServerActionResponse({
      status: "SUCCESS",
    });
  } catch (err: any) {
    return parseServerActionResponse({
      status: "ERROR",
      error: err.message || "Delete failed",
    });
  }
}
