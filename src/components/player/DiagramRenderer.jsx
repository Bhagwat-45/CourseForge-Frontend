import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Share2 } from 'lucide-react';

const DiagramRenderer = ({ content }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center relative overflow-hidden"
        >
            <div className="absolute inset-0 neural-grid opacity-10" />

            <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <Share2 className="w-10 h-10 text-accent animate-pulse" />
                </div>

                <h3 className="text-2xl font-black mb-4 tracking-tight">Interactive Knowledge Graph</h3>
                <div className="bg-black/40 p-6 rounded-2xl font-mono text-xs text-accent/60 border border-accent/20 inline-block mb-8">
                    {content.diagram || 'graph TD\n  A[Start] --> B[Concept]\n  B --> C[Mastery]'}
                </div>

                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                    This module uses Agent Illustrator's neural mapping to visualize semantic relationships.
                    Interactive traversal enabled.
                </p>
            </div>

            {/* Animated particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-accent/40 rounded-full"
                    animate={{
                        x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                        y: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
                />
            ))}
        </motion.div>
    );
};

export default DiagramRenderer;
