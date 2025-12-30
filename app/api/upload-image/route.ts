import { writeclient } from "@/sanity/lib/write-client";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uploaded = await writeclient.assets.upload("image", file, {
      filename: file.name,
    });

    return Response.json({ assetId: uploaded._id });
  } 
  catch (err) {
    console.log(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
