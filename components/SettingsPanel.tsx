import React from 'react';
import { SectionTitle } from './SectionTitle';
import { ConversionSettings } from '../types';
import { PRESETS, NO_PRESET } from '../constants/presets';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
    settings: ConversionSettings;
    onSettingsChange: (newSettings: Partial<ConversionSettings>) => void;
    onProcess: () => void;
    processingFileCount: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onProcess, processingFileCount }) => {
    
    // Dropdown state for custom preset selector
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handlePresetChangeCustom = (presetName: string) => {
        if (presetName === NO_PRESET) {
            onSettingsChange({ preset: '' });
        } else {
            const preset = PRESETS.find((p) => p.name === presetName);
            if (preset) {
                onSettingsChange({ ...preset.settings, preset: preset.name });
            }
        }
    };
    
    const [canProcess, setCanProcess] = React.useState(true);
    const [lastSettings, setLastSettings] = React.useState<ConversionSettings|null>(null);
    const [lastFileCount, setLastFileCount] = React.useState<number>(0);

    React.useEffect(() => {
        // Ha minden képet töröltek, reseteld a lastSettings és lastFileCount értékét, ÉS a file inputot is
        if (processingFileCount === 0) {
            setLastSettings(null);
            setLastFileCount(0);
            // File input reset kívülről
            if ((window as any).uploadPanelRef && (window as any).uploadPanelRef.current) {
                (window as any).uploadPanelRef.current.reset();
            }
        }
        // Engedélyezze, ha van kép ÉS (változott a beállítás vagy nőtt a képek száma)
        setCanProcess(
            processingFileCount > 0 && (
                lastSettings === null ||
                JSON.stringify(settings) !== JSON.stringify(lastSettings) ||
                processingFileCount > lastFileCount
            )
        );
    }, [settings, processingFileCount, lastSettings, lastFileCount]);

    const handleProcess = () => {
        setLastSettings(settings);
        setLastFileCount(processingFileCount);
        onProcess();
        // Scroll to processing queue
        setTimeout(() => {
            const el = document.getElementById('processing-queue');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };

    return (
        <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <SectionTitle num={2} title="Feldolgozási Beállítások" />

            {/* PRESETS */}
            <div>
                <label htmlFor="preset" className="block text-sm font-medium text-zinc-700">Előre mentett beállítások (Preset)</label>
                <div className="mt-1 relative">
                    {/* Custom Dropdown */}
                    <div className="relative" tabIndex={0}>
                        <motion.button
                            className="w-full bg-zinc-100 border border-zinc-300 rounded-lg px-4 py-2 text-left font-medium text-zinc-700 hover:bg-blue-50 transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            onClick={() => setDropdownOpen((v) => !v)}
                        >
                            {settings.preset || 'Válassz presetet'}
                        </motion.button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.ul
                                    className="absolute left-0 right-0 bg-white border border-zinc-200 rounded-lg shadow-lg mt-2 z-10"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {PRESETS.map((preset) => (
                                        <motion.li
                                            key={preset.name}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                            onClick={() => {
                                                handlePresetChangeCustom(preset.name);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            {preset.name}
                                        </motion.li>
                                    ))}
                                    <motion.li
                                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                        onClick={() => {
                                            handlePresetChangeCustom(NO_PRESET);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Egyéni beállítások
                                    </motion.li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* OUTPUT FORMAT */}
            <div className="mt-6 pt-6 border-t border-zinc-200">
                <h3 className="text-sm font-medium text-zinc-700">Kimeneti formátum</h3>
                <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        WebP
                    </span>
                </div>
            </div>
            
            {/* RESIZING */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="width" className="block text-sm font-medium text-zinc-700">Max. szélesség</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" id="width" className="block w-full rounded-lg border-zinc-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="1920" 
                            value={settings.maxWidth}
                            onChange={(e) => onSettingsChange({ maxWidth: e.target.value })}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">px</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-zinc-700">Max. magasság</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <input type="number" id="height" className="block w-full rounded-lg border-zinc-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Nincs megadva"
                            value={settings.maxHeight}
                            onChange={(e) => onSettingsChange({ maxHeight: e.target.value })}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">px</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUALITY */}
            <div className="mt-6">
                <label htmlFor="quality" className="block text-sm font-medium text-zinc-700">WebP minőség: <span className="font-bold text-blue-600">{settings.quality}%</span></label>
                <input id="quality" type="range" min="1" max="100" 
                    value={settings.quality}
                    onChange={(e) => onSettingsChange({ quality: parseInt(e.target.value, 10) })}
                    className="mt-2 w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* PROCESS BUTTON */}
            <div className="mt-8 pt-6 border-t border-zinc-200">
                <motion.button 
                    onClick={handleProcess}
                    disabled={!canProcess}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:bg-zinc-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                    whileHover={{ scale: canProcess ? 1.04 : 1 }}
                    whileTap={{ scale: canProcess ? 0.98 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                    Képek Feldolgozása ({processingFileCount})
                </motion.button>
            </div>
        </motion.div>
    );
};

/* --- Add animation for fadeIn if not present --- */
/* In your global CSS (e.g. custom-animations.css), add:
.animate-fadeIn { animation: fadeIn 0.18s cubic-bezier(0.4,0,0.2,1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px);} to { opacity: 1; transform: none;} }
*/