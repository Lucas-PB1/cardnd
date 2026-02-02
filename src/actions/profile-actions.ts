'use server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Updates the user profile data in the database.
 */
export async function updateProfile(data: { displayName?: string; bio?: string; characterClass?: string }) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { error } = await supabase
        .from('profiles')
        .update({
            display_name: data.displayName,
            bio: data.bio,
            character_class: data.characterClass,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
