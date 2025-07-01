import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadPanel } from './components/UploadPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { ProcessingQueue } from './components/ProcessingQueue';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';
import { ImageFile, ConversionSettings, ProcessingStatus } from './types';
import { processImage } from './services/imageProcessor';
import { PRESETS, NO_PRESET } from './constants/presets';
import './custom-animations.css';

const settingsMatch = (
    a: Omit<ConversionSettings, 'preset'>,
    b: Omit<ConversionSettings, 'preset'>
) => {
    return (
        a.maxWidth === b.maxWidth &&
        a.maxHeight === b.maxHeight &&
        a.quality === b.quality
    );
};


const App: React.FC = () => {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [settings, setSettings] = useState<ConversionSettings>({
        preset: NO_PRESET,
        maxWidth: '1920',
        maxHeight: '',
        quality: 90,
    });
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // UploadPanel ref a file input resethez
    const uploadPanelRef = React.useRef<{ reset: () => void }>(null);
    (window as any).uploadPanelRef = uploadPanelRef;

    useEffect(() => {
        const { preset, ...currentSettingsValues } = settings;
        const matchingPreset = PRESETS.find(p => settingsMatch(p.settings, currentSettingsValues));

        if (matchingPreset) {
            if (preset !== matchingPreset.name) {
                setSettings(s => ({ ...s, preset: matchingPreset.name }));
            }
        } else {
            if (preset !== NO_PRESET) {
                setSettings(s => ({ ...s, preset: NO_PRESET }));
            }
        }
    }, [settings]);

    const handleFilesAdded = useCallback((addedFiles: File[]) => {
        const newImageFiles: ImageFile[] = addedFiles.map(file => ({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file: file,
            name: file.name,
            thumbnailUrl: URL.createObjectURL(file),
            originalSize: file.size,
            status: ProcessingStatus.Waiting,
        }));
        setFiles(prevFiles => [...prevFiles, ...newImageFiles]);
    }, []);

    const handleFileRemove = useCallback((fileId: string) => {
        setFiles(prevFiles => {
            const fileToRemove = prevFiles.find(f => f.id === fileId);
            if(fileToRemove && fileToRemove.thumbnailUrl) {
                URL.revokeObjectURL(fileToRemove.thumbnailUrl);
            }
            return prevFiles.filter(f => f.id !== fileId);
        });
    }, []);

    const handleSettingsChange = useCallback((newSettings: Partial<ConversionSettings>) => {
        setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
    }, []);

    // Animáció: feldolgozás alatt "pulse" animáció a feldolgozott képeken
    const [processingIds, setProcessingIds] = useState<string[]>([]);

    const handleProcessImages = useCallback(async () => {
        setProcessingIds(files.map(f => f.id)); // minden kép animálódik feldolgozáskor
        setFiles(prevFiles =>
            prevFiles.map(f => ({
                ...f,
                status: ProcessingStatus.Waiting,
                processedSize: undefined,
                percentageSaved: undefined,
                processedBlob: undefined,
                downloaded: false
            }))
        );
        for (const fileToProcess of files) {
            const result = await processImage(fileToProcess, settings);
            setFiles(prevFiles =>
                prevFiles.map(f => (f.id === fileToProcess.id ? { ...f, ...result } : f))
            );
            setProcessingIds(ids => ids.filter(id => id !== fileToProcess.id)); // animáció vége
        }
    }, [files, settings]);
    
    // A feldolgozandó képek száma mostantól az összes fájl száma
    const fileCount = files.length;

    // Letöltött státusz frissítése event alapján
    React.useEffect(() => {
        const handler = (e: any) => {
            const id = e.detail.id;
            setFiles(prevFiles => prevFiles.map(f => f.id === id ? { ...f, downloaded: true } : f));
        };
        window.addEventListener('file-downloaded', handler);
        return () => window.removeEventListener('file-downloaded', handler);
    }, []);

    // Összes letöltése
    const handleDownloadAll = useCallback(() => {
        files.forEach(async (file) => {
            if (file.status === ProcessingStatus.Done && !file.downloaded && (file as any).processedBlob) {
                const blob = (file as any).processedBlob as Blob;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `optimalizalt_${file.name.replace(/\.[^.]+$/, '')}.webp`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
                // Állapot frissítés: letöltött
                setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? { ...f, downloaded: true } : f));
            }
        });
    }, [files]);

    // Safari figyelmeztetés
    const [showSafariWarning, setShowSafariWarning] = useState(false);
    useEffect(() => {
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        setShowSafariWarning(isSafari);
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-8 max-w-7xl">
            <Header onHelpClick={() => setIsHelpOpen(true)} />
            {showSafariWarning && (
                <div className="mb-6 flex justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-200 border border-zinc-300 shadow-sm">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24"/><path d="M12 8v4m0 4h.01" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/></svg>
                        <span className="text-zinc-800 font-medium text-base">Figyelem! Asztali Safari böngészőben a WebP minőség beállítás nem mindig működik, a kimeneti fájlméret nagyobb lehet a vártnál.</span>
                    </div>
                </div>
            )}
            <main>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5">
                        <UploadPanel onFilesAdded={handleFilesAdded} ref={uploadPanelRef} />
                    </div>
                    <div className="lg:col-span-7">
                        <SettingsPanel 
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                            onProcess={handleProcessImages}
                            processingFileCount={fileCount}
                        />
                    </div>
                </div>
                {files.length > 0 && (
                    <div className="mt-12">
                        <ProcessingQueue files={files} onRemoveFile={handleFileRemove} onDownloadAll={handleDownloadAll} processingIds={processingIds} />
                    </div>
                )}
            </main>
            <Footer />
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
};

export default App;