import { ConversionSettings } from '../types';

export interface Preset {
    name: string;
    settings: Omit<ConversionSettings, 'preset'>;
}

export const NO_PRESET = 'Egyéni beállítások';

export const PRESETS: Preset[] = [
    {
        name: 'Blog képek (max 1200px, 85%)',
        settings: { maxWidth: '1200', maxHeight: '', quality: 85 }
    },
    {
        name: 'Webshop termékképek (max 800px, 80%)',
        settings: { maxWidth: '800', maxHeight: '', quality: 80 }
    },
    {
        name: 'Ultra-tömörített (max 1000px, 75%)',
        settings: { maxWidth: '1000', maxHeight: '', quality: 75 }
    },
    {
        name: 'Profilkép (max 400px, 90%)',
        settings: { maxWidth: '400', maxHeight: '', quality: 90 }
    },
    {
        name: 'Nagy felbontás (max 2000px, 95%)',
        settings: { maxWidth: '2000', maxHeight: '', quality: 95 }
    },
    {
        name: 'Kis méret (max 600px, 70%)',
        settings: { maxWidth: '600', maxHeight: '', quality: 70 }
    }
];

export const year = new Date().getFullYear();