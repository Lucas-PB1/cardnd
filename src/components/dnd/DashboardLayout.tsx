import React from 'react';
import { SideMenu } from './SideMenu';

/**
 * Layout component for dashboard pages.
 * Includes the SideMenu and a main content area.
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0c0a09] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] text-[#fdf6e3]">
            <SideMenu />

            <main className="ml-64 p-8 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
