import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, ChevronRight, X, Sparkles, Brain } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const StudyPlannerModal = ({ isOpen, onClose, courseId, courseTitle }) => {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && courseId) {
            fetchSchedule();
        }
    }, [isOpen, courseId]);

    const fetchSchedule = async () => {
        try {
            setIsLoading(true);
            const data = await courseAPI.getSchedule(courseId);
            setSchedule(data);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#050511] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Sync Schedule</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                                    AI-Optimized Learning Path for {courseTitle}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5 text-white/20" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Analyzing Curriculum Complexity...</p>
                                    <p className="text-xs text-white/20 italic">Forging day-by-day milestones based on content density.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {schedule.map((day, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex gap-6 group"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xs font-black bg-white/[0.02] group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                                                D{day.day}
                                            </div>
                                            {index < schedule.length - 1 && (
                                                <div className="w-px h-full bg-white/5 group-hover:bg-primary/20 transition-all" />
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 pb-8">
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                                <h3 className="font-bold text-white mb-2">{day.task}</h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3 text-primary" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{day.milestone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20">
                                                        <Clock className="w-3 h-3" />
                                                        ~60 MINS
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol Staged</span>
                        </div>
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5"
                        >
                            Accept Schedule
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StudyPlannerModal;
