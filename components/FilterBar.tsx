"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const FILTERS = [
    { label: "🔥 Trending", value: "trending" },
    { label: "⭐ Most Popular", value: "popular" },
    { label: "🆕 Newest", value: "newest" },
    { label: "🏛️ Government", value: "government" },
    { label: "🏢 Private", value: "private" },
];

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeFilter = searchParams.get("sort") || searchParams.get("type") || "newest";

    const handleFilter = (filter: { value: string }) => {
        const params = new URLSearchParams(searchParams.toString());
        // Clear both sort and type first
        params.delete("sort");
        params.delete("type");

        if (filter.value === "government" || filter.value === "private") {
            params.set("type", filter.value);
        } else {
            params.set("sort", filter.value);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClearFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("sort");
        params.delete("type");
        router.push(`${pathname}?${params.toString()}`);
    };

    const isActive = (value: string) => activeFilter === value;

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="font-bold text-sm text-gray-500 mr-1">Browse:</span>
            {FILTERS.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => handleFilter(filter)}
                    className={`px-4 py-2 rounded-full border-[3px] border-black text-sm font-bold transition-all ${isActive(filter.value)
                            ? "bg-primary text-white shadow-100 -translate-y-0.5 -translate-x-0.5"
                            : "bg-white hover:bg-primary-100"
                        }`}
                >
                    {filter.label}
                </button>
            ))}

            {(searchParams.get("sort") || searchParams.get("type")) && (
                <button
                    onClick={handleClearFilter}
                    className="text-sm font-bold text-primary underline hover:opacity-60"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
