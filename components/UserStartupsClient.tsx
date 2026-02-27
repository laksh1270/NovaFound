"use client";

import { useState, useMemo } from "react";
import StartupCard from "@/components/StartupCard";
import DeleteStartupButton from "@/components/DeleteStartupButton";
import { Button } from "@/components/ui/button";

type UserStartupsClientProps = {
    startups: any[];
    currentUserId?: string;
    isAdmin?: boolean;
    adminCategories?: string[];
};

const ITEMS_PER_PAGE = 4;

const DATE_OPTIONS = [
    { label: "All Time", value: "all" },
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
    { label: "Last 90 Days", value: "90" },
];

export default function UserStartupsClient({ startups, currentUserId, isAdmin, adminCategories = [] }: UserStartupsClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedDate, setSelectedDate] = useState<string>("all");
    const [categoryOpen, setCategoryOpen] = useState(false);

    const categories = useMemo(() => {
        return ["All", ...adminCategories];
    }, [adminCategories]);

    const filteredStartups = useMemo(() => {
        let result = startups;
        if (selectedCategory !== "All") {
            result = result.filter((s) => s.category === selectedCategory);
        }
        if (selectedDate !== "all") {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(selectedDate));
            result = result.filter((s) => new Date(s._createdAt) >= daysAgo);
        }
        return result;
    }, [startups, selectedCategory, selectedDate]);

    const totalPages = Math.ceil(filteredStartups.length / ITEMS_PER_PAGE);

    const paginatedStartups = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStartups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStartups, currentPage]);

    const resetFilters = () => {
        setSelectedCategory("All");
        setSelectedDate("all");
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Category Dropdown */}
                <div className="relative z-30">
                    <button
                        type="button"
                        onClick={() => setCategoryOpen((o) => !o)}
                        className="flex items-center gap-2 border-[3px] border-black dark:border-[#374151] rounded-full px-4 py-2 bg-white dark:bg-[#1a1c23] text-black dark:text-white font-semibold text-sm shadow-100 dark:shadow-[2px_2px_0px_0px_#374151] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" /></svg>
                        <span>{selectedCategory === "All" ? "Category" : selectedCategory}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {categoryOpen && (
                        <div className="absolute top-[calc(100%+6px)] left-0 bg-white dark:bg-[#1a1c23] border-[3px] border-black dark:border-[#374151] rounded-2xl shadow-200 dark:shadow-[2px_2px_0px_2px_#374151] overflow-hidden min-w-[200px]">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { setSelectedCategory(cat); setCategoryOpen(false); setCurrentPage(1); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium border-b border-gray-100 dark:border-[#374151] text-black dark:text-white last:border-0 transition-colors hover:bg-primary-100 dark:hover:bg-[#374151] ${selectedCategory === cat ? "bg-primary text-white dark:bg-primary dark:text-white font-bold hover:bg-primary dark:hover:bg-primary" : ""}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Filter via native select */}
                <div className="relative flex items-center border-[3px] border-black dark:border-[#374151] rounded-full bg-white dark:bg-[#1a1c23] text-black dark:text-white shadow-100 dark:shadow-[2px_2px_0px_0px_#374151] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 shrink-0 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <select
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                        className="appearance-none pl-2 pr-8 py-2 text-sm font-semibold bg-transparent dark:bg-[#1a1c23] dark:text-white outline-none cursor-pointer"
                    >
                        {DATE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-white text-black dark:bg-[#1a1c23] dark:text-white">{opt.label}</option>
                        ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-2.5 pointer-events-none text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {/* Clear filters */}
                {(selectedCategory !== "All" || selectedDate !== "all") && (
                    <button onClick={resetFilters} className="flex items-center gap-1 text-sm font-bold text-primary border-b-2 border-primary hover:opacity-70 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Clear
                    </button>
                )}
            </div>

            {/* Overlay to close category dropdown */}
            {categoryOpen && <div className="fixed inset-0 z-20" onClick={() => setCategoryOpen(false)} />}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {paginatedStartups.length > 0 ? (
                    paginatedStartups.map((startup: any) => (
                        <div key={startup._id} className="flex flex-col h-full">
                            <div className="flex-1 h-full">
                                <StartupCard post={startup} currentUserId={currentUserId} isAdmin={isAdmin} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full no-result py-10 text-center">
                        No startups found for the selected filters.
                    </p>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap justify-between items-center gap-3 mt-2 pt-4 border-t-[3px] border-dashed border-black dark:border-[#374151]">
                    <Button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                        className="startup-card_btn !bg-black dark:!bg-white !text-white dark:!text-black !font-bold !border-[3px] !border-black dark:!border-[#374151] disabled:opacity-40"
                    >
                        ← Prev
                    </Button>

                    <div className="flex gap-2 flex-wrap justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-full border-[3px] border-black dark:border-[#374151] font-bold text-sm transition-all ${currentPage === page
                                    ? "bg-primary text-white shadow-100 -translate-y-0.5 -translate-x-0.5"
                                    : "bg-white text-black dark:bg-[#1a1c23] dark:text-white hover:bg-primary-100 dark:hover:bg-[#374151]"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                        className="startup-card_btn !bg-black dark:!bg-white !text-white dark:!text-black !font-bold !border-[3px] !border-black dark:!border-[#374151] disabled:opacity-40"
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    );
}
