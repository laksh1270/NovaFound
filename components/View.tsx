import React from "react";
import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeclient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews = 0 } =
    (await client
      .withConfig({ useCdn: false })
      .fetch(STARTUP_VIEWS_QUERY, { id })) || {};

  after(async () => {
    await writeclient.patch(id).set({ views: totalViews + 1 }).commit();
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 40,
      }}
    >
      <div
        style={{
          backgroundColor: "#fbcfe8", // light pink
          color: "#000000",           // black text
          border: "2px solid #000000",
          borderRadius: "9999px",
          padding: "8px 14px",
          fontWeight: 600,
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        <span>Views: {totalViews}</span>

        {/* Ping */}
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
          }}
        >
          <Ping />
        </span>
      </div>
    </div>
  );
};

export default View;
