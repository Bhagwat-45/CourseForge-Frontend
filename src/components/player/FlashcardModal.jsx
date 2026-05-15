import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, RotateCcw, ChevronLeft, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const FlashcardModal = ({ isOpen, onClose, topic, courseId }) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && topic && courseId) {
            setCards([]);
            setCurrentIndex(0);
            setIsFlipped(false);
            setError(null);
            generateCards();
        }
    }, [isOpen, topic, courseId]);

    const generateCards = async () => {
        setIsLoading(true);
        try {
            const prompt = `Generate exactly 5 study flashcards based on this topic's content. Respond ONLY with a valid JSON array of objects. Each object must have exactly two string properties: "question" and "answer". Do not include markdown blocks like \`\`\`json. Just the raw array bracket to bracket.`;
            
            const res = await courseAPI.chatWithMentor(courseId, {
                topic_id: topic.id,
                query: prompt,
                history: []
            });
            
            let jsonString = (res.response || '').trim();

            // Strip markdown code fences (```json ... ```, ``` ... ```, etc.)
            const codeBlockMatch = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
            if (codeBlockMatch) {
                jsonString = codeBlockMatch[1].trim();
            }

            // Try to extract a JSON array from freeform text
            if (!jsonString.startsWith('[')) {
                const arrayMatch = jsonString.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                    jsonString = arrayMatch[0];
                }
            }
            
            const parsed = JSON.parse(jsonString);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Normalize card keys - support both question/answer and front/back
                const normalized = parsed.map(card => ({
                    question: card.question || card.front || card.q || '',
                    answer: card.answer || card.back || card.a || ''
                }));
                setCards(normalized);
            } else {
                throw new Error("Invalid format");
            }
        } catch (err) {
            const isQuota = err.message?.includes('Quota');
            if (!isQuota) console.error('Failed to generate Flashcards:', err);
            
            setError(isQuota 
                ? "High demand detected. Adjusting response... Please wait a minute before generating flashcards."
                : "Failed to generate flashcards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c + 1), 150);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(c => c - 1), 150);
        }
    };

    if (!isOpen) return null;

    const currentCard = cards[currentIndex];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#030308]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
        >
            <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
            
            <div className="w-full max-w-2xl relative z-10 flex flex-col h-full max-h-[800px]">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <BrainCircuit className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Topic Flashcards</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-1">{topic?.title}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-sm font-medium text-white/50 uppercase tracking-widest">Synthesizing Flashcards...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                        <p className="text-red-400">{error}</p>
                        <button onClick={generateCards} className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20">Retry</button>
                    </div>
                ) : cards.length > 0 ? (
                    <>
                        {/* Progress */}
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                                Card {currentIndex + 1} of {cards.length}
                            </span>
                        </div>

                        {/* The Card Container */}
                        <div className="relative w-full flex-1 min-h-[400px] perspective-1000 group">
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className="w-full h-full relative cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {/* Front Side */}
                                <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0A0C10] border border-white/10 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-2xl">
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-indigo-500/50">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">Question</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white/90">
                                        {currentCard?.question}
                                    </h3>
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                        <RotateCcw className="w-4 h-4 text-white/40 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Click to Flip</span>
                                    </div>
                                </div>

                                {/* Back Side */}
                                <div 
                                    className="absolute inset-0 w-full h-full backface-hidden bg-indigo-950/20 border-2 border-indigo-500/30 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(99,102,241,0.1)]"
                                    style={{ transform: 'rotateY(180deg)' }}
                                >
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-indigo-400">
                                        <BrainCircuit className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">Answer</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-medium leading-relaxed text-white">
                                        {currentCard?.answer}
                                    </h3>
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="h-24 mt-8 flex justify-center items-center gap-6 shrink-0">
                            <button
                                onClick={prevCard}
                                disabled={currentIndex === 0}
                                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-white border border-white/10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextCard}
                                disabled={currentIndex === cards.length - 1}
                                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-white border border-white/10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </motion.div>
    );
};

export default React.memo(FlashcardModal);
