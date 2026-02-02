import { createBrowserClient } from '@supabase/ssr';
import { IAuthService, User } from './IAuthService';

export class SupabaseAuthService implements IAuthService {
    private supabase;

    constructor() {
        this.supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }

    async login(email: string): Promise<{ error: Error | null }> {
        const { error } = await this.supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    }

    async logout(): Promise<{ error: Error | null }> {
        const { error } = await this.supabase.auth.signOut();
        return { error };
    }

    async getUser(): Promise<{ user: User | null; error: Error | null }> {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        if (user) {
            const { data: profile } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                (user as User).profile = {
                    display_name: profile.display_name,
                    character_class: profile.character_class,
                    bio: profile.bio,
                    level: profile.level,
                };
            }
        }
        return { user: user as User, error };
    }

    async getSession(): Promise<{ session: unknown; error: Error | null }> {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        return { session, error };
    }
    async updateProfile(data: { displayName?: string; bio?: string; characterClass?: string }): Promise<{ error: Error | null }> {
        const { error } = await this.supabase.auth.updateUser({
            data: {
                display_name: data.displayName,
                bio: data.bio,
                character_class: data.characterClass,
            }
        });
        return { error };
    }
}
