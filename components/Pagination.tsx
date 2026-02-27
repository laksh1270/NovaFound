"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page <= 1) {
            params.delete("page");
        } else {
            params.set("page", String(page));
        }
        router.push(`/?${params.toString()}`);
    };

    // Build page numbers to show
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            {/* Previous */}
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-[#374151] hover:bg-primary hover:text-white dark:hover:text-white hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:dark:hover:border-[#374151]"
            >
                <ChevronLeft className="size-4" />
                Prev
            </button>

            {/* Page Numbers */}
            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400 dark:text-[#9ca3af] text-sm">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                            ? "bg-primary text-white"
                            : "border border-gray-300 dark:border-[#374151] hover:bg-primary hover:text-white dark:hover:text-white hover:border-primary"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-[#374151] hover:bg-primary hover:text-white dark:hover:text-white hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:dark:hover:border-[#374151]"
            >
                Next
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
};

export default Pagination;
