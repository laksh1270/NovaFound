"use server";

import { auth } from "@/auth";
import slugify from "slugify";
import { writeclient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "@/lib/utils";

export const createPitch = async (
  prevState: any,
  formData: FormData
) => {
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
};
