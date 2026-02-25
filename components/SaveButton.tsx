"use client";

import { useState, useTransition } from "react";
import { toggleSaveStartup } from "@/lib/actions";
import { Bookmark, BookmarkCheck } from "lucide-react";

type Props = {
    startupId: string;
    initialSaved: boolean;
};

export default function SaveButton({ startupId, initialSaved }: Props) {
    const [saved, setSaved] = useState(initialSaved);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleSaveStartup(startupId);
            if (res.status === "SUCCESS") {
                setSaved(res.saved as boolean);
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            title={saved ? "Remove from saved" : "Save startup"}
            className={`flex items-center gap-1.5 border-[3px] border-black rounded-full px-3 py-1.5 text-sm font-bold transition-all shadow-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 ${saved
                    ? "bg-primary text-white"
                    : "bg-white text-black hover:bg-primary-100"
                }`}
        >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {saved ? "Saved" : "Save"}
        </button>
    );
}
