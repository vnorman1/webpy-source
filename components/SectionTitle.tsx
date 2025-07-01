import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
    num: number;
    title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ num, title }) => {
    return (
        <motion.h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.span
                className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.2 }}
            >
                {num}
            </motion.span>
            {title}
        </motion.h2>
    );
};
