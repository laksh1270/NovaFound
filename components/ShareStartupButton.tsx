"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export default function ShareStartupButton() {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        // Get the current URL only on the client side
        setUrl(window.location.href);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    };

    if (!url) return null; // Prevent rendering during SSR mismatch

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 border-[3px] border-black rounded-full px-5 py-2 font-bold text-sm transition-all shadow-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${copied ? "bg-black text-white" : "bg-white text-black hover:bg-primary-100"
                }`}
        >
            {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
            {copied ? "Link Copied!" : "Share Startup"}
        </button>
    );
}
