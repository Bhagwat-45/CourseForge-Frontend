import React from 'react';
import { motion } from 'framer-motion';
import { Play, BrainCircuit, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroBriefing = ({ userName, stats, latestCourse, onForge }) => {
    const navigate = useNavigate();

    return (
        <section className="relative p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-white/[0.02] to-accent/5 border border-white/10 overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Command Intelligence Active</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        Welcome Back, <span className="text-gradient">Agent {userName}</span>
                    </h1>

                    <p className="text-lg text-white/50 font-medium leading-relaxed max-w-xl">
                        You have <span className="text-white font-bold">{stats.activeCourses} active masterworks</span>.
                        Your cognition stability is at <span className="text-accent font-bold">Peak Sync</span>.
                        Ready to resume your transformation?
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {latestCourse ? (
                        <button
                            onClick={() => navigate(`/player/${latestCourse.id}`)}
                            className="px-8 py-5 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-white/10"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Continue Learning
                        </button>
                    ) : (
                        <button
                            onClick={onForge}
                            className="px-8 py-5 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-white/10"
                        >
                            <BrainCircuit className="w-5 h-5" />
                            Forge First Course
                        </button>
                    )}

                    <button
                        onClick={onForge}
                        className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all backdrop-blur-xl flex items-center gap-3"
                    >
                        Forge New Module
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroBriefing;
