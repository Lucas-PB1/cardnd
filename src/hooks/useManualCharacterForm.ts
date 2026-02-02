'use client';

import { useState, useEffect } from 'react';
import { saveCharacter, getClasses, getRaces, getSubclasses } from '@/actions/character-actions';
import { ClassOption, RaceOption, SubclassOption } from '@/types/character';

interface UseManualCharacterFormProps {
    onSuccess: () => void;
}

export function useManualCharacterForm({ onSuccess }: UseManualCharacterFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
    const [raceOptions, setRaceOptions] = useState<RaceOption[]>([]);
    const [subclassOptions, setSubclassOptions] = useState<SubclassOption[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [formData, setFormData] = useState({
        name: "New Adventurer",
        race: "",
        class: "",
        subclass: "",
        level: 1,
        hp: { max: 10, current: 10 },
        attributes: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },
        skills: {} as Record<string, 'proficient' | 'expertise' | null>,
        savingThrows: {} as Record<string, boolean>
    });

    // Load Classes and Races
    useEffect(() => {
        const loadOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const [classes, races] = await Promise.all([
                    getClasses(),
                    getRaces()
                ]);
                setClassOptions(classes as ClassOption[]);
                setRaceOptions(races as RaceOption[]);

                if (classes.length > 0 && !formData.class) {
                    setFormData(prev => ({ ...prev, class: classes[0].id }));
                }
                if (races.length > 0 && !formData.race) {
                    setFormData(prev => ({ ...prev, race: races[0].id }));
                }
            } catch (error) {
                console.error("Failed to load options", error);
                setStatus({ type: 'error', text: 'Failed to load character options.' });
            } finally {
                setIsLoadingOptions(false);
            }
        };
        loadOptions();
    }, []);

    // Load Subclasses based on selected Class
    useEffect(() => {
        const loadSubclasses = async () => {
            if (!formData.class) {
                setSubclassOptions([]);
                return;
            }
            try {
                const subs = await getSubclasses(formData.class);
                setSubclassOptions(subs as SubclassOption[]);
                setFormData(prev => ({ ...prev, subclass: subs.length > 0 ? subs[0].id : '' }));
            } catch (error) {
                console.error("Failed to load subclasses", error);
            }
        };
        loadSubclasses();
    }, [formData.class]);

    const handleSave = async () => {
        setIsSaving(true);
        setStatus({ type: 'info', text: 'Inscribing into the guild records...' });

        try {
            const selectedClass = classOptions.find(c => c.id === formData.class)?.name || formData.class;
            const selectedRace = raceOptions.find(r => r.id === formData.race)?.name || formData.race;
            const selectedSubclass = subclassOptions.find(s => s.id === formData.subclass)?.name || formData.subclass;

            const payload = {
                ...formData,
                class: selectedClass,
                race: selectedRace,
                subclass: selectedSubclass,
            };

            const result = await saveCharacter(payload);

            if (result.error) {
                setStatus({ type: 'error', text: result.error });
            } else {
                setStatus({ type: 'success', text: `Character "${formData.name}" inscribed successfully!` });
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch {
            setStatus({ type: 'error', text: 'Failed to save character.' });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => {
            const current = prev.skills[skill];
            let next: 'proficient' | 'expertise' | null = 'proficient';

            if (current === 'proficient') next = 'expertise';
            else if (current === 'expertise') next = null;

            return {
                ...prev,
                skills: { ...prev.skills, [skill]: next }
            };
        });
    };

    const toggleSave = (ability: string) => {
        setFormData(prev => ({
            ...prev,
            savingThrows: { ...prev.savingThrows, [ability]: !prev.savingThrows[ability] }
        }));
    };

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const updateHp = (max: number) => {
        setFormData(prev => ({
            ...prev,
            hp: { max, current: max }
        }));
    };

    const updateAttribute = (key: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [key]: value }
        }));
    };

    return {
        formData,
        status,
        isSaving,
        classOptions,
        raceOptions,
        subclassOptions,
        isLoadingOptions,
        handleSave,
        toggleSkill,
        toggleSave,
        updateFormData,
        updateHp,
        updateAttribute
    };
}
