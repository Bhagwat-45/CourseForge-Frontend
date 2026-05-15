import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const EVENTS = [
    "User from London generated 'Python for Beginners'",
    "User from Tokyo started 'Advanced Calculus'",
    "User from New York completed 'Digital Marketing'",
    "User from Berlin generated 'History of Jazz'",
    "User from Sydney aced 'Quantum Mechanics Quiz'",
    "User from Toronto generated 'Vegan Cooking Masterclass'",
];

const LiveTicker = () => {
    return (
        <div className="w-full bg-darkbg/50 border-t border-white/5 backdrop-blur-sm overflow-hidden py-3 flex items-center relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-darkbg to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-darkbg to-transparent z-10" />

            <div className="container mx-auto flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live Feed</span>
                </div>

                <motion.div
                    className="flex gap-12 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 40,
                        ease: "linear"
                    }}
                >
                    {[...EVENTS, ...EVENTS, ...EVENTS].map((event, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/40">
                            <Zap className="w-3 h-3 text-accent/50" />
                            {event}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LiveTicker;
