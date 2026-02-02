import React from 'react';
import { User } from 'lucide-react';

interface UserProfileProps {
    email?: string | null;
    level?: number;
}

/**
 * Component for displaying user profile information in the side menu.
 */
export function UserProfile({ email, level = 1 }: UserProfileProps) {
    return (
        <div className="flex items-center gap-3 p-4 bg-stone-800/50 rounded-lg border border-stone-700 shadow-md transform transition-transform hover:scale-[1.02]">
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-red-900 flex items-center justify-center border-2 border-amber-500 shadow-inner">
                    <User className="text-[#fdf6e3] w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 border-2 border-[#1c1917] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#fdf6e3] font-serif">{level}</span>
                </div>
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-[#fdf6e3] font-serif truncate w-32" title={email || 'Unknown Wizard'}>
                    {email?.split('@')[0] || 'Unknown Wizard'}
                </span>
                <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                    Level {level}
                </span>
            </div>
        </div>
    );
}
