"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const SearchForm = ({
  query,
  categories,
}: {
  query?: string;
  categories: string[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    } else {
      params.delete("query");
    }

    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    router.push(`/?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    router.push("/");
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setIsDropdownOpen(false);

    // Auto-navigate immediately
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    } else {
      params.delete("query");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleClearCategory = () => {
    setSelectedCategory("");

    // Auto-navigate immediately
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/?${params.toString()}`);
  };

  const hasInput = searchQuery || selectedCategory;

  return (
    <form onSubmit={handleSubmit} className="search-form">
      {/* Category Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 px-4 py-2 bg-black text-white rounded-full text-sm font-bold whitespace-nowrap hover:bg-gray-800 transition-colors"
        >
          {selectedCategory ? (
            <>
              <span className="max-w-[100px] truncate">{selectedCategory}</span>
              <X
                className="size-4 ml-1 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearCategory();
                }}
              />
            </>
          ) : (
            <>
              <span>Category</span>
              <ChevronDown
                className={`size-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border-[4px] border-black rounded-2xl shadow-lg z-50 max-h-[250px] overflow-y-auto">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-t-xl hover:bg-primary-100 transition-colors ${!selectedCategory ? "bg-primary-100 text-primary" : "text-black"
                }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-primary-100 transition-colors last:rounded-b-xl capitalize ${selectedCategory === cat
                  ? "bg-primary-100 text-primary"
                  : "text-black"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-[3px] h-8 bg-black/20 rounded-full shrink-0" />

      {/* Search Input */}
      <input
        name="query"
        value={searchQuery}
        onChange={(e) => {
          const val = e.target.value;
          setSearchQuery(val);

          // Auto-clear results when search bar is emptied
          if (!val.trim() && searchParams.get("query")) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("query");
            router.push(`/?${params.toString()}`);
          }
        }}
        className="search-input"
        placeholder="Search Startups"
      />

      <div className="flex gap-2">
        {hasInput && (
          <button
            type="button"
            onClick={handleReset}
            className="search-btn text-white"
          >
            <X className="size-5" />
          </button>
        )}

        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;