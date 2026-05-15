import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight, BrainCircuit, CheckCircle2, Sparkles, Target,
    Layers, Zap, Star, Bot, Mic, FileText, Play, BookOpen,
    BarChart2, Shield, Rocket, ChevronRight,
    Twitter, Github, Youtube, Mail, X, ChevronDown
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import HeroCarousel from '../components/ui/HeroCarousel';
import { useCourse } from '../lib/CourseContext';

// ─── Ambient Background ────────────────────────────────────────────────────────
const BG = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[30%] -left-[15%] w-[80%] h-[80%] bg-violet-700/14 rounded-full blur-[250px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[30%] -right-[15%] w-[75%] h-[75%] bg-blue-700/10 rounded-full blur-[250px]" />
        <motion.div animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[40%] left-[35%] w-[40%] h-[40%] bg-cyan-700/7 rounded-full blur-[200px]" />
    </div>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ badge, title, highlight, sub }) => (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center">
        <div className="inline-flex items-center gap-2 badge-premium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>{badge}</span>
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.88] mb-5">
            {title} {highlight && <span className="text-gradient">{highlight}</span>}
        </h2>
        {sub && <p className="text-white/40 text-lg max-w-2xl leading-relaxed font-medium mx-auto">{sub}</p>}
    </motion.div>
);

// ─── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, badge, accentColor, delay = 0, size = 'normal' }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
        className={size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}>
        <div className="h-full group relative overflow-hidden glass rounded-[2rem] p-8 card-hover flex flex-col border border-white/[0.06] hover:border-white/[0.12]">
            <div className={`absolute -top-10 -right-10 w-48 h-48 ${accentColor} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
            <div className="relative z-10 flex flex-col h-full">
                {badge && (
                    <span className="self-start mb-5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                        {badge}
                    </span>
                )}
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h3 className={`font-black tracking-tight leading-tight mb-3 ${size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{title}</h3>
                <p className="text-white/35 leading-relaxed text-sm flex-1">{desc}</p>
            </div>
        </div>
    </motion.div>
);

// ─── Step ─────────────────────────────────────────────────────────────────────
const Step = ({ num, icon, title, desc, delay, color }) => (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center text-center group">
        <div className="relative mb-6">
            <div className={`absolute inset-0 ${color} rounded-[1.5rem] blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} />
            <div className="relative w-16 h-16 rounded-[1.5rem] bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${color} text-[8px] font-black flex items-center justify-center text-white`}>{num}</span>
                {icon}
            </div>
        </div>
        <h3 className="text-lg font-black tracking-tight mb-2">{title}</h3>
        <p className="text-white/35 text-sm leading-relaxed max-w-[200px]">{desc}</p>
    </motion.div>
);



// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const LandingPage = () => {
    const [faqOpen, setFaqOpen] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useCourse();

    const handleStartClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/analyzer');
        } else {
            setShowPopup(true);
        }
    };

    const faqs = [
        { q: "Is CourseForge really free?", a: "Yes! Every user gets 5 course generations every month for free, access to the Nova AI Tutor, and interactive quizzes. No subscription required." },
        { q: "How does the monthly limit work?", a: "You can generate up to 5 courses every 30 days. Your limit automatically resets every month based on your sign-up date." },
        { q: "Can I download my courses?", a: "Absolutely! All users can download their course modules as structured notes or continue learning within the platform." },
        { q: "What makes Nova AI Tutor special?", a: "Nova isn't just a chatbot; it has full context of your specific course. It can explain difficult sections, help you solve lab exercises, and adjust its teaching style from 'Beginner' to 'Expert' based on your needs." },
        { q: "How fast is the course generation?", a: "Most courses are ready in under 60 seconds. Our multi-agent AI works in parallel to structure the syllabus, write deep-dive lessons, and generate assessment quizzes based on your documents or topics." },
    ];

    return (
        <div className="min-h-screen bg-[#030309] text-white overflow-x-hidden font-display">
            <Navbar />
            <BG />

            <AnimatePresence>
                {showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                            onClick={() => setShowPopup(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative glass-elite rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl z-10 overflow-hidden border border-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/5" />
                            <div className="relative text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <Rocket className="w-8 h-8 text-violet-400" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">Save Your Progress</h3>
                                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                                    Create a free account to save your generated courses, unlock Nova Tutor, and track your learning.
                                </p>
                                
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => {
                                            setShowPopup(false);
                                            navigate('/register');
                                        }}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all"
                                    >
                                        Sign Up Now
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowPopup(false);
                                            navigate('/analyzer');
                                        }}
                                        className="w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black uppercase text-xs tracking-widest transition-all"
                                    >
                                        Skip & Explore First
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════
                HERO
            ═══════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-6 z-10" id="home">
                <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left — Text */}
                    <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

                        {/* Status badge */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 backdrop-blur-xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50">Now Available · Free to Start</span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-[clamp(3.8rem,9vw,7.5rem)] font-black tracking-tighter leading-[0.82] mb-7">
                            Build AI<br />
                            Courses{' '}
                            <span className="text-gradient">Instantly</span>
                        </h1>

                        <p className="text-xl text-white/40 leading-relaxed max-w-lg mb-10 font-medium">
                            Turn any topic, PDF, or YouTube video into a structured, personalized learning experience — powered by multi-agent AI.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/analyzer" onClick={handleStartClick}>
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="relative flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%] animate-text-shimmer" />
                                    <div className="absolute inset-0 border border-white/20 rounded-2xl" />
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                                    <Rocket className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Start for Free</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link to="/demo">
                                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white/65 font-black text-sm uppercase tracking-widest hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all">
                                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Play className="w-3 h-3 ml-0.5" />
                                    </div>
                                    Watch Demo
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right — Hero Visual */}
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }} className="relative">
                        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-cyan-600/10 blur-3xl" />
                        <div className="relative glass-elite rounded-[2.5rem] overflow-hidden p-8">
                            {/* Title bar */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-1.5">
                                    {['bg-red-500/50', 'bg-yellow-500/50', 'bg-green-500/50'].map(c => (
                                        <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/25">AI Generating…</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-violet-400/60">Live</span>
                            </div>
                            {/* Course cards */}
                            <HeroCarousel />
                            {/* Bottom CTA */}
                            <div className="mt-6 pt-5 border-t border-white/[0.05]">
                                <Link to="/analyzer" onClick={handleStartClick} className="flex items-center justify-between group/btn">
                                    <div>
                                        <p className="text-[9px] text-white/25 font-black uppercase tracking-widest mb-1">Ready?</p>
                                        <p className="text-sm font-black tracking-tight">Build Your Course Now →</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all">
                                        <BrainCircuit className="w-5 h-5 text-white" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                        {/* Floating badges */}
                        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -right-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-4 py-2.5 backdrop-blur-xl shadow-lg">
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">✓ Course Ready</p>
                            <p className="text-xs font-black mt-0.5">in 45 seconds</p>
                        </motion.div>
                        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute -bottom-4 -left-4 bg-violet-500/10 border border-violet-500/25 rounded-2xl px-4 py-2.5 backdrop-blur-xl shadow-lg">
                            <p className="text-[9px] font-black uppercase tracking-widest text-violet-400">🤖 Nova AI</p>
                            <p className="text-xs font-black mt-0.5">Always Online</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll hint */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/12">Scroll</span>
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown className="w-4 h-4 text-white/12" />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════
                FEATURES
            ═══════════════════════════════════ */}
            <section className="relative z-10 py-28 px-6" id="features">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-16">
                        <SectionHeader
                            badge="What You Get"
                            title="Everything You Need to"
                            highlight="Learn Smarter"
                            sub="AI-powered tools that turn your curiosity into mastery — in any subject, at any level."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
                        <FeatureCard size="large" delay={0} accentColor="bg-violet-600"
                            icon={<Target className="w-7 h-7 text-violet-400" />}
                            title="Personal Course Designer"
                            badge="Core Feature"
                            desc="Upload any PDF, image, or YouTube link — or just type a topic. Our AI breaks it into a logical, chapter-by-chapter roadmap tailored to your level (Beginner · Intermediate · Advanced)." />
                        <FeatureCard size="normal" delay={0.1} accentColor="bg-fuchsia-600"
                            icon={<Bot className="w-7 h-7 text-fuchsia-400" />}
                            title="Nova AI Tutor"
                            desc="Your 24/7 personal teacher. Nova answers questions, gives deep explanations, and adapts to your pace — in voice or text." />
                        <FeatureCard size="normal" delay={0.2} accentColor="bg-sky-600"
                            icon={<Mic className="w-7 h-7 text-sky-400" />}
                            title="Voice Conversations"
                            desc="Talk to your AI tutor naturally. Ask questions out loud and get spoken explanations — like a real study session." />
                        <FeatureCard size="normal" delay={0.15} accentColor="bg-emerald-600"
                            icon={<BarChart2 className="w-7 h-7 text-emerald-400" />}
                            title="Smart Progress Tracking"
                            desc="Visual dashboards show what you've learned, what's next, and where to focus — learning made transparent." />
                        <FeatureCard size="normal" delay={0.25} accentColor="bg-amber-600"
                            icon={<FileText className="w-7 h-7 text-amber-400" />}
                            title="Auto-Generated Quizzes"
                            desc="Every lesson comes with smart MCQs and short-answer quizzes with instant scores and weak-topic detection." />
                        <FeatureCard size="normal" delay={0.3} accentColor="bg-rose-600"
                            icon={<Layers className="w-7 h-7 text-rose-400" />}
                            title="PDF Notes & Certificates"
                            desc="Download printable study notes and completion certificates for every course you finish." />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════════ */}
            <section className="relative z-10 py-28 px-6 bg-white/[0.01] border-y border-white/[0.04]">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-16">
                        <SectionHeader badge="How It Works" title="Three Steps to" highlight="Your Course"
                            sub="From idea to full structured learning journey — in under a minute." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <Step num="1" color="bg-violet-600" icon={<BookOpen className="w-7 h-7 text-violet-400" />} title="Upload or Type" desc="Add a PDF, paste a link, or describe what you want to learn." delay={0} />
                        <Step num="2" color="bg-blue-600" icon={<BrainCircuit className="w-7 h-7 text-sky-400" />} title="AI Builds It" desc="Four AI agents plan, write, design, and review your course in seconds." delay={0.1} />
                        <Step num="3" color="bg-emerald-600" icon={<Rocket className="w-7 h-7 text-emerald-400" />} title="Start Learning" desc="Open your course, chat with Nova, take quizzes, and track progress." delay={0.2} />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mt-14">
                        <Link to="/demo">
                            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-300 font-black text-sm uppercase tracking-widest hover:bg-violet-500/20 hover:border-violet-500/50 transition-all">
                                <Play className="w-4 h-4" /> See Live Demo <ChevronRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>



            {/* ═══════════════════════════════════
                FAQ
            ═══════════════════════════════════ */}
            <section className="relative z-10 py-28 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="mb-14">
                        <SectionHeader badge="FAQ" title="Common" highlight="Questions"
                            sub="Everything you need to know before you start." />
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="glass border border-white/[0.06] rounded-2xl overflow-hidden">
                                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left group">
                                    <span className="font-bold text-sm text-white/80 group-hover:text-white transition-colors">{faq.q}</span>
                                    <motion.div animate={{ rotate: faqOpen === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                                        <X className={`w-4 h-4 shrink-0 ml-4 rotate-45 transition-colors ${faqOpen === i ? 'text-violet-400' : 'text-white/20'}`} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {faqOpen === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                                            <p className="px-6 pb-5 text-sm text-white/40 leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                CTA BANNER
            ═══════════════════════════════════ */}
            <section className="relative z-10 py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="relative rounded-[3rem] p-14 text-center overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-[#030309]">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,transparent_70%)]" />
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            className="absolute -top-20 -right-20 w-80 h-80 border border-violet-500/10 rounded-full" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                            className="absolute -bottom-20 -left-20 w-80 h-80 border border-indigo-500/8 rounded-full" />
                        <div className="relative z-10">
                            <div className="badge-premium mx-auto mb-6"><Sparkles className="w-3 h-3" /> Start Today — It's Free</div>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-5">
                                Your Next Course Is<br /><span className="text-gradient">One Click Away</span>
                            </h2>
                            <p className="text-white/35 text-lg max-w-lg mx-auto mb-10">
                                Join learners worldwide turning ideas into structured AI-powered learning journeys.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link to="/analyzer" onClick={handleStartClick}>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-3 px-12 py-5 rounded-2xl bg-white text-black font-black text-base uppercase tracking-widest shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_70px_rgba(255,255,255,0.3)] transition-all">
                                        <Rocket className="w-5 h-5" /> Build My Course
                                    </motion.button>
                                </Link>
                                <Link to="/demo">
                                    <button className="flex items-center gap-2 px-8 py-5 rounded-2xl border border-white/10 text-white/55 font-black text-sm uppercase tracking-widest hover:text-white hover:border-white/25 transition-all">
                                        Watch Demo <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════
                FOOTER
            ═══════════════════════════════════ */}
            <footer className="relative z-10 border-t border-white/[0.05]">
                <div className="container mx-auto max-w-7xl px-6 pt-16 pb-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-14">
                        {/* Brand */}
                        <div className="col-span-2">
                            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl blur-sm opacity-50" />
                                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20">
                                        <BrainCircuit className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-base font-black tracking-tight text-white">CourseForge</span>
                                    <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-white/25 mt-0.5">AI Learning Platform</span>
                                </div>
                            </Link>
                            <p className="text-white/28 text-sm leading-relaxed mb-6 max-w-xs">
                                Making learning easy, personal, and powerful — with the help of AI. Built for curious minds everywhere.
                            </p>
                            <div className="flex gap-2.5">
                                {[
                                    [Twitter, 'Twitter', 'https://twitter.com'],
                                    [Github, 'GitHub', 'https://github.com'],
                                    [Youtube, 'YouTube', 'https://youtube.com']
                                ].map(([Icon, label, url], i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" title={label}
                                        className="w-9 h-9 rounded-xl glass border border-white/[0.07] flex items-center justify-center text-white/25 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all">
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                        {/* Link columns */}
                        {[
                            { head: 'Product', links: [
                                { label: 'Course Generator', to: '/analyzer' },
                                { label: 'Nova AI Tutor', to: '/demo' },
                                { label: 'Progress Tracker', to: '/dashboard' },
                                { label: 'Exam Engine', to: '/dashboard/exams' }
                            ]},
                            { head: 'Resources', links: [
                                { label: 'Documentation', to: '/demo' },
                                { label: 'Blog', to: '/' },
                                { label: 'Community', to: '/' },
                                { label: 'Changelog', to: '/' }
                            ]},
                            { head: 'Company', links: [
                                { label: 'About Us', to: '/' },
                                { label: 'Careers', to: '/' },
                                { label: 'Privacy Policy', to: '/' },
                                { label: 'Terms of Service', to: '/' }
                            ]},
                        ].map(col => (
                            <div key={col.head}>
                                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-violet-400 mb-5">{col.head}</p>
                                <ul className="space-y-3">
                                    {col.links.map(l => (
                                        <li key={l.label}><Link to={l.to} className="text-sm text-white/25 hover:text-white/65 transition-colors font-medium">{l.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div className="glass border border-white/[0.06] rounded-2xl p-7 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-violet-400" />
                                <h4 className="font-black tracking-tight text-base">Stay in the loop</h4>
                            </div>
                            <p className="text-white/28 text-sm">New AI features, study tips, and updates — delivered weekly.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <input type="email" placeholder="your@email.com" className="flex-1 md:w-60 input-premium text-sm" />
                            <button 
                                onClick={(e) => {
                                    const input = e.target.closest('.flex').querySelector('input');
                                    if (input && input.value.trim()) {
                                        input.value = '';
                                        e.target.textContent = '✓ Subscribed!';
                                        e.target.classList.add('opacity-60');
                                        setTimeout(() => {
                                            e.target.textContent = 'Subscribe';
                                            e.target.classList.remove('opacity-60');
                                        }, 2000);
                                    }
                                }}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-black text-sm uppercase tracking-wider text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.04]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/15">
                            © 2026 CourseForge · Built with ❤️ for learners everywhere
                        </p>
                        <div className="flex items-center gap-6">
                            {[
                                { label: 'Privacy', to: '/' },
                                { label: 'Terms', to: '/' },
                                { label: 'Cookies', to: '/' }
                            ].map(l => (
                                <Link key={l.label} to={l.to} className="text-[9px] font-black uppercase tracking-widest text-white/15 hover:text-white/40 transition-colors">{l.label}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
