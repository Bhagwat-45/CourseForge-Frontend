import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mb-12"
            >
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center relative z-10 backdrop-blur-3xl shadow-2xl">
                    <BrainCircuit className="w-10 h-10 text-primary opacity-40" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[#050511] shadow-lg">
                    <Sparkles className="w-3 h-3 text-primary" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full mb-4">
                    <AlertCircle className="w-3 h-3 text-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Development Protocol Active</span>
                </div>
                <h2 className="text-5xl font-black tracking-tighter mb-4">{title}</h2>
                <p className="text-white/40 max-w-sm mx-auto font-light leading-relaxed">
                    The Council of Agents is currently forging this neural pathway.
                    <br />Access will be granted upon synchronization completion.
                </p>
            </motion.div>
        </div>
    );
};

export default PlaceholderPage;
