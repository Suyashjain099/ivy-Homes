import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes conditionally
 * Standard helper function for shadcn/ui components
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
