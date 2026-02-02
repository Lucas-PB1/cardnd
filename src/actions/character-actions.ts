'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CharacterService } from '@/services/character/CharacterService';

export async function saveCharacter(characterData: any) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch { }
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'Unauthorized' };

        const character = await CharacterService.createCharacter(user.id, characterData);
        return { success: true, characterId: character.id };
    } catch (error: any) {
        console.error('Save error:', error);
        return { error: error.message || 'Failed to save character' };
    }
}

export async function getCharacters() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch { }
                    },
                },
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        return await CharacterService.getCharacters(user.id);
    } catch (error) {
        console.error('Get characters error:', error);
        return [];
    }
}

export async function getClasses() {
    try {
        return await CharacterService.getClasses();
    } catch (error) {
        console.error('Get classes error:', error);
        return [];
    }
}

export async function getRaces() {
    try {
        return await CharacterService.getRaces();
    } catch (error) {
        console.error('Get races error:', error);
        return [];
    }
}

export async function getSubclasses(classId?: string) {
    try {
        return await CharacterService.getSubclasses(classId);
    } catch (error) {
        console.error('Get subclasses error:', error);
        return [];
    }
}
