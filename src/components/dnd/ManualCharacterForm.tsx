'use client';

import React, { useState, useEffect } from 'react';
import { ScrollCard } from '@/components/dnd/ScrollCard';
import { RuneButton } from '@/components/dnd/RuneButton';
import { saveCharacter, getClasses, getRaces, getSubclasses } from '@/actions/character-actions';
import { Save, X, Scroll, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { DND_SKILLS } from '@/lib/constants/dnd-2024';
import { ClassOption, RaceOption, SubclassOption } from '@/types/character';

interface ManualCharacterFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

/**
 * Component for manually creating a new character entry.
 * Handles fetching of dynamic options (class, race, subclass) and form submission.
 */
export function ManualCharacterForm({ onSuccess, onCancel }: ManualCharacterFormProps) {
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
    }, [formData.class, formData.race]);

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

    return (
        <ScrollCard>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2 flex items-center gap-3">
                        <Scroll className="w-6 h-6 text-amber-600" />
                        New Character Entry
                    </h2>
                    <p className="text-stone-400 font-serif text-sm">
                        Manually inscribe a new adventurer into the records.
                    </p>
                </div>

                <div className="bg-[#efe6d5] p-6 rounded-lg border-2 border-[#d4c5a0] space-y-6 shadow-inner text-stone-900">
                    <div className="flex justify-between items-center border-b border-[#d4c5a0] pb-2">
                        <h3 className="text-xl font-serif font-bold text-amber-900">
                            Character Details
                        </h3>
                        {isLoadingOptions && <Loader2 className="w-4 h-4 animate-spin text-amber-700" />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-serif font-bold text-lg text-stone-900 focus:outline-none focus:border-amber-500 placeholder-stone-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Race</label>
                            <select
                                value={formData.race}
                                onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-serif text-stone-900 focus:outline-none focus:border-amber-500"
                            >
                                <option value="">Select Race</option>
                                {raceOptions.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Class</label>
                            <select
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-serif text-stone-900 focus:outline-none focus:border-amber-500"
                            >
                                <option value="">Select Class</option>
                                {classOptions.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Subclass</label>
                            <select
                                value={formData.subclass}
                                onChange={(e) => setFormData({ ...formData, subclass: e.target.value })}
                                disabled={subclassOptions.length === 0}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-serif text-stone-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                            >
                                <option value="">{subclassOptions.length === 0 ? 'Select Class First' : 'Select Subclass'}</option>
                                {subclassOptions.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Level</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-serif text-stone-900 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Max HP</label>
                            <input
                                type="number"
                                value={formData.hp.max}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    hp: { ...formData.hp, max: parseInt(e.target.value) || 1, current: parseInt(e.target.value) || 1 }
                                })}
                                className="w-full bg-white/50 border border-[#d4c5a0] rounded px-3 py-2 font-bold text-red-900 focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Attributes</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {Object.entries(formData.attributes).map(([key, value]) => (
                                <div key={key} className="bg-[#1c1917] p-2 rounded border border-[#292524] shadow-sm flex flex-col items-center">
                                    <div className="text-[10px] uppercase text-stone-400 font-bold mb-1">{key.slice(0, 3)}</div>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={value as number}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            attributes: { ...formData.attributes, [key]: parseInt(e.target.value) || 10 }
                                        })}
                                        className="w-full bg-transparent text-center font-bold text-amber-500 text-xl focus:outline-none focus:text-amber-400 p-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Saving Throws</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map((ability) => (
                                <label key={ability} className="flex flex-col items-center gap-2 p-2 bg-white/30 border border-[#d4c5a0] rounded hover:bg-white/50 cursor-pointer">
                                    <span className="text-[10px] font-bold uppercase text-stone-600">{ability.slice(0, 3)}</span>
                                    <input
                                        type="checkbox"
                                        checked={!!formData.savingThrows[ability]}
                                        onChange={() => toggleSave(ability)}
                                        className="w-5 h-5 accent-amber-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-stone-600 text-xs font-bold uppercase tracking-wider">Skills</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {DND_SKILLS.map((skill) => {
                                const status = formData.skills[skill];
                                return (
                                    <div
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${status ? 'bg-amber-100/50 border-amber-400' : 'bg-white/30 border-[#d4c5a0] hover:bg-white/50'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status ? 'border-amber-600 bg-amber-600' : 'border-stone-400'
                                            }`}>
                                            {status === 'expertise' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            )}
                                            {status === 'proficient' && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-100" />
                                            )}
                                        </div>
                                        <span className={`text-sm font-serif ${status ? 'text-amber-900 font-bold' : 'text-stone-800'}`}>
                                            {skill}
                                        </span>
                                        {status === 'expertise' && (
                                            <span className="ml-auto text-[10px] font-bold text-amber-700 uppercase tracking-tighter bg-amber-200/50 px-1 rounded">Exp</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {status && (
                    <div className={`p-4 rounded-lg font-serif border flex items-center gap-3 ${status.type === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' :
                        status.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-400' :
                            'bg-blue-900/20 border-blue-800 text-blue-400'
                        }`}>
                        {status.type === 'success' && <CheckCircle className="w-5 h-5" />}
                        {status.type === 'error' && <AlertCircle className="w-5 h-5" />}
                        {status.type === 'info' && <Loader2 className="w-5 h-5 animate-spin" />}
                        {status.text}
                    </div>
                )}

                <div className="flex justify-end pt-4 gap-3">
                    <RuneButton variant="secondary" onClick={onCancel} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </RuneButton>
                    <RuneButton onClick={handleSave} disabled={isSaving} isLoading={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Character
                    </RuneButton>
                </div>
            </div>
        </ScrollCard>
    );
}
