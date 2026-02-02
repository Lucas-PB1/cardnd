import React from 'react';
import { Loader2 } from 'lucide-react';

interface RuneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export function RuneButton({
    children,
    className,
    isLoading,
    variant = 'primary',
    disabled,
    ...props
}: RuneButtonProps) {
    const baseStyles = "relative px-6 py-3 font-serif font-bold text-lg tracking-wider uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-red-800 text-[#fdf6e3] border-2 border-amber-500 hover:bg-red-700 hover:border-amber-300 shadow-[0_4px_0_rgb(69,10,10)] hover:shadow-[0_2px_0_rgb(69,10,10)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
        secondary: "bg-stone-700 text-[#fdf6e3] border-2 border-stone-500 hover:bg-stone-600 shadow-[0_4px_0_rgb(41,37,36)] hover:shadow-[0_2px_0_rgb(41,37,36)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            <span className="flex items-center justify-center gap-2 drop-shadow-md">
                {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
                {children}
            </span>
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-300 opacity-50"></div>
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-300 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-300 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-300 opacity-50"></div>
        </button>
    );
}
