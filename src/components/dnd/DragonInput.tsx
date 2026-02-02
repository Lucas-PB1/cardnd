import React from 'react';
import { cn } from '@/lib/utils';

interface DragonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

/**
 * A themed input component with a dragon-inspired aesthetic.
 */
export function DragonInput({ className, label, id, ...props }: DragonInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="text-amber-900 font-serif font-bold text-lg tracking-wide drop-shadow-sm"
                >
                    {label}
                </label>
            )}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                <input
                    id={id}
                    className={cn(`relative w-full bg-[#fdf6e3] text-stone-800 border-2 border-[#d4c5a0] 
            rounded-md px-4 py-2 font-serif text-lg shadow-inner placeholder:text-stone-400
            focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600
            transition-all duration-300`, className)}
                    {...props}
                />
            </div>
        </div>
    );
}
