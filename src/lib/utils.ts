import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines tailwind classes using clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
