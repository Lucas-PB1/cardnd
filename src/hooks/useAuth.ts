'use client';

import { useState } from 'react';
import { loginWithEmail } from '@/actions/auth-actions';

export function useAuth() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

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

    return {
        email,
        setEmail,
        isLoading,
        message,
        handleLogin
    };
}
