import React from 'react';
import { SectionTitle } from './SectionTitle';
import { FileItem } from './FileItem';
import { ImageFile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingQueueProps {
    files: ImageFile[];
    onRemoveFile: (fileId: string) => void;
    onDownloadAll: () => void;
    processingIds?: string[];
}

export const ProcessingQueue: React.FC<ProcessingQueueProps> = ({ files, onRemoveFile, onDownloadAll, processingIds = [] }) => {
    // Állapotjelző számítás
    const total = files.length;
    const done = files.filter(f => f.status === 'Kész!').length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <SectionTitle num={3} title="Feldolgozási sor" />
            {/* Állapotjelző sáv */}
            {total > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="inline-block text-xs font-semibold text-zinc-500 bg-zinc-100 rounded-full px-3 py-1">
                            {done} / {total} kész
                        </span>
                        <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${percent === 100 ? 'bg-green-100 text-green-700' : percent > 0 ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-400'}`}>{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-300 ${percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} />
                    </div>
                </div>
            )}
            <div className="mb-4 flex justify-end">
                <motion.button
                    onClick={onDownloadAll}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-base transition-all disabled:bg-zinc-400 disabled:cursor-not-allowed"
                    disabled={files.filter(f => f.status === 'Kész!' && !f.downloaded).length === 0}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Összes letöltése
                </motion.button>
            </div>
            <motion.div
                id="processing-queue"
                className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 space-y-3 max-h-[60vh] overflow-y-auto min-h-[120px]"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.08,
                            delayChildren: 0.2
                        }
                    }
                }}
            >
                <AnimatePresence>
                    {files.length === 0 ? (
                        <div className="text-zinc-400 text-center py-8 select-none">Nincs feldolgozandó kép.</div>
                    ) : (
                        files.map(file => (
                            <FileItem key={file.id} file={file} onRemove={onRemoveFile} processing={processingIds.includes(file.id)} />
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
