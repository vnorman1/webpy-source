import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../helpmodal-animations.css';
import { year } from '@/constants/presets';
interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [cleared, setCleared] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    // Modalon kívüli kattintás kezelése
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center overlay-fade-in"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <motion.div
                        className="modal-fade-in bg-gradient-to-br from-white via-zinc-50 to-zinc-200 rounded-2xl shadow-2xl max-w-xl w-full p-8 relative border border-zinc-200"
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32, duration: 0.35 }}
                        layout
                    >
                        <motion.button
                            className="absolute top-3 right-3 text-zinc-400 hover:text-blue-600 text-2xl font-bold transition"
                            onClick={onClose}
                            aria-label="Bezárás"
                            whileHover={{ scale: 1.2, rotate: 90, color: '#2563eb' }}
                            whileTap={{ scale: 0.9, rotate: -90, color: '#1e293b' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                            ×
                        </motion.button>
                        <motion.div className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <motion.svg width="36" height="36" fill="none" viewBox="0 0 36 36"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                            >
                                <rect width="36" height="36" rx="10" fill="#3b82f6"/>
                                <motion.path d="M12 18h12M18 12v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.7, delay: 0.3 }}
                                />
                            </motion.svg>
                            <motion.h2 className="text-3xl font-extrabold text-zinc-800"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.4 }}
                            >WebP Varázsló Súgó</motion.h2>
                        </motion.div>
                        <motion.div className="space-y-4 text-zinc-700 text-lg"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
                                <b>WebP Varázsló</b> egy modern, böngészőben futó képkonvertáló, amellyel egyszerűen optimalizálhatod képeidet <span className="text-blue-600 font-semibold">WebP</span> formátumba.
                            </motion.p>
                            <motion.ul className="list-disc pl-6 space-y-2 text-base"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.13,
                                            delayChildren: 0.5
                                        }
                                    }
                                }}
                            >
                                {{
                                    0: <><b>Képek feltöltése:</b> Húzd be a képeket vagy mappákat, vagy válaszd ki őket a gombbal. Támogatott formátumok: <span className="font-semibold">JPG, PNG, GIF</span>.</>,
                                    1: <><b>Beállítások:</b> Állítsd be a maximális méretet és a minőséget, vagy válassz előre mentett presetet.</>,
                                    2: <><b>Feldolgozás:</b> A "Képek Feldolgozása" gombbal indíthatod a konvertálást. Minden képet külön-külön optimalizál a rendszer.</>,
                                    3: <><b>Letöltés:</b> Az elkészült képeket egyesével vagy az "Összes letöltése" gombbal is letöltheted. A letöltött fájlok neve: <span className="font-mono text-blue-700">optimalizalt_&#123;eredeti_név&#125;.webp</span></>,
                                    4: <><b>Újrafeldolgozás:</b> Bármilyen beállítás-változtatás vagy új kép feltöltése után újra feldolgozhatod a teljes listát.</>,
                                    5: <><b>Figyelem:</b> Asztali Safari böngészőben a WebP minőség beállítás nem mindig működik, a kimeneti fájlméret nagyobb lehet a vártnál.</>,
                                }[0]}
                            </motion.ul>
                        </motion.div>
                        <motion.div className="mt-8 text-center text-zinc-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <span>© {year} [V.N.]</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
