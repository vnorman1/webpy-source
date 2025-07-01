import React from 'react';
import { ImageFile, ProcessingStatus } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { motion } from 'framer-motion';

interface FileItemProps {
    file: ImageFile;
    onRemove: (fileId: string) => void;
    processing?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onRemove, processing = false }) => {
    const [downloading, setDownloading] = React.useState(false);
    // Hover preview state
    const [preview, setPreview] = React.useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
    const thumbRef = React.useRef<HTMLDivElement>(null);

    // Segédfüggvény a modal pozícióhoz
    const getModalPosition = () => {
        const modalWidth = 400;
        const modalHeight = 400;
        const padding = 8; // kisebb padding, közelebb a kurzorhoz
        let x = preview.x + padding;
        let y = preview.y + padding;
        if (typeof window !== 'undefined') {
            // Csak akkor igazítson balra/felfelé, ha tényleg kilógna
            if (x + modalWidth > window.innerWidth) {
                x = Math.max(8, window.innerWidth - modalWidth - 8);
            }
            if (y + modalHeight > window.innerHeight) {
                y = Math.max(8, window.innerHeight - modalHeight - 8);
            }
        }
        return { left: x, top: y };
    };

    const getStatusElement = () => {
        switch (file.status) {
            case ProcessingStatus.Done:
                const saved = file.percentageSaved ?? 0;
                const percentText = saved >= 0 ? `(-${saved}%)` : `(+${Math.abs(saved)}%)`;
                return (
                    <>
                        <span className="text-sm font-semibold text-blue-600">Kész!</span>
                        <p className="text-sm text-zinc-600">
                            Új méret: {formatBytes(file.processedSize ?? 0)}
                            <span className={`font-bold ml-1 ${saved >= 0 ? 'text-blue-700' : 'text-red-600'}`}>{percentText}</span>
                        </p>
                    </>
                );
            case ProcessingStatus.Processing:
                return <span className="text-sm font-semibold text-blue-600">{file.status}</span>;
            case ProcessingStatus.Waiting:
                 return <span className="text-sm font-semibold text-orange-600">{file.status}</span>;
            case ProcessingStatus.Error:
                return <span className="text-sm font-semibold text-red-600">{file.status}</span>;
            default:
                return null;
        }
    }

    const isDownloadable = file.status === ProcessingStatus.Done && !file.downloaded;
    const isDownloaded = file.status === ProcessingStatus.Done && file.downloaded;

    const handleDownload = async () => {
        if (!isDownloadable || !(file as any).processedBlob) return;
        setDownloading(true);
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
        setDownloading(false);
        // Állapot frissítés: letöltött
        const event = new CustomEvent('file-downloaded', { detail: { id: file.id } });
        window.dispatchEvent(event);
    };

    return (
        <motion.div
            className="flex items-center justify-between bg-zinc-50 rounded-lg px-4 py-3 border border-zinc-200 shadow-sm relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-4 min-w-[120px]">
                <motion.div
                    ref={thumbRef}
                    className="w-14 h-14 bg-zinc-200 rounded-lg flex items-center justify-center overflow-hidden relative cursor-pointer"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    onMouseEnter={e => {
                        setPreview({ visible: true, x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={e => {
                        setPreview(prev => prev.visible ? { ...prev, x: e.clientX, y: e.clientY } : prev);
                    }}
                    onMouseLeave={() => setPreview({ visible: false, x: 0, y: 0 })}
                >
                    {file.thumbnailUrl ? (
                        <img src={file.thumbnailUrl} alt={file.name} className="w-12 h-12 object-contain" />
                    ) : (
                        <div className="w-12 h-12 bg-zinc-300 flex items-center justify-center text-xs text-zinc-400">Nincs kép</div>
                    )}
                    {/* Hover preview modal */}
                    {preview.visible && file.thumbnailUrl && (
                        <div
                            className="fixed z-50 pointer-events-none"
                            style={{
                                ...getModalPosition(),
                                maxWidth: 400,
                                maxHeight: 400,
                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                                borderRadius: 12,
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                padding: 8,
                            }}
                        >
                            <img
                                src={file.thumbnailUrl}
                                alt={file.name}
                                style={{
                                    maxWidth: 360,
                                    maxHeight: 360,
                                    display: 'block',
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
                                }}
                            />
                        </div>
                    )}
                </motion.div>
                <div className="flex flex-col">
                    <motion.div
                        className="font-semibold text-zinc-800 break-all"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        {file.name}
                    </motion.div>
                    <motion.div
                        className="text-xs text-zinc-500"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    >
                        Eredeti méret: {typeof file.originalSize === 'number' && !isNaN(file.originalSize) ? formatBytes(file.originalSize) : 'ismeretlen'}
                    </motion.div>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-end">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.2 }}
                >
                    {getStatusElement()}
                </motion.div>
                <motion.button
                    className="ml-2 p-2 rounded hover:bg-zinc-100 transition"
                    onClick={() => onRemove(file.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <TrashIcon />
                </motion.button>
                {isDownloadable && (
                    <motion.button
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs font-bold"
                        onClick={handleDownload}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={downloading}
                    >
                        {downloading ? 'Letöltés...' : 'Letöltés'}
                    </motion.button>
                )}
                {isDownloaded && (
                    <motion.span
                        className="ml-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                    >Letöltve</motion.span>
                )}
            </div>
        </motion.div>
    );
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
