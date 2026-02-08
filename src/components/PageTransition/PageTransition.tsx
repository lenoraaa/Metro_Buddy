'use strict';

import { motion } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1], // Gentle "calm" cubic bezier
            }}
            style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
