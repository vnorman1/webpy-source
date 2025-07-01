import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onHelpClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
    return (
        <motion.header
            className="border-b-2 border-zinc-200 pb-4 mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-4">
                        <motion.div className="w-12 h-12 bg-blue-300 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                        />
                        <motion.h1
                            className="text-3xl sm:text-4xl font-black tracking-tight"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >Webpy :D</motion.h1>
                    </div>
                    <motion.p
                        className="mt-2 text-zinc-600 pl-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >Gyors és egyszerű képkonverzió.</motion.p>
                </div>
                <nav>
                    <motion.button
                        type="button"
                        className="text-zinc-600 hover:text-blue-500 transition-colors font-medium bg-transparent border-none cursor-pointer"
                        onClick={onHelpClick}
                        style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                        whileHover={{ scale: 1.15, color: '#2563eb' }}
                        whileTap={{ scale: 0.95, color: '#1e293b' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                        Súgó
                    </motion.button>
                </nav>
            </div>
        </motion.header>
    );
};
