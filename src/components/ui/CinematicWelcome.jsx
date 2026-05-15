import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, Zap, ArrowRight } from 'lucide-react';

const CinematicWelcome = ({ userName, stats }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasShown = sessionStorage.getItem('courseforge_welcome_shown');
        if (!hasShown) {
            setIsVisible(true);
            sessionStorage.setItem('courseforge_welcome_shown', 'true');

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        },
        exit: {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050511]/95 backdrop-blur-2xl"
                >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-4xl w-full">
                        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-white">Neural Sync Established</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-9xl font-black mb-8 tracking-tighter"
                        >
                            Welcome Back, <br />
                            <span className="text-gradient animate-text-shimmer bg-[length:200%_auto]">Agent {userName}</span>
                        </motion.h1>

                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            {[
                                { label: 'Active Memory', value: stats.activeCourses || 0, icon: BrainCircuit, color: 'text-primary' },
                                { label: 'Synapse Flow', value: stats.totalActivity || 0, icon: Activity, color: 'text-accent' },
                                { label: 'Mastery Level', value: stats.mastery || 0, icon: Zap, color: 'text-yellow-400' }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-md text-left group hover:bg-white/10 transition-all">
                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-2xl font-black mb-1">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => setIsVisible(false)}
                            className="mt-16 group flex items-center gap-3 mx-auto px-8 py-4 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all"
                        >
                            Enter The Hub
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CinematicWelcome;
