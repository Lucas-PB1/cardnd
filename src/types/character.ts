/**
 * Represents the full data structure for a D&D character.
 * Used for creating and saving character data.
 */
export interface CharacterData {
    name: string;
    class: string;
    level: number;
    race: string;
    hp: {
        max: number;
        current: number;
    };
    attributes: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    skills: Record<string, 'proficient' | 'expertise' | null>;
    savingThrows: Record<string, boolean>;
}

export interface ClassOption {
    id: string;
    name: string;
    hitDie: number;
    primaryAbility: string[];
    saves: string[];
}

export interface RaceOption {
    id: string;
    name: string;
}

export interface SubclassOption {
    id: string;
    name: string;
    classId?: string;
}
