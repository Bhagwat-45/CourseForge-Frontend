import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ArrowLeft,
    BrainCircuit, Search, Sparkles, Layout, Mic,
    CheckCircle2, RefreshCw, ChevronRight, Zap,
    Play, Bot, Star, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import Navbar from '../components/layout/Navbar';

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
const AmbientBG = ({ stepColor }) => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:48px_48px]" />
        <motion.div key={stepColor + 'a'} animate={{ scale: [1, 1.35, 1], x: [0, 70, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[30%] -left-[10%] w-[75%] h-[75%] rounded-full blur-[180px] bg-violet-700/20" />
        <motion.div key={stepColor + 'b'} animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[30%] -right-[10%] w-[75%] h-[75%] rounded-full blur-[180px] bg-sky-700/15" />
        <motion.div key={stepColor + 'c'} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[35%] left-[35%] w-[40%] h-[40%] rounded-full blur-[140px] bg-fuchsia-700/10" />
        <div className="absolute inset-0 bg-[#050511]/60" />
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR SPOTLIGHT
// ─────────────────────────────────────────────────────────────────────────────
const CursorSpotlight = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 70, damping: 18 });
    const sy = useSpring(y, { stiffness: 70, damping: 18 });
    useEffect(() => {
        const h = e => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, []);
    return (
        <motion.div className="fixed inset-0 pointer-events-none z-20"
            style={{ background: `radial-gradient(600px circle at ${sx}px ${sy}px, rgba(124,58,237,0.07) 0%, transparent 70%)` }} />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// AI TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const Tooltip = ({ text, visible }) => (
    <AnimatePresence>
        {visible && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.92 }} transition={{ type: 'spring', bounce: 0.45 }}
                className="absolute -top-28 left-0 z-50 w-80 bg-white/8 backdrop-blur-3xl border border-white/15 rounded-2xl p-4 shadow-2xl"
            >
                <div className="flex gap-3 items-start">
                    <div className="p-1.5 bg-primary/30 rounded-lg shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed italic">"{text}"</p>
                </div>
                <div className="absolute -bottom-2 left-7 w-4 h-4 bg-white/8 border-r border-b border-white/15 rotate-45
                    backdrop-blur-3xl" />
            </motion.div>
        )}
    </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
    {
        id: 'input', num: '01',
        title: 'Tell Us What\nYou Want to Learn',
        eyebrow: 'Any Topic · Any File · Any Skill',
        desc: 'Drop a PDF, paste a YouTube link, or simply type a topic. Our AI reads and understands your content instantly.',
        icon: <Search className="w-7 h-7" />,
        iconGrad: 'from-violet-600 to-indigo-500',
        glow: 'rgba(124,58,237,0.45)',
        features: ['PDF & Document Upload', 'YouTube Link Parser', 'Topic Text Input'],
        tooltip: "I can read PDFs, scan images, and parse YouTube videos to build your course.",
    },
    {
        id: 'build', num: '02',
        title: 'AI Builds Your\nCourse for You',
        eyebrow: 'Smart Planning · Instant Creation',
        desc: 'Four specialized AI agents work in parallel — Planner, Writer, Designer, and Reviewer — to craft a full structured course.',
        icon: <BrainCircuit className="w-7 h-7" />,
        iconGrad: 'from-sky-600 to-cyan-400',
        glow: 'rgba(14,165,233,0.4)',
        features: ['AI Course Planner', 'Auto Lesson Writer', 'Smart Visual Generator'],
        tooltip: "Planning 8 modules, connecting concepts, generating visuals...",
    },
    {
        id: 'plan', num: '03',
        title: 'Your Personal\nLearning Plan',
        eyebrow: 'Lessons · Quizzes · Projects',
        desc: 'Get a structured course with lessons, quizzes, and projects at your level. Choose Beginner, Intermediate, or Advanced.',
        icon: <Layout className="w-7 h-7" />,
        iconGrad: 'from-emerald-500 to-teal-400',
        glow: 'rgba(16,185,129,0.4)',
        features: ['3 Difficulty Levels', 'Auto-Generated Quizzes', 'Progress Tracking'],
        tooltip: "Creating your course in 3 levels: Beginner, Intermediate, and Advanced.",
    },
    {
        id: 'tutor', num: '04',
        title: 'Chat With\nYour AI Tutor',
        eyebrow: 'Ask Anything · Learn Faster',
        desc: 'Nova, your AI tutor, is available 24/7. Ask questions, get clear explanations, and receive instant feedback.',
        icon: <Bot className="w-7 h-7" />,
        iconGrad: 'from-orange-500 to-amber-400',
        glow: 'rgba(249,115,22,0.4)',
        features: ['24/7 AI Tutor (Nova)', 'Voice Conversations', 'Instant Feedback'],
        tooltip: "Hi! I'm Nova. Ask me anything and I'll explain it simply!",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP: Step 1 — Input
// ─────────────────────────────────────────────────────────────────────────────
const topics = ['Quantum Computing', 'Machine Learning', 'World History', 'React Hooks'];

const MockupInput = ({ active, onAction }) => {
    const [typed, setTyped] = useState('');
    const [ti, setTi] = useState(0);
    const charRef = useRef(0);

    useEffect(() => {
        if (active) return;
        charRef.current = 0;
        setTyped('');
        const topic = topics[ti];
        const iv = setInterval(() => {
            charRef.current++;
            setTyped(topic.slice(0, charRef.current));
            if (charRef.current >= topic.length) {
                clearInterval(iv);
                setTimeout(() => setTi(i => (i + 1) % topics.length), 1600);
            }
        }, 55);
        return () => clearInterval(iv);
    }, [ti, active]);

    return (
        <div className="h-full flex items-center justify-center p-5">
            <div className="w-full max-w-xs">
                <div className="bg-[#07071a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                    {/* Chrome */}
                    <div className="flex items-center gap-1.5 px-4 h-10 border-b border-white/5 bg-white/[0.015]">
                        {['bg-red-500/50', 'bg-yellow-500/50', 'bg-green-500/50'].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                        <span className="flex-1 text-center text-[9px] font-black uppercase tracking-widest text-white/10">courseforge.ai</span>
                    </div>
                    <div className="p-5 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">What do you want to learn?</p>
                        {/* Input */}
                        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                            <Search className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                            <span className="text-sm text-white/70 flex-1 min-h-[1.2rem] leading-none">
                                {active
                                    ? <span className="text-violet-300 animate-pulse">Building your course...</span>
                                    : <>{typed || <span className="text-white/20">Type a topic...</span>}<span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" /></>
                                }
                            </span>
                        </div>
                        {/* Upload cards */}
                        <div className="grid grid-cols-2 gap-2">
                            {[['📄', 'Upload PDF'], ['🎥', 'YouTube Link']].map(([ic, lb]) => (
                                <div key={lb} className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex items-center gap-1.5 text-white/25 text-[10px] font-bold cursor-default hover:bg-white/[0.06] transition-colors">
                                    <span>{ic}</span>{lb}
                                </div>
                            ))}
                        </div>
                        {/* Build button */}
                        <button onClick={onAction} disabled={active}
                            className={cn("w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                                active ? "bg-violet-700/40 text-white cursor-wait" : "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_45px_rgba(124,58,237,0.6)] hover:scale-[1.02]"
                            )}>
                            {active ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Building...</> : <><Sparkles className="w-3.5 h-3.5" />Build My Course</>}
                        </button>
                    </div>
                </div>
                {/* Floating stat chips */}
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="mt-4 flex justify-center gap-2">
                    {['PDF ✓', 'YouTube ✓', '100+ Topics'].map(t => (
                        <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-wider text-white/30">{t}</span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP: Step 2 — AI Building
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
    { name: 'Course Planner', emoji: '🗂️', grad: 'from-blue-600 to-cyan-500' },
    { name: 'Lesson Writer', emoji: '✍️', grad: 'from-violet-600 to-purple-500' },
    { name: 'Image Designer', emoji: '🎨', grad: 'from-pink-500 to-rose-500' },
    { name: 'Quality Check', emoji: '✅', grad: 'from-emerald-500 to-teal-500' },
];

const BUILD_LOGS = [
    'Reading your topic...',
    'Planning course structure...',
    'Writing lesson content...',
    'Generating visuals...',
    'Running quality review...',
    'Course ready! ✨',
];

const MockupBuild = ({ active }) => {
    const [progress, setProgress] = useState(10);
    const [log, setLog] = useState(['Initializing AI agents...']);
    const logRef = useRef(null);
    const logIdx = useRef(0);

    useEffect(() => {
        if (!active) { setProgress(5); setLog(['Initializing AI agents...']); logIdx.current = 0; return; }
        const iv = setInterval(() => {
            setProgress(p => {
                const next = Math.min(p + Math.random() * 10 + 2, 100);
                const threshold = Math.floor(next / 15);
                if (threshold > logIdx.current && logIdx.current < BUILD_LOGS.length) {
                    setLog(prev => [...prev.slice(-4), BUILD_LOGS[logIdx.current]]);
                    logIdx.current++;
                }
                return next;
            });
        }, 280);
        return () => clearInterval(iv);
    }, [active]);

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

    return (
        <div className="h-full flex items-center justify-center p-5">
            <div className="w-full max-w-xs space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                    {AGENTS.map((ag, i) => (
                        <motion.div key={ag.name}
                            animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.45 }}
                            transition={{ duration: 1.8, repeat: active ? Infinity : 0, delay: i * 0.35 }}
                            className="bg-[#07071a] border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2.5">
                            <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shadow-lg", ag.grad)}>
                                {ag.emoji}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/40 text-center">{ag.name}</span>
                            {active && (
                                <motion.div animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.35 }}
                                    className={cn("h-0.5 w-full rounded-full bg-gradient-to-r origin-left", ag.grad)} />
                            )}
                        </motion.div>
                    ))}
                </div>
                {/* Progress panel */}
                <div className="bg-[#07071a] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Overall Progress</span>
                        <span className="text-[9px] font-black text-cyan-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                            animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.3 }} />
                    </div>
                    <div ref={logRef} className="space-y-1 max-h-14 overflow-auto text-[9px] font-mono text-cyan-300/50">
                        {log.map((l, i) => (
                            <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}>
                                <span className="text-cyan-500/40">{'>'}</span> {l}
                            </motion.p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP: Step 3 — Course Plan
// ─────────────────────────────────────────────────────────────────────────────
const MODULES = [
    { title: 'Introduction', type: 'Lesson', done: true, active: false },
    { title: 'Core Concepts', type: 'Lesson', done: true, active: false },
    { title: 'Hands-on Practice', type: 'Project', done: false, active: true },
    { title: 'Final Quiz', type: 'Quiz', done: false, active: false },
];

const MockupPlan = () => (
    <div className="h-full flex items-center justify-center p-5">
        <div className="w-full max-w-xs bg-[#07071a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/25">Your Course</p>
                    <h4 className="text-sm font-black tracking-tight mt-0.5">Quantum Computing</h4>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Active</span>
                </div>
            </div>
            <div className="px-4 py-3 border-b border-white/5 space-y-1.5">
                <div className="flex justify-between text-[9px] text-white/25 font-bold">
                    <span>2 of 4 complete</span><span>50%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
            </div>
            <div className="p-3 space-y-1.5">
                {MODULES.map((m, i) => (
                    <motion.div key={m.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                            m.active ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-white/[0.025]")}>
                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shrink-0",
                            m.done ? "bg-emerald-500/20 text-emerald-400" : m.active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" : "bg-white/5 text-white/20")}>
                            {m.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-white/75 truncate">{m.title}</p>
                            <p className="text-[8px] text-white/20 uppercase tracking-widest">{m.type}</p>
                        </div>
                        {m.active && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MOCKUP: Step 4 — AI Tutor
// ─────────────────────────────────────────────────────────────────────────────
const CHAT_SCRIPT = [
    { role: 'ai', text: "Hi! I'm Nova 👋 What would you like to know about Quantum Computing?" },
    { role: 'user', text: "What is superposition in simple words?" },
    { role: 'ai', text: "Think of a coin spinning in the air — it's heads AND tails at the same time. That's superposition! A qubit can be 0 and 1 simultaneously until you measure it. 🪙" },
];

const MockupTutor = () => {
    const [msgs, setMsgs] = useState([]);
    const [typing, setTyping] = useState(false);
    const timerRef = useRef([]);
    const endRef = useRef(null);

    useEffect(() => {
        setMsgs([]); setTyping(false);
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
        let delay = 400;
        CHAT_SCRIPT.forEach((msg, i) => {
            timerRef.current.push(setTimeout(() => setTyping(true), delay));
            delay += msg.role === 'ai' ? 900 : 600;
            timerRef.current.push(setTimeout(() => { setMsgs(p => [...p, msg]); setTyping(false); }, delay));
            delay += 1200;
        });
        return () => timerRef.current.forEach(clearTimeout);
    }, []);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

    return (
        <div className="h-full flex items-center justify-center p-5">
            <div className="w-full max-w-xs bg-[#07071a] border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ height: 340 }}>
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center relative">
                        <Bot className="w-4 h-4 text-white" />
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#07071a]" />
                    </div>
                    <div>
                        <p className="text-xs font-black tracking-tight">Nova AI Tutor</p>
                        <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Online</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <Mic className="w-3.5 h-3.5 text-orange-400/60" />
                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Voice</span>
                    </div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    <AnimatePresence>
                        {msgs.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                className={cn("flex gap-1.5", m.role === 'user' ? "flex-row-reverse" : "")}>
                                <div className={cn("max-w-[88%] px-3 py-2 rounded-xl text-[11px] leading-relaxed",
                                    m.role === 'ai'
                                        ? "bg-white/5 border border-white/10 text-white/65 rounded-tl-none"
                                        : "bg-orange-500/15 border border-orange-500/25 text-white/80 rounded-tr-none")}>
                                    {m.text}
                                </div>
                            </motion.div>
                        ))}
                        {typing && (
                            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1.5">
                                <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-none px-3 py-2.5 flex gap-1 items-center">
                                    {[0, 0.18, 0.36].map(d => (
                                        <motion.div key={d} animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                                            transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                                            className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={endRef} />
                </div>
                {/* Input bar shimmer */}
                <div className="px-3 pb-3">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2 text-white/20 text-[11px]">
                        <Mic className="w-3.5 h-3.5 text-orange-400/40" />
                        <span>Ask Nova anything...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
const StepNav = ({ current, onSelect }) => (
    <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
                <button onClick={() => onSelect(i)} className="group flex items-center gap-2.5">
                    <div className={cn(
                        "relative w-9 h-9 rounded-[14px] border flex items-center justify-center transition-all duration-500 text-xs font-black",
                        i < current ? "bg-primary/20 border-primary/40 text-primary" :
                            i === current ? "bg-white text-black border-transparent shadow-[0_0_25px_rgba(255,255,255,0.25)] scale-110" :
                                "bg-white/[0.03] border-white/10 text-white/20 group-hover:border-white/20"
                    )}>
                        {i < current ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <AnimatePresence>
                        {i === current && (
                            <motion.span key="label" initial={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                                animate={{ opacity: 1, maxWidth: 80, marginLeft: 2 }}
                                exit={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-white overflow-hidden whitespace-nowrap">
                                {['Upload', 'Building', 'Plan', 'Tutor'][i]}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
                {i < STEPS.length - 1 && (
                    <div className="relative h-px w-10">
                        <div className="absolute inset-0 bg-white/10 rounded" />
                        {i < current && (
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-primary to-accent origin-left rounded" />
                        )}
                    </div>
                )}
            </React.Fragment>
        ))}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ACTION BUTTONS — fixed, premium
// ─────────────────────────────────────────────────────────────────────────────
const ActionButtons = ({ step, isBuilding, onNext, onPrev, onBuild }) => {
    const isLast = step === STEPS.length - 1;
    const isFirst = step === 0;

    return (
        <div className="flex items-center gap-4">
            {/* Back */}
            {!isFirst && (
                <motion.button onClick={onPrev} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:bg-white/[0.07] hover:border-white/20 transition-all text-[11px] font-black uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
            )}

            {/* Primary CTA */}
            {isLast ? (
                <Link to="/analyzer">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="relative flex items-center gap-3 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 text-white font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_rgba(124,58,237,0.7)] border border-white/20 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Play className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Start Learning Free</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </Link>
            ) : (
                <motion.button
                    onClick={isFirst ? onBuild : onNext}
                    disabled={isBuilding}
                    whileHover={{ scale: isBuilding ? 1 : 1.04 }}
                    whileTap={{ scale: isBuilding ? 1 : 0.97 }}
                    className={cn(
                        "relative flex items-center gap-3 px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest border overflow-hidden group transition-all",
                        isBuilding
                            ? "bg-violet-700/40 border-violet-500/30 text-white/60 cursor-wait"
                            : "bg-gradient-to-r from-violet-600 to-indigo-500 border-white/20 text-white shadow-[0_0_35px_rgba(124,58,237,0.45)] hover:shadow-[0_0_55px_rgba(124,58,237,0.65)]"
                    )}>
                    {!isBuilding && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
                    {isBuilding
                        ? <><RefreshCw className="w-4 h-4 animate-spin relative z-10" /><span className="relative z-10">Building...</span></>
                        : <><span className="relative z-10">Next Step</span><ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" /></>
                    }
                </motion.button>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM DOT CONTROLS
// ─────────────────────────────────────────────────────────────────────────────
const BottomControls = ({ step, onSelect, autoPlay, onToggleAutoPlay }) => (
    <div className="flex items-center justify-center gap-5 py-5">
        {/* Autoplay pill */}
        <motion.button onClick={onToggleAutoPlay} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.25em] transition-all",
                autoPlay ? "bg-primary/15 border-primary/40 text-primary" : "bg-white/[0.02] border-white/10 text-white/25 hover:text-white/50 hover:border-white/20")}>
            <motion.div animate={autoPlay ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}
                className={cn("w-1.5 h-1.5 rounded-full", autoPlay ? "bg-primary" : "bg-white/20")} />
            {autoPlay ? 'Auto Playing' : 'Auto Play'}
        </motion.button>

        {/* Step dots */}
        <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
                <button key={i} onClick={() => onSelect(i)}
                    className={cn("rounded-full transition-all duration-300",
                        i === step ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/15 hover:bg-white/35")} />
            ))}
        </div>

        {/* Step counter */}
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            {step + 1} / {STEPS.length}
        </span>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const DemoTourPage = () => {
    const [step, setStep] = useState(0);
    const [isBuilding, setBuilding] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const current = STEPS[step];

    // Show tooltip after entering a step
    useEffect(() => {
        setBuilding(false);
        setShowTip(false);
        const t = setTimeout(() => setShowTip(true), 2400);
        return () => clearTimeout(t);
    }, [step]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return;
        const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 6500);
        return () => clearInterval(t);
    }, [autoPlay]);

    const handleBuild = () => {
        if (isBuilding) return;
        setBuilding(true);
        setTimeout(() => {
            setBuilding(false);
            if (step < STEPS.length - 1) setStep(s => s + 1);
        }, 2500);
    };

    const goNext = () => { if (step < STEPS.length - 1) setStep(s => s + 1); };
    const goPrev = () => { if (step > 0) setStep(s => s - 1); };

    return (
        <div className="h-screen bg-[#050511] text-white flex flex-col overflow-hidden font-display">
            <Navbar />
            <AmbientBG stepColor={step} />
            <CursorSpotlight />

            <main className="flex-1 flex flex-col overflow-hidden pt-20 relative z-10">

                {/* ── Top Progress Navigation ── */}
                <div className="pt-5 pb-2 px-6 flex justify-center">
                    <StepNav current={step} onSelect={setStep} />
                </div>

                {/* ── Two-Column Layout ── */}
                <div className="flex-1 container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center px-6 overflow-hidden">

                    {/* LEFT: Text */}
                    <AnimatePresence mode="wait">
                        <motion.div key={step + '-left'}
                            initial={{ opacity: 0, x: -50, filter: 'blur(18px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col">

                            {/* Icon + Tooltip */}
                            <div className="relative mb-7 w-fit">
                                <Tooltip text={current.tooltip} visible={showTip} />
                                <motion.div
                                    animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                    className={cn(
                                        "w-20 h-20 rounded-[2rem] bg-gradient-to-br flex items-center justify-center relative overflow-hidden border border-white/20",
                                        current.iconGrad
                                    )}
                                    style={{ boxShadow: `0 0 60px ${current.glow}, 0 0 120px ${current.glow}44` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/25" />
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.08),transparent)]" />
                                    <div className="relative z-10 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">{current.icon}</div>
                                    <Sparkles className="absolute top-2 right-2 w-3.5 h-3.5 text-white/60 animate-pulse" />
                                </motion.div>
                            </div>

                            {/* Eyebrow */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px w-6 bg-primary/60" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.45em]">{current.eyebrow}</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] font-black tracking-tighter leading-[0.88] mb-5 whitespace-pre-line">
                                {current.title}
                            </h1>

                            {/* Description */}
                            <p className="text-base text-white/40 leading-relaxed max-w-md mb-7">
                                {current.desc}
                            </p>

                            {/* Feature chips */}
                            <div className="flex flex-wrap gap-2 mb-10">
                                {current.features.map(f => (
                                    <span key={f} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <Zap className="w-3 h-3 text-primary/70" /> {f}
                                    </span>
                                ))}
                            </div>

                            {/* ✅ ACTION BUTTONS */}
                            <ActionButtons
                                step={step} isBuilding={isBuilding}
                                onNext={goNext} onPrev={goPrev} onBuild={handleBuild}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* RIGHT: Mockup */}
                    <AnimatePresence mode="wait">
                        <motion.div key={step + '-right'}
                            initial={{ opacity: 0, scale: 0.88, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.65, type: 'spring', bounce: 0.3 }}
                            className="relative">
                            {/* Glow halo */}
                            <div className={cn("absolute inset-0 rounded-[3rem] blur-[60px] opacity-25 bg-gradient-to-br scale-90 -z-10", current.iconGrad)} />

                            {/* Window frame */}
                            <div className="relative bg-[#0A0A1E]/70 border border-white/[0.07] rounded-[2.5rem] backdrop-blur-3xl overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.65)] h-[420px] lg:h-[490px]">
                                {/* Step color overlay */}
                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.05]", current.iconGrad)} />

                                {/* Title bar */}
                                <div className="h-11 border-b border-white/[0.05] flex items-center justify-between px-5 bg-white/[0.015]">
                                    <div className="flex gap-1.5">
                                        {['bg-red-500/40', 'bg-yellow-500/40', 'bg-green-500/40'].map(c => <div key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
                                    </div>
                                    <div className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full text-[9px] font-black uppercase tracking-widest text-white/20">
                                        Step {step + 1} of {STEPS.length}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/15">Live</span>
                                    </div>
                                </div>

                                {/* Mockup content */}
                                <div className="h-[calc(100%-2.75rem)]">
                                    {step === 0 && <MockupInput active={isBuilding} onAction={handleBuild} />}
                                    {step === 1 && <MockupBuild active />}
                                    {step === 2 && <MockupPlan />}
                                    {step === 3 && <MockupTutor />}
                                </div>

                                {/* Scanner beam while building */}
                                {isBuilding && (
                                    <motion.div initial={{ top: 0 }} animate={{ top: '100%' }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-violet-400 to-transparent blur-[1px] z-50" />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>{/* end grid */}

                {/* ── Bottom Controls ── */}
                <BottomControls
                    step={step}
                    onSelect={setStep}
                    autoPlay={autoPlay}
                    onToggleAutoPlay={() => setAutoPlay(a => !a)}
                />
            </main>
        </div>
    );
};

export default DemoTourPage;
