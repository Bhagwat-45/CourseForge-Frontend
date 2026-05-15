import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, FlaskConical, Pencil, Sparkles, Brain, Award, X, Send } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

import CodePlayground from './CodePlayground';

const LabWorkshop = ({ topicId, onComplete }) => {
    const [lab, setLab] = useState(null);
    const [submission, setSubmission] = useState('// Enter your solution here...\n');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (topicId) fetchLab();
    }, [topicId]);

    const fetchLab = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await courseAPI.getLab(topicId);
            setLab(data);
            if (data.initial_code) {
                setSubmission(data.initial_code);
            }
        } catch (err) {
            console.error('Failed to fetch lab:', err);
            setError('Failed to load workshop exercise. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!submission.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const data = await courseAPI.submitLab(topicId, {
                exercise: lab,
                submission: submission
            });
            setResult(data);
            if (data.passed) onComplete?.();
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Forging Lab exercise...</p>
        </div>
    );

    if (error || !lab) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
            <FlaskConical className="w-12 h-12 text-red-400/50" />
            <p className="text-sm text-red-400 font-medium">{error || 'Workshop not available.'}</p>
            <button onClick={fetchLab} className="px-6 py-2 bg-white/10 rounded-xl text-sm text-white/60 hover:bg-white/20 transition-colors">Retry</button>
        </div>
    );

    if (result) return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center space-y-6"
        >
            <div className={cn(
                "w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2",
                result.passed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-red-500/10 border-red-500/30 text-red-500"
            )}>
                {result.passed ? <Award className="w-10 h-10" /> : <X className="w-10 h-10" />}
            </div>
            
            <div>
                <h3 className="text-2xl font-black italic tracking-tight mb-2">
                    {result.passed ? "MASTERY CONFIRMED" : "REFORGE REQUIRED"}
                </h3>
                <p className="max-w-md mx-auto text-sm text-white/40 leading-relaxed">
                    {result.feedback}
                </p>
            </div>

            {result.passed && (
                <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">SCORE</p>
                        <p className="text-xl font-black text-primary">{result.score}%</p>
                    </div>
                    <div className="w-px h-10 bg-white/5" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">MASTER XP</p>
                        <p className="text-xl font-black text-emerald-500">+{result.xp_awarded}</p>
                    </div>
                </div>
            )}

            {!result.passed && (
                <button 
                    onClick={() => setResult(null)}
                    className="px-8 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                    Try Reforging
                </button>
            )}
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FlaskConical className="w-24 h-24 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg">
                        <Pencil className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Interactive Workshop</h4>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Mastery Application Unit</p>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">Exercise</p>
                        <p className="text-lg font-bold text-white/80 leading-snug">
                            {lab.exercise}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Requirements</p>
                            <div className="space-y-2">
                                {lab.requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-medium text-white/60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {req}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Hints</p>
                            <div className="space-y-2">
                                {lab.hints.map((hint, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs italic text-white/30">
                                        <Sparkles className="w-3 h-3 text-primary/40" />
                                        {hint}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Hook */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mastery Terminal</p>
                   <span className="text-[9px] font-medium text-white/10 italic">Evaluated by AI Lab Warden</span>
                </div>
                
                <div className="rounded-3xl overflow-hidden border border-white/5 bg-black/40">
                    <CodePlayground 
                        initialCode={submission}
                        initialLanguage={lab.language || 'python'}
                        onChange={(val) => setSubmission(val)}
                        title="Workshop Editor"
                    />
                </div>
                
                <button 
                    onClick={handleSubmit}
                    disabled={!submission.trim() || isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>WARDEN EVALUATING...</span>
                        </div>
                    ) : (
                        <>
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            SUBMIT FOR MASTERY INDEXING
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LabWorkshop;
