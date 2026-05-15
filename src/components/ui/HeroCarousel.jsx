import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Sparkles, Clock, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';
import { courseAPI } from '../../lib/api';

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const { courses, commitCourse } = useCourse();

    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleStart = async (slide) => {
        // Check if user already has this course by title
        const existingCourse = courses.find(c => c.title.toLowerCase().includes(slide.title.toLowerCase()));
        if (existingCourse) {
            navigate(`/player/${existingCourse.id}`);
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);

            // Extract level from category (e.g., "AI · Intermediate" -> "intermediate")
            const level = slide.cat.split(' · ')[1].toLowerCase();
            
            // Trigger AI Generation
            const course = await courseAPI.generate(slide.title, level);
            
            if (course) {
                commitCourse(course);
                // Artificial delay for smooth transition
                setTimeout(() => {
                    navigate(`/player/${course.id}`);
                    setIsGenerating(false);
                }, 1500);
            }
        } catch (err) {
            console.error('Direct generation failed:', err);
            setError(err.message || 'Failed to forge neural pathway');
            setIsGenerating(false);
            // Auto-clear error after 4 seconds
            setTimeout(() => setError(null), 4000);
        }
    };

    const slides = [
        {
            title: 'Quantum Computing 101',
            cat: 'Physics · Beginner',
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            color: "from-blue-500 to-cyan-400"
        },
        {
            title: 'Machine Learning A–Z',
            cat: 'AI · Intermediate',
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            color: "from-violet-500 to-fuchsia-500"
        },
        {
            title: 'React Design Patterns',
            cat: 'Dev · Advanced',
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
            color: "from-orange-400 to-rose-500"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isGenerating) {
                setCurrentIndex((prev) => (prev + 1) % slides.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length, isGenerating]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative perspective-1000 w-full"
            style={{ perspective: '1200px' }}
        >
            {/* Direct Generation Overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#050511]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative flex flex-col items-center max-w-md w-full text-center"
                        >
                            {/* Neural Pulse Animation */}
                            <div className="relative mb-12">
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.4, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary/30 rounded-full blur-3xl"
                                />
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent p-[1px] relative shadow-2xl">
                                    <div className="w-full h-full rounded-3xl bg-black/40 backdrop-blur-xl flex items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">
                                Forging <span className="text-gradient">Neural Path...</span>
                            </h2>
                            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                                Our AI Agents are architecting your masterclass on <br />
                                <span className="text-white">"{slides[currentIndex].title}"</span>
                            </p>

                            {/* Progress bar simulation */}
                            <div className="w-full h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 8, ease: "linear" }}
                                    className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                                />
                            </div>
                            <div className="flex justify-between items-center w-full mt-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Synthesis Alpha</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Approx 10s</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] px-6 py-4 bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-2xl flex items-center gap-4 shadow-2xl"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-0.5">Forging Error</p>
                            <p className="text-xs font-bold text-white">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, Math.random() * -40 - 20, 0],
                            x: [0, (Math.random() - 0.5) * 40, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 rounded-full bg-primary/40 blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative h-[340px] rounded-[2.5rem] overflow-hidden bg-[#0A0A1F] border border-white/10 shadow-2xl transition-all duration-200 ease-out"
            >
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
                            src={slides[currentIndex].image}
                            alt={slides[currentIndex].title}
                            className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030309] via-[#030309]/60 to-transparent" />

                        {/* Content */}
                        <div
                            style={{ transform: "translateZ(80px)" }}
                            className="absolute inset-0 p-10 flex flex-col justify-end pointer-events-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                    {slides[currentIndex].cat}
                                </span>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-black tracking-tighter mb-6 leading-tight"
                            >
                                {slides[currentIndex].title}
                            </motion.h3>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-8 mb-4 pointer-events-auto"
                            >
                                <div className="flex-1 max-w-[200px]">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">
                                        <span>Progress</span>
                                        <span className="text-primary">0%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                                        <div className={`h-full bg-gradient-to-r ${slides[currentIndex].color}`} style={{ width: '0%' }} />
                                    </div>
                                </div>
                                <button 
                                    disabled={isGenerating}
                                    onClick={() => handleStart(slides[currentIndex])}
                                    className="group/btn relative h-12 px-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? 'Forging...' : 'Start'} 
                                    {!isGenerating && <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:scale-110" />}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Floating Meta Details (Depth Effect) */}
                <div style={{ transform: "translateZ(120px)" }} className="absolute top-10 right-10 pointer-events-none">
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
                        <BrainCircuit className="w-4 h-4 text-violet-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Multi-Agent AI</span>
                    </div>
                </div>

                {/* Pagination (Depth Effect) */}
                <div style={{ transform: "translateZ(100px)" }} className="absolute bottom-10 right-10 flex gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/10'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default HeroCarousel;
