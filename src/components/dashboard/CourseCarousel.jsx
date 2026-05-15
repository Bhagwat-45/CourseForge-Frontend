import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Clock, Sparkles } from 'lucide-react';

const CourseCarousel = ({ courses }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % courses.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);

    // Default imagery if none provided
    const images = [
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200", // Quantum
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200", // AI
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200", // React
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"  // Cyber
    ];

    return (
        <div className="relative group w-full">
            <div className="overflow-hidden rounded-[2.5rem] relative aspect-[21/9] sm:aspect-[21/7] w-full bg-[#0A0A1F]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <img
                            src={courses[currentIndex].image || images[currentIndex % images.length]}
                            alt={courses[currentIndex].title}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#030309] via-[#030309]/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030309] via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-20 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                                    {courses[currentIndex].level || 'Beginner'}
                                </span>
                                <div className="flex items-center gap-2 text-white/40">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {courses[currentIndex].duration || '12 Hours Content'}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight"
                            >
                                {courses[currentIndex].title}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-8 mb-8"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Progress</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: '0%' }} />
                                        </div>
                                        <span className="text-xs font-black text-primary">0%</span>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Modules</span>
                                    <span className="text-sm font-bold">{courses[currentIndex].modules?.length || 8} Units</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <button className="group/btn relative px-8 py-4 bg-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white overflow-hidden transition-all hover:scale-105 active:scale-95">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        Start Learning <Play className="w-4 h-4 fill-white" />
                                    </span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute bottom-10 right-12 flex gap-4 z-10">
                    <button onClick={prev} className="p-4 rounded-2xl glass border border-white/5 hover:border-primary/50 text-white/50 hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="p-4 rounded-2xl glass border border-white/5 hover:border-primary/50 text-white/50 hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Badge */}
                <div className="absolute top-10 right-12 z-10">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-[#030309]/60 backdrop-blur-xl border border-white/10 rounded-xl">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">AI Optimized</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCarousel;
