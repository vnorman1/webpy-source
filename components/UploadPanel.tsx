import React, { useRef, useState, useCallback } from 'react';
import { SectionTitle } from './SectionTitle';
import { UploadIcon } from './icons/UploadIcon';
import { motion } from 'framer-motion';

interface UploadPanelProps {
    onFilesAdded: (files: File[]) => void;
}

const ACCEPTED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
];

const filterAcceptedFiles = (files: File[]) =>
    files.filter(file => ACCEPTED_TYPES.includes(file.type));

export const UploadPanel: React.FC<UploadPanelProps> = ({ onFilesAdded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Új: resetFileInput külső hívásra
    React.useImperativeHandle((window as any).uploadPanelRef, () => ({
        reset: () => {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }), []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const accepted = filterAcceptedFiles(Array.from(e.target.files));
            if (accepted.length > 0) onFilesAdded(accepted);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // This is needed to signal that a drop is allowed
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const items = e.dataTransfer.items;
        if (items && items.length > 0) {
            const files: File[] = [];
            let pending = items.length;
            const finish = () => {
                if (--pending === 0 && files.length > 0) {
                    const accepted = filterAcceptedFiles(files);
                    if (accepted.length > 0) onFilesAdded(accepted);
                }
            };
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.kind === 'file') {
                    const entry = (item as any).webkitGetAsEntry?.() || item.getAsFile();
                    if (entry && entry.isDirectory) {
                        const readEntries = (dirEntry: any) => {
                            const dirReader = dirEntry.createReader();
                            dirReader.readEntries((entries: any[]) => {
                                if (entries.length === 0) {
                                    finish();
                                    return;
                                }
                                pending += entries.length - 1;
                                entries.forEach((entry) => {
                                    if (entry.isFile) {
                                        entry.file((file: File) => {
                                            files.push(file);
                                            finish();
                                        });
                                    } else if (entry.isDirectory) {
                                        readEntries(entry);
                                    } else {
                                        finish();
                                    }
                                });
                            });
                        };
                        readEntries(entry);
                    } else if (entry && entry.isFile) {
                        entry.file((file: File) => {
                            files.push(file);
                            finish();
                        });
                    } else {
                        const file = item.getAsFile();
                        if (file) files.push(file);
                        finish();
                    }
                } else {
                    finish();
                }
            }
        } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const accepted = filterAcceptedFiles(Array.from(e.dataTransfer.files));
            if (accepted.length > 0) onFilesAdded(accepted);
        }
        e.dataTransfer.clearData();
    }, [onFilesAdded]);

    const dragClasses = isDragging ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-400' : 'border-zinc-300 bg-zinc-50';

    return (
        <motion.div
            className={`bg-white p-6 rounded-xl shadow-sm border border-zinc-200 h-full transition-all`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <SectionTitle num={1} title="Képek feltöltése" />
            <motion.div
                className={`w-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-36 mb-4 cursor-pointer transition-all ${dragClasses}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={handleButtonClick}
                tabIndex={0}
                role="button"
                aria-label="Képek feltöltése"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                >
                    <UploadIcon />
                </motion.div>
                <motion.p
                    className="mt-2 text-zinc-600 text-lg text-center pt-4 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                >
                    Húzd ide a képeket vagy kattints a feltöltéshez
                </motion.p>
                {isDragging && (
                    <motion.span
                        className="mt-2 text-blue-600 text-base font-semibold animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        Engedd el a képeket!
                    </motion.span>
                )}
            </motion.div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileSelect}
            />
        </motion.div>
    );
};
