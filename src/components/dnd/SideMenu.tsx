'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Scroll, Backpack, BookOpen, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/actions/auth-actions';
import { UserProfile } from './UserProfile';
import { useAuth } from '../providers/AuthContext';

/**
 * Sidebar navigation component for the dashboard.
 */
export function SideMenu() {
    const pathname = usePathname();
    const { user } = useAuth();

    const links = [
        { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/characters', label: 'Character Sheet', icon: Scroll },
        { href: '/inventory', label: 'Inventory', icon: Backpack },
        { href: '/spells', label: 'Spells', icon: BookOpen },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1c1917] border-r border-[#292524] flex flex-col shadow-2xl z-50">
            <div className="p-6 border-b border-[#292524] flex items-center justify-center">
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                    Cardnd
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group
                                ${isActive
                                    ? 'bg-amber-900/30 text-amber-500 border border-amber-900/50'
                                    : 'text-stone-400 hover:text-[#fdf6e3] hover:bg-stone-800'
                                }
                            `}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-500' : 'text-stone-500 group-hover:text-amber-400'}`} />
                            <span className="font-serif font-medium tracking-wide">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#292524] space-y-4">
                <UserProfile email={user?.email} level={5} />

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Abandon Quest
                </button>
            </div>
        </aside>
    );
}
