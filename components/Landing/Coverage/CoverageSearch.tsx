// components/Landing/Coverage/CoverageSearch.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CoverageSearchProps {
    onSearch?: (query: string) => void;
}

interface LocationSuggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

export default function CoverageSearch({ onSearch }: CoverageSearchProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsFetchingSuggestions(true);

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
                );
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            } finally {
                setIsFetchingSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            toast.error("Please enter a location to search");
            return;
        }

        setIsSearching(true);
        setShowSuggestions(false);

        // Pass search query to parent
        onSearch?.(searchQuery);

        // Give a moment for the geocoding to complete
        setTimeout(() => {
            setIsSearching(false);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion: LocationSuggestion) => {
        setSearchQuery(suggestion.display_name);
        setShowSuggestions(false);
        onSearch?.(suggestion.display_name);
    };

    return (
        <div className="max-w-2xl mx-auto" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex relative">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                        type="text"
                        placeholder="Search for a city, address, or landmark..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 h-12 rounded-l-lg rounded-r-none text-base border-r-0 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-1 transition-all"
                        disabled={isSearching}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                    />
                    {isFetchingSuggestions && (
                        <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                    )}

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
                            >
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.place_id}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {suggestion.display_name.split(',')[0]}
                                            </p>
                                            <p className="text-xs text-secondary truncate">
                                                {suggestion.display_name}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
