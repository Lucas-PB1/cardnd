'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dnd/DashboardLayout';
import { ScrollCard } from '@/components/dnd/ScrollCard';
import { RuneButton } from '@/components/dnd/RuneButton';
import { ManualCharacterForm } from '@/components/dnd/ManualCharacterForm';
import { getCharacters } from '@/actions/character-actions';
import { Plus, Users, Skull } from 'lucide-react';

export default function CharactersPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [characters, setCharacters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCharacters = async () => {
        setIsLoading(true);
        try {
            const data = await getCharacters();
            setCharacters(data || []);
        } catch (error) {
            console.error('Failed to fetch characters', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleCreateSuccess = () => {
        setIsCreating(false);
        fetchCharacters();
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#fdf6e3] flex items-center gap-3">
                            <Users className="w-8 h-8 text-amber-500" />
                            My Characters
                        </h1>
                        <p className="text-stone-400 font-serif mt-1">
                            Manage your roster of heroes and adventurers.
                        </p>
                    </div>

                    {!isCreating && (
                        <RuneButton onClick={() => setIsCreating(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Create Character
                        </RuneButton>
                    )}
                </div>

                {isCreating && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <ManualCharacterForm
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setIsCreating(false)}
                        />
                    </div>
                )}

                {/* Character Grid */}
                {isLoading ? (
                    <div className="text-center py-12 text-stone-500 font-serif animate-pulse">
                        Divining character locations...
                    </div>
                ) : characters.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-[#292524] rounded-lg bg-[#1c1917]/50">
                        <Skull className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-stone-400 mb-2">No adventurers found</h3>
                        <p className="text-stone-500 max-w-md mx-auto mb-6">
                            Your roster is empty. Import a character sheet to begin your journey.
                        </p>
                        {!isCreating && (
                            <RuneButton variant="secondary" onClick={() => setIsCreating(true)}>
                                Create First Character
                            </RuneButton>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map((char) => (
                            <ScrollCard key={char.id} className="hover:border-amber-700/50 transition-colors cursor-pointer group">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
                                                {char.name}
                                            </h3>
                                            <p className="text-stone-400 text-sm">
                                                {char.race} {char.class} <span className="text-amber-600">•</span> Lvl {char.level}
                                            </p>
                                        </div>
                                        <div className="bg-[#1c1917] p-2 rounded border border-[#292524]">
                                            <div className="text-xs text-stone-500 uppercase text-center">HP</div>
                                            <div className="font-bold text-red-400 text-center leading-none mt-1">
                                                {char.hp_max}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#292524]" />

                                    <div className="flex justify-end">
                                        <span className="text-xs text-stone-600 font-mono">
                                            ID: {char.id.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>
                            </ScrollCard>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
