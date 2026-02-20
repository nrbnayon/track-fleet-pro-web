import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}


 export  const getImageUrl = (imagePath?: string | null, defaultUrl: string = "/drivers/driver.jpg") => {
        if (!imagePath || imagePath === "null" || imagePath === "undefined") return defaultUrl;

        if (imagePath.startsWith("/profiles-images/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}/images${imagePath.replace("/profiles-images", "")}`;
        }

        if (imagePath.startsWith("/") || imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return imagePath;
        }

        return defaultUrl;
    };