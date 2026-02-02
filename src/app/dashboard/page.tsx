'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dnd/DashboardLayout';
import { useAuth } from '@/components/providers/AuthContext';
import { Loader2, Sword, Shield, Coins, Crown } from 'lucide-react';
import { ScrollCard } from '@/components/dnd/ScrollCard';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center text-amber-600">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-xl border border-amber-900/50 bg-gradient-to-r from-red-950 to-amber-950 p-8 shadow-2xl">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-serif font-bold text-[#fdf6e3] mb-2 drop-shadow-md">
                            Welcome back, <span className="text-amber-500">{user.email?.split('@')[0]}</span>
                        </h1>
                        <p className="text-amber-200/80 font-serif text-lg italic max-w-2xl">
                            "The tavern is warm, and your adventures await. What tales shall we weave today?"
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <Crown className="absolute -right-4 -bottom-8 w-64 h-64 text-amber-900/10 rotate-12" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={Sword}
                        label="Active Campaigns"
                        value="3"
                        color="text-red-500"
                        gradient="from-red-950/50 to-red-900/10"
                    />
                    <StatCard
                        icon={Shield}
                        label="Characters"
                        value="5"
                        color="text-blue-500"
                        gradient="from-blue-950/50 to-blue-900/10"
                    />
                    <StatCard
                        icon={Coins}
                        label="Gold Collected"
                        value="1,250"
                        color="text-amber-500"
                        gradient="from-amber-950/50 to-amber-900/10"
                    />
                </div>

                {/* Recent Activity Section */}
                <ScrollCard className="min-h-[300px]">
                    <h2 className="text-2xl font-serif font-bold text-amber-900 mb-6 flex items-center gap-2">
                        <ScrollCardIcon /> Recent Chronicles
                    </h2>

                    <div className="space-y-4">
                        {/* Placeholder Activity Items */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-stone-100/50 border border-stone-200 hover:bg-white transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold font-serif group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                                    {i}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif font-bold text-stone-800">Explored the Sunless Citadel</h3>
                                    <p className="text-sm text-stone-500">2 hours ago • Campaign: The Depths</p>
                                </div>
                                <div className="text-xs font-serif text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                                    +50 XP
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollCard>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ icon: Icon, label, value, color, gradient }: any) {
    return (
        <div className={`relative overflow-hidden rounded-lg border border-stone-800 bg-gradient-to-br ${gradient} p-6 shadow-lg group hover:border-stone-700 transition-all cursor-default`}>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-1">{label}</h3>
                    <div className="text-3xl font-serif font-bold text-[#fdf6e3]">{value}</div>
                </div>
                <div className={`p-3 rounded-full bg-stone-900/50 border border-stone-800 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${color.split('-')[1]}-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
        </div>
    );
}

function ScrollCardIcon() {
    return (
        <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )
}
