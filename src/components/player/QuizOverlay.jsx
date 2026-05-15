import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const QuizOverlay = ({ quizzes, onComplete, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    if (!quizzes || quizzes.length === 0) return null;

    const currentQuiz = quizzes[currentIndex];

    const [results, setResults] = useState([]); // Array of { question, wasCorrect, concept }

    const handleAnswer = (optionIndex) => {
        if (showExplanation) return;
        setSelectedOption(optionIndex);
        setShowExplanation(true);
        const wasCorrect = optionIndex === currentQuiz.correct_answer;
        if (wasCorrect) {
            setScore(prev => prev + 1);
        }
        setResults(prev => [...prev, { 
            question: currentQuiz.question, 
            wasCorrect, 
            concept: currentQuiz.concept_node || currentQuiz.bloom_level 
        }]);
    };

    const handleNext = () => {
        if (currentIndex < quizzes.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowExplanation(false);
        setIsFinished(false);
        setResults([]);
    };

    if (isFinished) {
        const accuracy = Math.round((score / quizzes.length) * 100);
        const weaknesses = results
            .filter(r => !r.wasCorrect)
            .map(r => r.concept);
        const uniqueWeaknesses = [...new Set(weaknesses)];

        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl text-center max-w-2xl w-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-500" />
                
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                
                <h2 className="text-4xl font-black mb-2">Mastery Synchronized</h2>
                <p className="text-white/40 mb-10 font-bold uppercase tracking-[0.2em] text-[10px]">Assessment ID: forged_mastery_{Math.random().toString(36).substr(2, 5)}</p>
                
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Accuracy</p>
                        <p className={cn("text-5xl font-black", accuracy >= 80 ? "text-emerald-500" : accuracy >= 50 ? "text-amber-400" : "text-red-500")}>
                            {accuracy}%
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">XP Earned</p>
                        <p className="text-5xl font-black text-primary">+{score * 20}</p>
                    </div>
                </div>

                {uniqueWeaknesses.length > 0 ? (
                    <div className="mb-12 text-left space-y-4">
                        <div className="flex items-center gap-2 text-red-400">
                            <ArrowRight className="w-4 h-4 rotate-45" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Cognitive Gaps Detected</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {uniqueWeaknesses.map((w, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                                    {w}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-white/40 italic">Recommendation: Review the subtopics linked to these concepts to achieve full synchronization.</p>
                    </div>
                ) : (
                    <div className="mb-12 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-left">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Perfect Alignment</h4>
                        </div>
                        <p className="text-sm text-emerald-500/70">Neural integration complete. All concepts mapped with 100% fidelity.</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => onComplete(score)}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                    >
                        Finalize Synchronization
                    </button>
                    <button 
                        onClick={handleRetry}
                        className="w-full py-4 bg-white/5 text-white/60 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all text-xs uppercase tracking-widest"
                    >
                        Retry Assessment
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <div className="flex items-center justify-between mb-8 md:mb-12 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white leading-none">Neural Assessment</h2>
                        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1"> protocolo_mastery_v0.5</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 md:p-3 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8 md:mb-12 min-h-0">
                <div className="space-y-8">
                    <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Question {currentIndex + 1} of {quizzes.length}</p>
                        <h3 className="text-lg md:text-xl font-bold leading-relaxed mb-6 md:mb-8">
                            {currentQuiz.question}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                            {currentQuiz.options.map((opt, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleAnswer(i)}
                                    disabled={showExplanation}
                                    className={cn(
                                        "p-5 md:p-6 border rounded-xl text-left transition-all text-sm flex items-center justify-between group",
                                        showExplanation 
                                            ? i === currentQuiz.correct_answer 
                                                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                : selectedOption === i 
                                                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                                                    : "bg-white/[0.02] border-white/5 opacity-40"
                                            : "bg-white/[0.02] border-white/5 hover:bg-primary/10 hover:border-primary/30"
                                    )}
                                >
                                    <span>{opt}</span>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-4",
                                        showExplanation && i === currentQuiz.correct_answer ? "border-emerald-500 bg-emerald-500" : "border-white/10 group-hover:border-primary"
                                    )}>
                                        {showExplanation && i === currentQuiz.correct_answer && <ShieldCheck className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5"
                                >
                                    <div className={cn(
                                        "p-5 md:p-6 rounded-xl border",
                                        selectedOption === currentQuiz.correct_answer 
                                            ? "bg-emerald-500/5 border-emerald-500/20" 
                                            : "bg-red-500/5 border-red-500/20"
                                    )}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                selectedOption === currentQuiz.correct_answer ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                            )} />
                                            <p className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                selectedOption === currentQuiz.correct_answer ? "text-emerald-500" : "text-red-400"
                                            )}>
                                                {selectedOption === currentQuiz.correct_answer ? "Neural Validation Successful" : "Cognitive Misalignment Detected"}
                                            </p>
                                        </div>
                                        <p className="text-sm text-white/70 leading-relaxed italic">
                                            {selectedOption === currentQuiz.correct_answer 
                                                ? currentQuiz.explanation 
                                                : (currentQuiz.wrong_option_explanations?.[selectedOption < currentQuiz.correct_answer ? selectedOption : selectedOption - 1] || currentQuiz.explanation)
                                            }
                                        </p>
                                        {selectedOption !== currentQuiz.correct_answer && (
                                            <p className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                Insight: {currentQuiz.bloom_level} assessment failed. Mastery score recalculated.
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center shrink-0 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        {quizzes.map((_, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500", 
                                    i === currentIndex ? "bg-primary w-4 md:w-6 shadow-[0_0_15px_rgba(124,58,237,0.8)]" : 
                                    i < currentIndex ? "bg-emerald-500" : "bg-white/10"
                                )} 
                            />
                        ))}
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/20">Progression</span>
                </div>
                <button 
                    onClick={handleNext}
                    disabled={!showExplanation}
                    className="px-6 md:px-10 py-4 md:py-5 bg-primary text-white text-xs md:text-sm font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-20 disabled:scale-100"
                >
                    {currentIndex < quizzes.length - 1 ? 'Next Question' : 'Finish Mastery'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default React.memo(QuizOverlay);
