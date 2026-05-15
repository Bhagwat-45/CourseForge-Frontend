import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Maximize2, Minimize2, X, Headphones, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import ContentStage from './ContentStage';

const POMODORO = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes

const FocusMode = ({ isOpen, onClose, topic, onStartQuiz, difficulty, setDifficulty }) => {
    const [timeLeft, setTimeLeft] = useState(POMODORO);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Audio context for ambient noise (brown noise simulation)
    const audioCtxRef = useRef(null);
    const noiseNodeRef = useRef(null);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (mode === 'focus') {
            // Play a soft chime here if desired
            setMode('break');
            setTimeLeft(SHORT_BREAK);
        } else {
            setMode('focus');
            setTimeLeft(POMODORO);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? POMODORO : SHORT_BREAK);
    };

    // Ambient Noise Generator (Brown Noise)
    const toggleAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            
            const bufferSize = 2 * audioCtxRef.current.sampleRate;
            const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Compensate for volume
            }

            gainNodeRef.current = audioCtxRef.current.createGain();
            gainNodeRef.current.gain.value = 0.1; // Low volume ambient
            gainNodeRef.current.connect(audioCtxRef.current.destination);

            noiseNodeRef.current = audioCtxRef.current.createBufferSource();
            noiseNodeRef.current.buffer = noiseBuffer;
            noiseNodeRef.current.loop = true;
            noiseNodeRef.current.connect(gainNodeRef.current);
            noiseNodeRef.current.start(0);
            setIsMuted(false);
        } else {
            if (audioCtxRef.current.state === 'running') {
                audioCtxRef.current.suspend();
                setIsMuted(true);
            } else {
                audioCtxRef.current.resume();
                setIsMuted(false);
            }
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // Fullscreen handling
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.error(e));
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Also close FocusMode when user presses Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            // If they press Escape while in full screen, the browser handles exiting full screen
            // first. If they press it while windowed, or again, we close the mode.
            if (e.key === 'Escape' && !document.fullscreenElement) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[100] bg-[#030308] flex flex-col items-center justify-center p-8 overflow-hidden"
            >
                {/* Minimal Header */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-[#030308] to-transparent">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            mode === 'focus' ? "bg-emerald-500" : "bg-primary"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-white/40">
                            {mode === 'focus' ? 'Deep Work Session active' : 'Recovery Phase active'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleAudio}
                            className={cn(
                                "p-3 rounded-2xl transition-all",
                                !isMuted ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                            )}
                            title="Toggle Ambient Noise (Brown Noise)"
                        >
                            <Headphones className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={toggleFullscreen}
                            className="p-3 bg-white/5 text-white/40 hover:text-white rounded-2xl transition-colors"
                            title="Toggle Fullscreen"
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <button 
                            onClick={() => {
                                if (document.fullscreenElement) document.exitFullscreen();
                                onClose();
                            }}
                            className="p-3 bg-white/5 text-white/40 hover:bg-rose-500/20 hover:text-rose-400 rounded-2xl transition-colors"
                            title="Exit Focus Mode (Esc)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Ambient breathing background effect */}
                <motion.div 
                    animate={{ 
                        opacity: isActive ? [0.03, 0.08, 0.03] : 0.03,
                        scale: isActive ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none",
                        mode === 'focus' ? "bg-emerald-900/40" : "bg-primary/40"
                    )}
                />

                <div className="w-full max-w-5xl h-full flex flex-col relative z-0 mt-16">
                    {/* Timer */}
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="font-mono text-[8rem] font-black leading-none tracking-tighter tabular-nums drop-shadow-2xl">
                            {formatTime(timeLeft)}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-8">
                            <button
                                onClick={toggleTimer}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all",
                                    isActive 
                                        ? "bg-white/10 text-white/90 hover:bg-white/20" 
                                        : (mode === 'focus' ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:scale-105" : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105")
                                )}
                            >
                                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isActive ? 'Pause' : 'Start'}
                            </button>
                            
                            <button
                                onClick={resetTimer}
                                className="p-4 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
                                title="Reset Timer"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            <button
                                onClick={() => {
                                    setMode(mode === 'focus' ? 'break' : 'focus');
                                    setTimeLeft(mode === 'focus' ? SHORT_BREAK : POMODORO);
                                    setIsActive(false);
                                }}
                                className="px-6 py-4 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Skip to {mode === 'focus' ? 'Break' : 'Focus'}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto w-full max-h-full pb-32 pt-8 border-t border-white/5 mt-8 custom-scrollbar">
                        <div className="max-w-3xl mx-auto">
                           <ContentStage 
                                activeTopic={topic} 
                                onStartQuiz={onStartQuiz}
                                difficulty={difficulty}
                                setDifficulty={setDifficulty}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FocusMode;
