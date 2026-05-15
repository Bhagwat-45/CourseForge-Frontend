import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Sparkles, BrainCircuit, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';
import { cn } from '../../lib/utils';

const Exams = () => {
    const { courses, globalMemory, selectCourse } = useCourse();
    const navigate = useNavigate();
    const [isExamMode, setIsExamMode] = useState(false);

    const stats = [
        { label: 'Topics Completed', value: globalMemory?.totalTopicsDone || 0, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
        { label: 'Average Mastery', value: `${Math.round(globalMemory?.totalMastery || 0)}%`, icon: <Sparkles className="w-5 h-5 text-primary" /> },
        { label: 'Total XP', value: globalMemory?.xp || 0, icon: <Zap className="w-5 h-5 text-yellow-500" /> }
    ];

    if (isExamMode) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#050511] flex flex-col items-center justify-center p-6">
                <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-white">Neural Intake Assessment</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Protocol: Adaptive_Validation_v0.2</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExamMode(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
                        >
                            Terminate Exam
                        </button>
                    </div>

                    <div className="space-y-8 mb-12">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Question 1 of 10</p>
                            <h3 className="text-xl font-bold leading-relaxed mb-8">
                                How does the principle of superposition apply to the computational power of a qubit compared to a classical bit?
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    'It allows for simultaneous representation of both 0 and 1 states.',
                                    'It doubles the processing speed of the underlying hardware.',
                                    'It eliminates the need for quantum logic gates.',
                                    'It reduces the decoherence time of the quantum state.'
                                ].map((opt, i) => (
                                    <button key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-left hover:bg-primary/10 hover:border-primary/30 transition-all text-sm group flex items-center justify-between">
                                        <span>{opt}</span>
                                        <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-primary" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" : "bg-white/10")} />
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Progress</span>
                        </div>
                        <button className="px-10 py-5 bg-primary text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                            Confirm Link <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Validation Engine Online</span>
                        </div>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-2">
                        Exams & <span className="text-gradient text-accent">Assessments</span>
                    </h1>
                    <p className="text-white/40 text-lg font-light">Validate your neural synapses through adaptive logic tests.</p>
                </motion.div>

                <div className="flex items-center gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
                            <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{stat.label}</p>
                                <p className="text-lg font-black">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-black tracking-tight mb-8 ml-4 font-mono">Protocols_Ready</h2>
                    <div className="space-y-4">
                        {courses.length === 0 ? (
                            <div className="p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl text-white/20 uppercase font-black tracking-widest">
                                No assessment protocols active. Forge a course first.
                            </div>
                        ) : (
                            courses.map((course, i) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => {
                                        selectCourse(course.id);
                                        navigate(`/player/${course.id}`);
                                    }}
                                    className="group bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 flex items-center justify-between hover:border-accent/30 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 transition-all">
                                            <BrainCircuit className="w-8 h-8 text-white/20 group-hover:text-accent transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <span className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> {course.modules ? course.modules.length : '??'} Modules</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                <span>{course.difficulty || 'Expert'}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                <span className="text-primary">{course.progress || 0}% Done</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="px-8 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-accent group-hover:text-white transition-all relative z-10"
                                    >
                                        Run Assessment
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gradient-to-br from-accent/20 to-primary/20 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                        <ShieldCheck className="w-12 h-12 text-accent mb-8" />
                        <h3 className="text-3xl font-black tracking-tight mb-4 leading-tight">Proctor AI Insight</h3>
                        <p className="text-white/60 leading-relaxed mb-8 font-light">
                            "Alex, your performance in Quantum Logic has increased by 15.2% this week. I recommend the Mastery Exam for further synchronization."
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                <span>Mastery Readiness</span>
                                <span>82%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '82%' }}
                                    className="h-full bg-accent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exams;
