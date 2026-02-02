'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCharacters } from '@/actions/character-actions';

interface Character {
    id: string;
    name: string;
    class: string;
    race: string;
    level: number;
    hp_max: number;
    hp_current: number;
}

export function useCharacters() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCharacters = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCharacters();
            setCharacters(data || []);
        } catch (err) {
            console.error('Failed to fetch characters', err);
            setError('Failed to load adventurers from the records.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    return {
        characters,
        isLoading,
        error,
        refreshCharacters: fetchCharacters
    };
}
