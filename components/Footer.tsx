import React from 'react';
import { motion } from 'framer-motion';
import { year } from '../constants/presets'; 
export const Footer: React.FC = () => {

    return (
        <motion.footer
            className="text-center text-zinc-500 text-sm mt-16 py-4 border-t border-zinc-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
        >
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                © {year} [V.N.]
            </motion.p>
        </motion.footer>
    );
};
