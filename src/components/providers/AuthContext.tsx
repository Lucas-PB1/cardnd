'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '@/services/auth/IAuthService';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that managed the authentication state across the application.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const [supabase] = useState(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = session?.user as User ?? null;

                if (currentUser) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', currentUser.id)
                        .single();

                    if (profile) {
                        currentUser.profile = {
                            display_name: profile.display_name,
                            character_class: profile.character_class,
                            bio: profile.bio,
                            level: profile.level
                        };
                    }
                }

                setSession(session);
                setUser(currentUser);
            } catch (error) {
                console.error('Error checking auth session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user as User ?? null;
            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                if (profile) {
                    currentUser.profile = {
                        display_name: profile.display_name,
                        character_class: profile.character_class,
                        bio: profile.bio,
                        level: profile.level
                    };
                }
            }
            setSession(session);
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, session]);

    return (
        <AuthContext.Provider value={{ user, session, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
