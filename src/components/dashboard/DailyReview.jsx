import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, X, ArrowRight, RefreshCcw, Play } from 'lucide-react';
import api from '../../lib/api';

export default function DailyReview() {
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/api/srs/daily-review');
                setReviews(res.data.reviews || []);
            } catch (error) {
                console.error("Failed to load daily reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleRating = async (quality) => {
        const card = reviews[currentIndex];
        try {
            await api.post('/api/srs/review', {
                flashcard_id: card.flashcard_id,
                quality: quality
            });
            
            // Move to next card
            if (currentIndex + 1 < reviews.length) {
                setIsFlipped(false);
                setCurrentIndex(prev => prev + 1);
            } else {
                setCompleted(true);
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (completed || reviews.length === 0) {
        return (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center max-w-lg mx-auto mt-12">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">All Caught Up!</h2>
                <p className="text-white/60 mb-8">You have completed all your daily flashcard reviews. Great job maintaining your streak!</p>
            </div>
        );
    }

    const currentCard = reviews[currentIndex];

    return (
        <div className="max-w-2xl mx-auto mt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Daily Review</h2>
                    <p className="text-white/60">Card {currentIndex + 1} of {reviews.length}</p>
                </div>
                <div className="bg-primary/20 p-3 rounded-2xl">
                    <Brain className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="relative perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex + (isFlipped ? '-back' : '-front')}
                        initial={{ opacity: 0, rotateX: isFlipped ? -90 : 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: isFlipped ? 90 : -90 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/[0.05] border border-white/10 rounded-[2.5rem] p-12 min-h-[400px] flex flex-col justify-center items-center text-center shadow-2xl cursor-pointer"
                        onClick={() => !isFlipped && setIsFlipped(true)}
                    >
                        {isFlipped ? (
                            <>
                                <p className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">Answer</p>
                                <p className="text-2xl text-white leading-relaxed">{currentCard.back}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-white/40 mb-4 uppercase tracking-widest">Question</p>
                                <p className="text-3xl text-white font-medium leading-relaxed">{currentCard.front}</p>
                                <p className="text-white/40 mt-12 flex items-center gap-2">
                                    <Play className="w-4 h-4" /> Click to reveal answer
                                </p>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isFlipped && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 grid grid-cols-4 gap-4"
                    >
                        <button 
                            onClick={() => handleRating(1)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl py-4 font-bold transition-all"
                        >
                            Again
                        </button>
                        <button 
                            onClick={() => handleRating(3)}
                            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-2xl py-4 font-bold transition-all"
                        >
                            Hard
                        </button>
                        <button 
                            onClick={() => handleRating(4)}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-2xl py-4 font-bold transition-all"
                        >
                            Good
                        </button>
                        <button 
                            onClick={() => handleRating(5)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-2xl py-4 font-bold transition-all"
                        >
                            Easy
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
