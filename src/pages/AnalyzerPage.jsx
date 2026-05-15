import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BrainCircuit, Sparkles, Terminal, Rocket, ChevronRight, Activity, Scan, CheckCircle2, ShieldCheck, PenTool, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import InputMethods from '../components/analyzer/InputMethods';
import AgentStatusCard from '../components/analyzer/AgentStatusCard';
import { useCourse } from '../lib/CourseContext';
import { courseAPI } from '../lib/api';
import { cn } from '../lib/utils';

const AGENTS = [
    { id: 'architect', name: 'Course Planner' },
    { id: 'scribe', name: 'Lesson Writer' },
    { id: 'illustrator', name: 'Image Designer' },
    { id: 'warden', name: 'Reviewer' }
];

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { id: 'input', label: 'Start', icon: <Scan className="w-3 h-3" /> },
        { id: 'forging', label: 'AI Building', icon: <BrainCircuit className="w-3 h-3" /> },
        { id: 'ready', label: 'Done', icon: <CheckCircle2 className="w-3 h-3" /> }
    ];

    return (
        <div className="z-[100] px-6 py-3 bg-white/[0.03] border border-white/10 rounded-full flex items-center gap-2 mb-12">
            {steps.map((step, i) => (
                <React.Fragment key={step.id}>
                    <div className="flex items-center gap-3 relative">
                        <motion.div
                            className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-700 relative",
                                currentStep === step.id
                                    ? "bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.6)]"
                                    : steps.findIndex(s => s.id === currentStep) > i
                                        ? "bg-emerald-500 text-white"
                                        : "bg-white/5 text-white/20 border border-white/10"
                            )}
                        >
                            {steps.findIndex(s => s.id === currentStep) > i ? <CheckCircle2 className="w-3 h-3" /> : step.icon}
                            {currentStep === step.id && (
                                <motion.div
                                    layoutId="step-glow"
                                    className="absolute inset-0 rounded-full bg-primary/40 blur-md -z-10"
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </motion.div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap",
                            currentStep === step.id ? "text-white opacity-100 translate-y-0" : "text-white/20 opacity-40"
                        )}>
                            {step.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className="w-6 h-[1px] bg-white/10 mx-2" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const NeuralBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 neural-grid opacity-30" />
        <div className="scanline-overlay" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute inset-0 bg-black/40" />
    </div>
);

import { useUIStore } from '../lib/uiStore';

const AnalyzerPage = () => {
    const navigate = useNavigate();
    const { commitCourse } = useCourse();
    const { addNotification } = useUIStore();
    const [phase, setPhase] = useState('input');
    const [level, setLevel] = useState('starter');
    const [activeTab, setActiveTab] = useState('search');
    const [currentTopic, setCurrentTopic] = useState('');
    const [logs, setLogs] = useState([]);
    const [agentStatuses, setAgentStatuses] = useState({
        architect: 'idle', scribe: 'idle', illustrator: 'idle', warden: 'idle'
    });
    const [timeLeft, setTimeLeft] = useState(30);
    const [generatedCourse, setGeneratedCourse] = useState(null);
    const [isDegraded, setIsDegraded] = useState(false);
    const [retryCooldown, setRetryCooldown] = useState(0);
    const [isForging, setIsForging] = useState(false);
    const logEndRef = useRef(null);

    useEffect(() => {
        if (retryCooldown > 0) {
            const timer = setTimeout(() => setRetryCooldown(retryCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [retryCooldown]);

    // Auto-jump to course player after 5 seconds when ready
    useEffect(() => {
        let jumpTimer;
        if (phase === 'ready' && generatedCourse) {
            jumpTimer = setTimeout(() => {
                navigate(`/player/${generatedCourse.id}`);
            }, 5000);
        }
        return () => clearTimeout(jumpTimer);
    }, [phase, generatedCourse, navigate]);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    useEffect(() => {
        if (phase === 'forging') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [phase]);

    const startForging = async (payload) => {
        if (!payload || !payload.value || retryCooldown > 0 || isForging) return;

        // AUTH CHECK
        if (!localStorage.getItem('courseforge_token')) {
            addNotification({
                title: 'Authentication Required',
                message: 'Please login to forge custom knowledge paths.',
                type: 'warning'
            });
            navigate('/login?redirect=/analyzer');
            return;
        }

        setIsForging(true);
        const { type, value } = payload;
        setCurrentTopic(type === 'file' ? value.name : value);
        
        setLogs([]);
        setIsDegraded(false);
        setAgentStatuses({ architect: 'idle', scribe: 'idle', illustrator: 'idle', warden: 'idle' });
        setTimeLeft(90);

        // ... delay phase switch slightly to show button loading? 
        // Or just switch phase immediately and the button text update was for the "input" side.
        setPhase('forging');

        // Global Notification: Start
        addNotification({
            title: 'Neural Forge Initialized',
            message: `Synthesizing knowledge path for: ${type === 'file' ? value.name : value}`,
            type: 'info',
            toastId: 'forge-status'
        });

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 1 ? prev - 1 : 1));
        }, 1000);

        const timeStr = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

        try {
            setAgentStatuses(prev => ({ ...prev, architect: 'working' }));
            setLogs([{ text: `START: Initializing ${type.toUpperCase()} Analysis Protocol...`, time: timeStr(), type: 'info' }]);

            let course;
            if (type === 'text') {
                course = await courseAPI.generate(value, level);
            } else if (type === 'file') {
                setLogs(prev => [...prev, { text: 'INGESTION: Extracting neural pathways from PDF...', time: timeStr(), type: 'info' }]);
                course = await courseAPI.generateFromFile(value, level);
            } else if (type === 'url') {
                setLogs(prev => [...prev, { text: 'SCRAPING: Synching with remote data source...', time: timeStr(), type: 'info' }]);
                course = await courseAPI.generateFromUrl(value, level);
            }

            if (course && course.status === 'degraded') {
                setIsDegraded(true);
                setLogs(prev => [...prev, { text: `HEAVY_LOAD: ${course.message}`, time: timeStr(), type: 'error' }]);
                addNotification({
                    title: 'Safe-Mode Deployment',
                    message: 'AI engines at capacity. Foundational schema delivered.',
                    type: 'warning',
                    toastId: 'forge-status'
                });
            }

            setAgentStatuses(prev => ({ ...prev, architect: 'complete', scribe: 'working' }));
            setLogs(prev => [...prev,
                { text: isDegraded ? 'PLANNER: Using static node templates.' : 'PLANNER: Neural curriculum blueprint forged.', time: timeStr(), type: 'success' },
                { text: 'SYNTHESIS: Generating deep-dive content for all topics...', time: timeStr(), type: 'info' }
            ]);

            // ... Simulated steps
            await new Promise(r => setTimeout(r, 800));
            setAgentStatuses(prev => ({ ...prev, scribe: 'complete', illustrator: 'working' }));
            await new Promise(r => setTimeout(r, 800));
            setAgentStatuses(prev => ({ ...prev, illustrator: 'complete', warden: 'working' }));
            await new Promise(r => setTimeout(r, 800));
            setAgentStatuses(prev => ({ ...prev, warden: 'complete' }));

            setLogs(prev => [...prev, { text: 'READY: Neural path established.', time: timeStr(), type: 'success' }]);

            addNotification({
                title: 'Synthesis Complete',
                message: `Subject "${currentTopic || 'Course'}" is now available for indexing.`,
                type: 'success',
                toastId: 'forge-status'
            });

            setTimeout(() => {
                setGeneratedCourse(course);
                commitCourse(course);
                setIsForging(false);
                setPhase('ready');
                clearInterval(timer);
            }, 800);

        } catch (error) {
            clearInterval(timer);
            const isQuota = error.message?.includes('Quota');
            const logMsg = isQuota ? "High demand detected. Forging paused... Switching to backup AI model..." : `CRITICAL_FAILURE: ${error.message}`;
            setLogs(prev => [...prev, { text: logMsg, time: timeStr(), type: 'error' }]);
            
            addNotification({
                title: 'Forge Error',
                message: error.message || 'The neural link was interrupted.',
                type: 'error',
                toastId: 'forge-status'
            });

            setAgentStatuses(prev => ({ 
                architect: 'error', scribe: 'error', illustrator: 'error', warden: 'error' 
            }));
            setIsForging(false);
            setTimeout(() => setPhase('input'), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col font-display selection:bg-primary/30 relative overflow-hidden">
            {phase === 'input' && <Navbar />}

            {/* Degraded Warning Banner */}
            <AnimatePresence>
                {isDegraded && phase === 'ready' && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-primary/20 border-b border-primary/30 px-6 py-3 text-center backdrop-blur-md relative z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <Activity className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">
                                Forge Alert: AI Engines at Capacity. Safe-Mode Course Structure Generated.
                            </span>
                            <button 
                                onClick={() => {
                                    setPhase('input');
                                    setIsDegraded(false);
                                }}
                                className="px-4 py-1 rounded bg-primary text-white text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                            >
                                Try Full Forge Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NeuralBackground />

            <main className={cn(
                "flex-1 container mx-auto px-6 relative z-10 flex flex-col items-center",
                phase === 'input' ? "pt-32 pb-20 justify-start min-h-screen" : "justify-center h-screen overflow-hidden"
            )}>
                {phase !== 'ready' && <StepIndicator currentStep={phase} />}
                <AnimatePresence mode="wait">
                    {phase === 'input' && (
                        <motion.div
                            key="input-lab"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30, filter: 'blur(20px)' }}
                            className="w-full max-w-4xl"
                        >
                            <div className="text-center mb-16">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
                                >
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Build Your Course</span>
                                </motion.div>
                                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[0.9]">
                                    What shall we <br /><span className="text-gradient">build today?</span>
                                </h1>
                                <p className="text-white/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                                    Upload a PDF or enter a topic. Our AI Helpers will build a custom course just for you.
                                </p>
                            </div>

                            <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-12 backdrop-blur-md shadow-2xl relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                                <InputMethods
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    level={level}
                                    setLevel={setLevel}
                                    onForge={startForging}
                                    isLoading={isForging}
                                />
                            </div>
                        </motion.div>
                    )}

                    {phase === 'forging' && (
                        <motion.div
                            key="forging-sequence"
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative"
                        >
                            {/* Neural Scan Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-[3rem]">
                                <motion.div
                                    className="absolute inset-x-0 h-[2px] bg-primary/40 shadow-[0_0_20px_rgba(124,58,237,0.8)]"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay animate-pulse" />
                            </div>

                            <div className="lg:col-span-5 space-y-6">
                                <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden group">
                                    <motion.div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-end mb-1">
                                                <h2 className="text-2xl font-black tracking-tighter">AI Working</h2>
                                                <span className="text-primary font-mono text-sm leading-none mb-1">{timeLeft}s remaining</span>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 truncate">
                                                {agentStatuses.warden === 'working' ? 'Finalizing synapses...' : 
                                                 agentStatuses.illustrator === 'working' ? 'Generating visual context...' :
                                                 agentStatuses.scribe === 'working' ? 'Synthesizing knowledge nodes...' :
                                                 'Architecting curriculum structure...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-accent"
                                            initial={{ width: '0%' }}
                                            animate={{ width: agentStatuses.warden === 'complete' ? '100%' : '85%' }}
                                            transition={{ duration: 30, ease: "linear" }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {AGENTS.map((agent) => (
                                        <AgentStatusCard
                                            key={agent.id}
                                            agent={agent}
                                            status={agentStatuses[agent.id]}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-7 h-[min(580px,65vh)] bg-white/[0.01] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative backdrop-blur-xl group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-30" />
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                                        </div>
                                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                        <div className="flex items-center gap-2">
                                            <Terminal className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Learning_Log.v2</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                            <span className="text-[10px] font-bold text-primary tabular-nums tracking-widest uppercase">Safe & Private</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 font-mono text-sm overflow-y-auto space-y-4 custom-scrollbar selection:bg-primary/50">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-6 leading-relaxed group/log"
                                        >
                                            <span className="text-[10px] font-black text-white/10 whitespace-nowrap mt-1 tracking-tighter">[{log.time}]</span>
                                            <span className={cn(
                                                "text-sm font-medium",
                                                log.type === 'success' ? 'text-emerald-400' :
                                                    log.type === 'info' ? 'text-primary' : 'text-white/60'
                                            )}>
                                                <span className="mr-2 opacity-30 select-none">{'>'}</span>
                                                {log.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                    <div className="flex gap-6">
                                        <span className="text-[10px] text-transparent">[00:00:00]</span>
                                        <span className="text-primary animate-pulse font-black text-lg -mt-1">_</span>
                                    </div>
                                    <div ref={logEndRef} />
                                </div>
                                <div className="p-4 bg-white/[0.01] border-t border-white/5 text-[10px] font-black tracking-widest text-white/10 uppercase flex justify-between">
                                    <span>AI Version: forge-0.5.0</span>
                                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> Systems Ready</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'ready' && (
                        <motion.div
                            key="ready-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex flex-col items-center justify-center pointer-events-auto"
                        >
                            {/* Cinematic Background Elements */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.4] }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                                className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center"
                            >
                                <div className="relative mb-8 flex justify-center">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-32 h-32 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center"
                                    >
                                        <div className="w-28 h-28 rounded-full border border-primary/20 flex items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-[0_0_80px_rgba(124,58,237,0.6)]"
                                            >
                                                <Rocket className="w-12 h-12 text-white drop-shadow-2xl" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Success Particles */}
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-white rounded-full"
                                            initial={{ x: 0, y: 0, opacity: 0 }}
                                            animate={{
                                                x: Math.cos(i * 30 * Math.PI / 180) * 200,
                                                y: Math.sin(i * 30 * Math.PI / 180) * 200,
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{ duration: 2, delay: 0.5 + (i * 0.1), repeat: Infinity }}
                                        />
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                            {isDegraded ? 'Course Schema Resolved' : 'Mastery Synthesized Successfully'}
                                        </span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-none">
                                        {isDegraded ? 'Course Structure Ready' : <>Course <span className="text-gradient">Ready.</span></>}
                                    </h2>
                                    <p className="text-white/40 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
                                        {isDegraded 
                                            ? "AI servers are currently at capacity. We've forged a robust static pathway for you. Retry later for AI-enhanced deep-synthesis."
                                            : "Your custom course has been created. Click below to start learning."}
                                    </p>
                                </motion.div>

                                <div className="flex flex-col sm:flex-row gap-8 justify-center w-full max-w-2xl px-6">
                                    <button
                                        onClick={() => {
                                            if (generatedCourse) {
                                                navigate(`/player/${generatedCourse.id}`);
                                            } else {
                                                const topicLabel = currentTopic || "Quantum Computing";
                                                const mockCourse = {
                                                    id: 'temp-' + Date.now(),
                                                    title: `${topicLabel}: First Principles`,
                                                    level: level,
                                                    modules: [
                                                        { id: 'm1', title: `Fundamentals of ${topicLabel}`, type: 'theory', completed: false },
                                                        { id: 'm2', title: `${topicLabel} Core Concepts`, type: 'video', completed: false },
                                                        { id: 'm3', title: `Advanced ${topicLabel} Forge`, type: 'interactive', completed: false },
                                                        { id: 'm4', title: 'System Synthesis', type: 'theory', completed: false },
                                                    ]
                                                };
                                                commitCourse(mockCourse);
                                                navigate(`/player/${mockCourse.id}`);
                                            }
                                        }}
                                        className="flex-1 px-10 py-7 bg-white text-black font-black rounded-[2rem] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] active:scale-95 group relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute inset-x-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                                            animate={{ x: ['-200%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        />
                                        <span className="relative z-10 text-xl tracking-tight flex items-center gap-4">
                                            Start Lesson
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>

                                    <button
                                        disabled={retryCooldown > 0}
                                        onClick={() => {
                                            if (retryCooldown === 0) {
                                                setRetryCooldown(5);
                                                setPhase('input');
                                                setIsDegraded(false);
                                            }
                                        }}
                                        className={cn(
                                            "px-10 py-7 bg-white/[0.03] border border-white/10 text-white/40 font-black rounded-[2rem] hover:bg-white/10 hover:text-white transition-all text-sm uppercase tracking-[0.2em] backdrop-blur-md relative overflow-hidden",
                                            retryCooldown > 0 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {retryCooldown > 0 ? `Wait ${retryCooldown}s` : 'Retry Full Forge'}
                                    </button>
                                </div>

                                {!isDegraded && (
                                    <motion.div
                                        className="mt-12 flex items-center gap-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2 }}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                                                <motion.div
                                                    className="bg-primary h-full"
                                                    animate={{ width: ['0%', '100%'] }}
                                                    transition={{ duration: 5, ease: "linear" }}
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest animate-pulse">Auto-jump in 5s</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AnalyzerPage;

