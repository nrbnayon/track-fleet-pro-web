// components/Landing/Coverage/CoverageSearch.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CoverageSearchProps {
    onSearch?: (query: string) => void;
}

export default function CoverageSearch({ onSearch }: CoverageSearchProps) {
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

        // Pass search query to parent
        onSearch?.(searchQuery);

        toast.success("Search completed", {
            description: `Found coverage areas near ${searchQuery}`,
        });

        setIsSearching(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 h-12 rounded-l-lg rounded-r-none text-base border-r-0 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-1 transition-all"
                        disabled={isSearching}
                    />
                </div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        type="submit"
                        size="lg"
                        className="h-12 px-8 rounded-r-lg rounded-l-none bg-primary hover:bg-primary/90 transition-colors"
                        disabled={isSearching || !searchQuery.trim()}
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </Button>
                </motion.div>
            </form>
        </div>
    );
}