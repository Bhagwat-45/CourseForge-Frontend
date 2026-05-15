import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, Download, X, Headphones, Sparkles, AlertTriangle } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const ForgeCastPlayer = ({ isOpen, onClose, courseId, courseTitle }) => {
    const [podcast, setPodcast] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (isOpen && courseId) {
            fetchPodcast();
        }
        return () => {
            // Cleanup: pause audio when closing
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
        };
    }, [isOpen, courseId]);

    const fetchPodcast = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await courseAPI.getPodcast(courseId);
            setPodcast(data);
        } catch (err) {
            console.error('Failed to fetch podcast:', err);
            setError('Could not load podcast. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying && audioRef.current) {
            interval = setInterval(() => {
                if (audioRef.current && audioRef.current.duration) {
                    const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    setProgress(isNaN(p) ? 0 : p);
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                setError('Audio playback failed. The audio source may be unavailable.');
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !audioRef.current.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = ratio * audioRef.current.duration;
        setProgress(ratio * 100);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="fixed bottom-0 left-0 right-0 z-[160] px-6 pb-6 pointer-events-none"
                >
                    <div className="max-w-4xl mx-auto bg-[#0A0A1F]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl pointer-events-auto overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                        
                        {isLoading ? (
                            <div className="flex items-center gap-6 py-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
                                    <Mic2 className="w-6 h-6 text-white/20" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-white/10 rounded-full animate-pulse" />
                                    <div className="h-3 w-32 bg-white/5 rounded-full animate-pulse" />
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all" aria-label="Close podcast player">
                                    <X className="w-5 h-5 text-white/20" />
                                </button>
                            </div>
                        ) : error ? (
                            <div className="flex items-center gap-6 py-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-red-400 font-medium">{error}</p>
                                    <button 
                                        onClick={fetchPodcast} 
                                        className="mt-2 text-xs text-white/60 hover:text-white underline transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all" aria-label="Close podcast player">
                                    <X className="w-5 h-5 text-white/20" />
                                </button>
                            </div>
                        ) : podcast?.audio_url ? (
                            <div className="relative z-10">
                                <audio 
                                    ref={audioRef} 
                                    src={podcast.audio_url} 
                                    onEnded={() => setIsPlaying(false)}
                                    onError={() => setError('Audio failed to load.')}
                                    preload="metadata"
                                />
                                
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    {/* Artwork / Icon */}
                                    <div className="relative group shrink-0">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] shadow-lg shadow-primary/20">
                                            <div className="w-full h-full bg-[#050511] rounded-2xl flex items-center justify-center">
                                                <Headphones className="w-8 h-8 text-primary" />
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-primary rounded-full text-[8px] font-black uppercase tracking-widest animate-bounce">AI Cast</div>
                                    </div>

                                    {/* Info & Controls */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black tracking-tight text-white uppercase truncate pr-10">{courseTitle || 'Course Podcast'}</h4>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">ForgeCast • Echo & Nova Dialogue</p>
                                            </div>
                                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all shrink-0" aria-label="Close podcast player">
                                                <X className="w-5 h-5 text-white/20" />
                                            </button>
                                        </div>

                                        {/* Progress Bar */}
                                        <div 
                                            className="w-full h-1.5 bg-white/5 rounded-full mb-6 relative group cursor-pointer overflow-hidden"
                                            onClick={handleSeek}
                                            role="slider"
                                            aria-label="Podcast progress"
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={Math.round(progress)}
                                            tabIndex={0}
                                        >
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Player Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    className="p-2 text-white/20 hover:text-white transition-all" 
                                                    aria-label="Skip back"
                                                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); }}
                                                >
                                                    <SkipBack className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={togglePlay}
                                                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-white/10"
                                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                                >
                                                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-1" />}
                                                </button>
                                                <button 
                                                    className="p-2 text-white/20 hover:text-white transition-all"
                                                    aria-label="Skip forward"
                                                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10); }}
                                                >
                                                    <SkipForward className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:flex items-center gap-3 text-white/40">
                                                    <Volume2 className="w-4 h-4" />
                                                    <div className="w-20 h-1 bg-white/10 rounded-full" />
                                                </div>
                                                <button 
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                                    aria-label="Save podcast"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Save Cast
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6 py-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <Mic2 className="w-6 h-6 text-white/20" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white/40">No podcast available for this course yet.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all" aria-label="Close podcast player">
                                    <X className="w-5 h-5 text-white/20" />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ForgeCastPlayer;
