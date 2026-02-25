import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeclient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews = 0 } =
    (await client
      .withConfig({ useCdn: false })
      .fetch(STARTUP_VIEWS_QUERY, { id })) || {};

  after(async () => {
    try {
      await writeclient.patch(id).set({ views: totalViews + 1 }).commit();
    } catch (error) {
      console.error("Failed to update views in after():", error);
    }
  });

  return (
    <div className="fixed bottom-6 left-6 z-50 group cursor-pointer">
      <div className="relative bg-pink-200 border-[3px] border-black rounded-lg pr-7 pl-5 py-3 font-work-sans font-extrabold text-black text-[16px] shadow-100 transition-all duration-500 group-hover:shadow-300 group-hover:-translate-y-1 group-hover:-translate-x-1 flex items-center justify-center">
        <span className="tracking-wide">Views: {totalViews}</span>

        <span className="absolute top-2 right-2 flex size-[11px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full size-[11px] bg-primary"></span>
        </span>
      </div>
    </div>
  );
};

export default View;
