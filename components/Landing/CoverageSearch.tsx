// components/landing/CoverageSearch.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CoverageSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            toast.error("Please enter a location to search");
            return;
        }

        setIsSearching(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Search completed", {
            description: `Found coverage areas near ${searchQuery}`,
        });

        setIsSearching(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 sm:gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 h-12 rounded-lg text-base"
                        disabled={isSearching}
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    className="h-12 px-8 rounded-lg"
                    disabled={isSearching || !searchQuery.trim()}
                >
                    {isSearching ? "Searching..." : "Search"}
                </Button>
            </form>
        </div>
    );
}