'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dnd/DashboardLayout';
import { ScrollCard } from '@/components/dnd/ScrollCard';
import { DragonInput } from '@/components/dnd/DragonInput';
import { RuneButton } from '@/components/dnd/RuneButton';
import { useAuth } from '@/components/providers/AuthContext';
import { updateProfile } from '@/actions/profile-actions';
import { User, ScrollText, Wand2 } from 'lucide-react';

/**
 * User settings page where profiles can be updated.
 */
export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        characterClass: ''
    });

    useEffect(() => {
        if (user) {
            const profile = user.profile || {};
            setFormData({
                displayName: profile.display_name || (user.user_metadata?.display_name as string) || '',
                bio: profile.bio || (user.user_metadata?.bio as string) || '',
                characterClass: profile.character_class || (user.user_metadata?.character_class as string) || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await updateProfile(formData);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Chronicle updated internally! (Refresh to see changes)' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to inscribe runes.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#fdf6e3] mb-2 flex items-center gap-3">
                        <User className="w-8 h-8 text-amber-500" />
                        Adventurer Identity
                    </h1>
                    <p className="text-stone-400 font-serif">
                        Update your dossier for the guild registry.
                    </p>
                </div>

                <ScrollCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DragonInput
                            id="displayName"
                            label="Name / Alias"
                            placeholder="e.g. Gandalf the Grey"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="characterClass" className="text-amber-900 font-serif font-bold text-lg tracking-wide drop-shadow-sm">
                                Class / Vocation
                            </label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                                <select
                                    id="characterClass"
                                    className="relative w-full bg-[#fdf6e3] text-stone-800 border-2 border-[#d4c5a0] 
                                    rounded-md px-4 py-2 font-serif text-lg shadow-inner focus:outline-none focus:border-amber-600 
                                    focus:ring-1 focus:ring-amber-600 transition-all duration-300 appearance-none"
                                    value={formData.characterClass}
                                    onChange={(e) => setFormData({ ...formData, characterClass: e.target.value })}
                                >
                                    <option value="">Select a Class...</option>
                                    <option value="Barbarian">Barbarian</option>
                                    <option value="Bard">Bard</option>
                                    <option value="Cleric">Cleric</option>
                                    <option value="Druid">Druid</option>
                                    <option value="Fighter">Fighter</option>
                                    <option value="Monk">Monk</option>
                                    <option value="Paladin">Paladin</option>
                                    <option value="Ranger">Ranger</option>
                                    <option value="Rogue">Rogue</option>
                                    <option value="Sorcerer">Sorcerer</option>
                                    <option value="Warlock">Warlock</option>
                                    <option value="Wizard">Wizard</option>
                                </select>
                                <Wand2 className="absolute right-3 top-3 w-5 h-5 text-stone-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="bio" className="text-amber-900 font-serif font-bold text-lg tracking-wide drop-shadow-sm">
                                Origin Story (Bio)
                            </label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                                <textarea
                                    id="bio"
                                    rows={4}
                                    className="relative w-full bg-[#fdf6e3] text-stone-800 border-2 border-[#d4c5a0] 
                                    rounded-md px-4 py-2 font-serif text-lg shadow-inner placeholder:text-stone-400
                                    focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600
                                    transition-all duration-300 resize-none"
                                    placeholder="Tell us of your deeds..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                                <ScrollText className="absolute right-3 top-3 w-5 h-5 text-stone-400 pointer-events-none" />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg font-serif border ${message.type === 'success'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                                } animate-in slide-in-from-top-2`}>
                                <p className="flex items-center gap-2">
                                    {message.type === 'success' ? '✨' : '💀'} {message.text}
                                </p>
                            </div>
                        )}

                        <div className="pt-4">
                            <RuneButton type="submit" isLoading={isLoading} className="w-full">
                                Update Records
                            </RuneButton>
                        </div>
                    </form>
                </ScrollCard>
            </div>
        </DashboardLayout>
    );
}
