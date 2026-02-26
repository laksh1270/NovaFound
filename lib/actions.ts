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
  const pitch = formData.get("pitch") as string;
  const startupType = formData.get("startupType") as string || "private";

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const website = formData.get("website") as string;

  if (!title || !description || !category || !pitch) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "All fields are required",
    });
  }

  // Handle Image Upload or URL
  let finalImageUrl = formData.get("imageUrl") as string;
  const imageFile = formData.get("imageFile") as File;

  // If a file was uploaded, upload it to Sanity and get the URL
  if (imageFile && imageFile.size > 0) {
    try {
      // Pass the File directly to Sanity (supported natively by client).
      // Using Buffer.from() often fails in Vercel Serverless/Edge functions.
      const asset = await writeclient.assets.upload('image', imageFile, {
        filename: imageFile.name,
        contentType: imageFile.type
      });

      finalImageUrl = asset.url;
    } catch (err: any) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Failed to upload image: " + err.message,
      });
    }
  }

  if (!finalImageUrl) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "An Image URL or an uploaded image is required",
    });
  }

  const contactInfo = {
    ...(email?.trim() && { email: email.trim() }),
    ...(phone?.trim() && { phone: phone.trim() }),
    ...(address?.trim() && { address: address.trim() }),
    ...(website?.trim() && { website: website.trim() }),
  };

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
    startupType,
    author: {
      _type: "reference",
      _ref: session.user.id,
    },
    image: finalImageUrl,
    ...(Object.keys(contactInfo).length > 0 && { contactInfo }),
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

    const isAdmin = (session.user as any)?.username === "laksh1270";

    if (!isAdmin && startup.author?._id !== session.user.id) {
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

/* ===============================
   CREATE COMMENT
   =============================== */
export async function createComment(
  startupId: string,
  content: string,
  parentCommentId?: string
) {
  const session = await auth();
  if (!session?.user?.id) return parseServerActionResponse({ status: "ERROR", error: "Not authenticated" });
  if (!content.trim()) return parseServerActionResponse({ status: "ERROR", error: "Comment cannot be empty" });

  try {
    const doc: any = {
      _type: "comment",
      content: content.trim(),
      author: { _type: "reference", _ref: session.user.id },
      startup: { _type: "reference", _ref: startupId },
    };
    if (parentCommentId) {
      doc.parentComment = { _type: "reference", _ref: parentCommentId };
    }
    const created = await writeclient.create(doc);
    return parseServerActionResponse({ status: "SUCCESS", _id: created._id });
  } catch (err: any) {
    return parseServerActionResponse({ status: "ERROR", error: err.message || "Failed to post comment" });
  }
}

/* ===============================
   TOGGLE SAVE STARTUP (Bookmark)
   =============================== */
export async function toggleSaveStartup(startupId: string) {
  const session = await auth();
  if (!session?.user?.id) return parseServerActionResponse({ status: "ERROR", error: "Not authenticated" });

  try {
    const existing = await writeclient.fetch(
      `*[_type == "savedStartup" && author._ref == $authorId && startup._ref == $startupId][0]{ _id }`,
      { authorId: session.user.id, startupId }
    );

    if (existing?._id) {
      await writeclient.delete(existing._id);
      return parseServerActionResponse({ status: "SUCCESS", saved: false });
    } else {
      await writeclient.create({
        _type: "savedStartup",
        author: { _type: "reference", _ref: session.user.id },
        startup: { _type: "reference", _ref: startupId },
      });
      return parseServerActionResponse({ status: "SUCCESS", saved: true });
    }
  } catch (err: any) {
    return parseServerActionResponse({ status: "ERROR", error: err.message || "Failed to save startup" });
  }
}

/* ===============================
   CREATE CATEGORY (ADMIN ONLY)
   =============================== */
export async function createCategory(name: string) {
  const session = await auth();
  if ((session?.user as any)?.username !== "laksh1270") {
    return parseServerActionResponse({ status: "ERROR", error: "Forbidden: Admin access required" });
  }

  if (!name || !name.trim()) {
    return parseServerActionResponse({ status: "ERROR", error: "Category name is required" });
  }

  try {
    const created = await writeclient.create({
      _type: "category",
      name: name.trim(),
    });
    return parseServerActionResponse({ status: "SUCCESS", _id: created._id });
  } catch (err: any) {
    return parseServerActionResponse({ status: "ERROR", error: err.message || "Failed to create category" });
  }
}

/* ===============================
   DELETE CATEGORY (ADMIN ONLY)
   =============================== */
export async function deleteCategory(categoryId: string) {
  const session = await auth();
  if ((session?.user as any)?.username !== "laksh1270") {
    return parseServerActionResponse({ status: "ERROR", error: "Forbidden: Admin access required" });
  }

  try {
    await writeclient.delete(categoryId);
    return parseServerActionResponse({ status: "SUCCESS" });
  } catch (err: any) {
    return parseServerActionResponse({ status: "ERROR", error: err.message || "Failed to delete category" });
  }
}
