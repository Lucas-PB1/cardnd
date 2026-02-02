import { cookies } from 'next/headers';
import { CharacterData } from '@/types/character';
import { createServerClient } from '@supabase/ssr';


export class CharacterService {
    static async getCharacters(userId: string) {
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

        const { data, error } = await supabase
            .from('characters')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching characters:', error);
            return [];
        }

        return data;
    }

    static async createCharacter(userId: string, data: CharacterData) {
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

        // 1. Insert Character
        const { data: character, error: charError } = await supabase
            .from('characters')
            .insert({
                user_id: userId,
                name: data.name,
                class: data.class,
                level: data.level,
                race: data.race,
                hp_max: data.hp.max,
                hp_current: data.hp.current,
            })
            .select()
            .single();

        if (charError || !character) throw new Error(`Failed to create character: ${charError?.message}`);

        // 2. Insert Attributes
        const { error: statsError } = await supabase
            .from('character_attributes')
            .insert({
                character_id: character.id,
                strength: data.attributes.strength,
                dexterity: data.attributes.dexterity,
                constitution: data.attributes.constitution,
                intelligence: data.attributes.intelligence,
                wisdom: data.attributes.wisdom,
                charisma: data.attributes.charisma,
            });

        if (statsError) throw new Error(`Failed to create attributes: ${statsError.message}`);

        // 3. Insert Skills
        const skillsToInsert = Object.entries(data.skills)
            .filter(([_, status]) => status === 'proficient' || status === 'expertise');

        if (skillsToInsert.length > 0) {
            const skillNames = skillsToInsert.map(([name]) => name);

            // Get Skill IDs first (assuming names match)
            const { data: skillsData, error: skillLookupError } = await supabase
                .from('skills')
                .select('id, name')
                .in('name', skillNames);

            if (skillLookupError) throw new Error(`Failed to lookup skills: ${skillLookupError.message}`);

            if (skillsData && skillsData.length > 0) {
                const skillEntries = skillsData.map(skill => {
                    const status = data.skills[skill.name];
                    return {
                        character_id: character.id,
                        skill_id: skill.id,
                        is_proficient: true,
                        is_expertise: status === 'expertise',
                    };
                });

                const { error: skillInsertError } = await supabase
                    .from('character_skills')
                    .insert(skillEntries);

                if (skillInsertError) throw new Error(`Failed to create skills: ${skillInsertError.message}`);
            }
        }

        // 4. Insert Saving Throws
        const savesToInsert = Object.entries(data.savingThrows)
            .filter(([_, isProficient]) => isProficient)
            .map(([ability]) => ({
                character_id: character.id,
                ability,
                is_proficient: true
            }));

        if (savesToInsert.length > 0) {
            const { error: savesError } = await supabase
                .from('character_saving_throws')
                .insert(savesToInsert);

            if (savesError) throw new Error(`Failed to create saving throws: ${savesError.message}`);
        }

        return character;
    }

    static async getClasses() {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } } }
        );

        const { data } = await supabase.from('classes').select('*').order('name');
        return data || [];
    }

    static async getRaces() {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } } }
        );

        const { data } = await supabase.from('races').select('*').order('name');
        return data || [];
    }

    static async getSubclasses(classId?: string) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } } }
        );

        let query = supabase.from('subclasses').select('*').order('name');
        if (classId) {
            query = query.eq('class_id', classId);
        }

        const { data } = await query;
        return data || [];
    }
}
