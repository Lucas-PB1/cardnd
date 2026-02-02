'use client';

import React, { useState } from 'react';
import { DragonInput } from '@/components/dnd/DragonInput';
import { RuneButton } from '@/components/dnd/RuneButton';
import { ScrollCard } from '@/components/dnd/ScrollCard';
import { loginWithEmail } from '@/actions/auth-actions';
import { Scroll } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await loginWithEmail(email);

            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Magic link sent! Check your raven (email).' });
                setEmail('');
            }
        } catch {
            setMessage({ type: 'error', text: 'An arcane error occurred.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1c1917] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] p-4">
            <div className="w-full max-w-md">
                <ScrollCard className="animate-in fade-in zoom-in duration-700">
                    <div className="text-center mb-8">
                        <div className="mx-auto bg-amber-900/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-amber-600/50">
                            <Scroll className="w-8 h-8 text-amber-700" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2 drop-shadow-sm">
                            Enter the Realm
                        </h1>
                        <p className="text-stone-600 italic font-serif">
                            Begin your adventure in Cardnd
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DragonInput
                            id="email"
                            type="email"
                            label="Adventurer's Email"
                            placeholder="wizard@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />

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

                        <RuneButton
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Unlock Gate
                        </RuneButton>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-stone-500 font-serif">
                            By entering, you agree to the laws of the realm.
                        </p>
                    </div>
                </ScrollCard>
            </div>
        </div>
    );
}
