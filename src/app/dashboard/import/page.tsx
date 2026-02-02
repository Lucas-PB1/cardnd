'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dnd/DashboardLayout';
import { ScrollCard } from '@/components/dnd/ScrollCard';
import { RuneButton } from '@/components/dnd/RuneButton';
import { parseCharacterPdf, saveCharacter } from '@/actions/character-actions';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [parsedData, setParsedData] = useState<any | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
            setParsedData(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setStatus({ type: 'info', text: 'Deciphering arcane runes...' });
        setParsedData(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await parseCharacterPdf(formData);

            if (result.error) {
                setStatus({ type: 'error', text: result.error });
            } else {
                setStatus({ type: 'success', text: 'Scroll deciphered! Please verify the inscription.' });
                setParsedData(result.parsedData);
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'The ritual failed unexpectedly.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirm = async () => {
        if (!parsedData) return;

        setIsUploading(true);
        setStatus({ type: 'info', text: 'Inscribing into the guild records...' });

        try {
            const result = await saveCharacter(parsedData);

            if (result.error) {
                setStatus({ type: 'error', text: result.error });
            } else {
                setStatus({ type: 'success', text: `Character "${parsedData.name}" inscribed successfully!` });
                setTimeout(() => {
                    // router.push('/dashboard/characters');
                }, 2000);
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Failed to save character.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setParsedData(null);
        setFile(null);
        setStatus(null);
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#fdf6e3] mb-2 flex items-center gap-3">
                        <Upload className="w-8 h-8 text-amber-500" />
                        Import Chronicle
                    </h1>
                    <p className="text-stone-400 font-serif">
                        Upload a digital scroll (PDF) to scribe it into the guild's records.
                    </p>
                </div>

                <ScrollCard>
                    <div className="space-y-6">
                        {/* File Upload Area */}
                        {!parsedData && (
                            <div className="border-2 border-dashed border-[#d4c5a0] rounded-lg p-8 text-center bg-[#fdf6e3]/5 hover:bg-[#fdf6e3]/10 transition-colors cursor-pointer group relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                />

                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    {file ? (
                                        <FileText className="w-12 h-12 text-amber-600 animate-bounce" />
                                    ) : (
                                        <Upload className="w-12 h-12 text-stone-500 group-hover:text-amber-600 transition-colors" />
                                    )}

                                    <div className="font-serif text-lg text-stone-300">
                                        {file ? (
                                            <span className="text-amber-500 font-bold">{file.name}</span>
                                        ) : (
                                            <span>Drop your PDF here or click to browse</span>
                                        )}
                                    </div>
                                    <p className="text-stone-500 text-sm">Accepted format: D&D 5e Character Sheet (.pdf)</p>
                                </div>
                            </div>
                        )}

                        {/* Preview Area */}
                        {parsedData && (
                            <div className="bg-[#fdf6e3]/5 p-6 rounded-lg border border-[#d4c5a0]/30 space-y-4">
                                <h3 className="text-xl font-serif text-amber-400 border-b border-[#d4c5a0]/30 pb-2">
                                    Parsed Data Preview
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-stone-300">
                                    <div>
                                        <span className="block text-stone-500 text-sm">Name</span>
                                        <span className="font-bold text-lg">{parsedData.name}</span>
                                    </div>
                                    <div>
                                        <span className="block text-stone-500 text-sm">Race & Class</span>
                                        <span>{parsedData.race} {parsedData.class} (Lvl {parsedData.level})</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="block text-stone-500 text-sm mb-1">Attributes</span>
                                        <div className="grid grid-cols-6 gap-2 text-center text-sm">
                                            {Object.entries(parsedData.attributes || {}).map(([key, value]) => (
                                                <div key={key} className="bg-[#1a1a1a] p-1 rounded">
                                                    <div className="font-bold text-amber-500">{String(value)}</div>
                                                    <div className="text-[10px] uppercase">{key.slice(0, 3)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-stone-500 text-sm">HP</span>
                                        <span className="text-red-400 font-bold">{parsedData.hp?.max} Max</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Message */}
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

                        {/* Actions */}
                        <div className="flex justify-end pt-4 gap-3">
                            {parsedData ? (
                                <>
                                    <RuneButton variant="secondary" onClick={handleCancel} disabled={isUploading}>
                                        <X className="w-4 h-4 mr-2" />
                                        Discard
                                    </RuneButton>
                                    <RuneButton onClick={handleConfirm} disabled={isUploading} isLoading={isUploading}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Confirm & Save
                                    </RuneButton>
                                </>
                            ) : (
                                <RuneButton
                                    onClick={handleUpload}
                                    disabled={!file || isUploading}
                                    isLoading={isUploading}
                                    className="w-full sm:w-auto"
                                >
                                    Decipher Scroll
                                </RuneButton>
                            )}
                        </div>
                    </div>
                </ScrollCard>

                <div className="text-center text-stone-500 text-sm italic font-serif">
                    *Ensure your scroll is legible. Illegible runes (images) cannot be deciphered.
                </div>
            </div>
        </DashboardLayout>
    );
}
