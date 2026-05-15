import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const GlowingButton = ({ children, onClick, className, isLoading, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300",
                "bg-gradient-to-r from-primary via-secondary to-accent",
                "shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]",
                "border border-white/20 overflow-hidden",
                isLoading && "opacity-80 cursor-wait",
                className
            )}
            onClick={onClick}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    Generating AI...
                    <span className="flex gap-1">
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1 h-1 bg-white rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-white rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-white rounded-full" />
                    </span>
                </span>
            ) : (
                children
            )}

            {/* Subtle sheen effect */}
            <div className="absolute top-0 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine pointer-events-none" />
        </motion.button>
    );
};

export default GlowingButton;
