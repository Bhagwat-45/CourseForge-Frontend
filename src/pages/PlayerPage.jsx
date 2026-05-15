import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    BookOpen,
    CheckCircle2,
    PlayCircle,
    MessageSquare,
    Settings,
    Layout,
    ArrowRight,
    Sparkles,
    Menu,
    X,
    Cpu,
    ChevronRight, // Added
    Clock, // Added
    Award, // Added
    Star, // Added
    Search, // Added
    Play, // Added
    Book, // Added
    BrainCircuit,
    Plus,
    FlaskConical,
    Mic2
} from 'lucide-react';
import { useCourse } from '../lib/CourseContext';
import { cn } from '../lib/utils';
import Navbar from '../components/layout/Navbar';
import ContentStage from '../components/player/ContentStage';
import NovaChat from '../components/player/NovaChat';
import QuizOverlay from '../components/player/QuizOverlay';
import FlashcardModal from '../components/player/FlashcardModal';
import MentorSidebar from '../components/player/MentorSidebar';
import ForgeCastPlayer from '../components/player/ForgeCastPlayer';
import DiscussionPanel from '../components/player/DiscussionPanel';
import FocusMode from '../components/player/FocusMode';
import { courseAPI } from '../lib/api';
import GlassCard from '../components/ui/GlassCard';

const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        courses,
        selectCourse,
        currentCourse, 
        activeModuleIndex, 
        activeTopicIndex, 
        updateProgress, 
        fetchTopicContent,
        completeTopic,
        submitQuiz
    } = useCourse();

    useEffect(() => {
        const loadCourseFromUri = async () => {
            if (id && (!currentCourse || String(currentCourse.id) !== String(id))) {
                const foundCourse = courses?.find(c => String(c.id) === String(id));
                if (foundCourse) {
                    selectCourse(foundCourse);
                } else {
                    try {
                        const fetchedCourse = await courseAPI.getCourse(id);
                        if (fetchedCourse) {
                            selectCourse(fetchedCourse);
                        }
                    } catch (err) {
                        console.error('Failed to load course directly:', err);
                    }
                }
            }
        };
        loadCourseFromUri();
    }, [id, currentCourse, courses, selectCourse]);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNovaOpen, setIsNovaOpen] = useState(true);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
    const [isMentorOpen, setIsMentorOpen] = useState(false);
    const [isPodcastOpen, setIsPodcastOpen] = useState(false);
    const [topicLoadError, setTopicLoadError] = useState(null);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [difficulty, setDifficulty] = useState('auto');
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});

    // Auto-expand active module
    useEffect(() => {
        if (activeModuleIndex !== undefined) {
            setExpandedModules(prev => ({ ...prev, [activeModuleIndex]: true }));
        }
    }, [activeModuleIndex]);

    const toggleModule = (idx) => {
        setExpandedModules(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    // Body scroll lock for drawers
    useEffect(() => {
        if ((isSidebarOpen || isNovaOpen) && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isSidebarOpen, isNovaOpen]);

    // Responsive: only auto-close sidebar on small screens, keep open on large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
                setIsNovaOpen(false);
            } else {
                setIsSidebarOpen(true);
                setIsNovaOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll content to top on topic change
    useEffect(() => {
        const container = document.getElementById('content-scroll-container');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeModuleIndex, activeTopicIndex]);

    const modules = currentCourse?.modules?.map(m => ({ ...m, topics: m.topics || m.lessons || [] })) || [];
    const activeModule = modules[activeModuleIndex] || { topics: [] };
    const activeTopic = activeModule.topics?.[activeTopicIndex];

    useEffect(() => {
        if (activeTopic && activeTopic.generation_status !== 'ready' && !isLoading) {
            const loadContent = async () => {
                setIsLoading(true);
                try {
                    setTopicLoadError(null);
                    await fetchTopicContent(activeTopic.id, difficulty === 'auto');
                } catch (err) {
                    const isQuota = err.message?.includes('Quota') || err.message?.includes('429');
                    setTopicLoadError(isQuota ? "High demand detected. Re-routing neural pathways... Please wait a few moments before trying again." : `Failed to load lesson: ${err.message}`);
                } finally {
                    setIsLoading(false);
                }
            };
            loadContent();
        }
    }, [activeTopic?.id, activeTopic?.generation_status, fetchTopicContent, difficulty]);

    // Real-time updates via WebSockets with Polling Fallback
    useEffect(() => {
        let ws;
        let pollInterval;
        let reconnectTimeout;
        let retryCount = 0;

        const connectWS = () => {
            if (!activeTopic?.id || activeTopic?.generation_status !== 'generating') return;

            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // Assuming the backend is on the same host or localhost:8000
            const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
            const wsUrl = `${protocol}//${host}/ws/topics/${activeTopic.id}`;
            
            console.log(`[WS] Connecting to ${wsUrl}...`);
            ws = new WebSocket(wsUrl);

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("[WS] Received update:", data);
                if (data.status === 'ready' || data.status === 'failed') {
                    fetchTopicContent(activeTopic.id, difficulty === 'auto').catch(() => {});
                    if (ws) ws.close();
                }
            };

            ws.onopen = () => {
                console.log("[WS] Connection established");
                retryCount = 0;
                if (pollInterval) {
                    clearInterval(pollInterval);
                    pollInterval = null;
                }
            };

            ws.onclose = () => {
                console.log("[WS] Connection closed");
                // Attempt reconnect with backoff
                if (activeTopic?.generation_status === 'generating' && retryCount < 5) {
                    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
                    reconnectTimeout = setTimeout(connectWS, delay);
                    retryCount++;
                } else if (activeTopic?.generation_status === 'generating') {
                    // Fallback to polling if WS repeatedly fails
                    if (!pollInterval) {
                        console.log("[WS] Falling back to polling...");
                        pollInterval = setInterval(() => {
                            fetchTopicContent(activeTopic.id, difficulty === 'auto').catch(() => {});
                        }, 5000);
                    }
                }
            };

            ws.onerror = (err) => {
                console.error("[WS] Error:", err);
            };
        };

        if (activeTopic?.generation_status === 'generating') {
            connectWS();
        }

        return () => {
            if (ws) ws.close();
            if (pollInterval) clearInterval(pollInterval);
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
        };
    }, [activeTopic?.id, activeTopic?.generation_status, fetchTopicContent, difficulty]);

    if (!currentCourse) return <div className="h-screen flex items-center justify-center">Loading Course...</div>;

    return (
        <div className="h-[100dvh] bg-[#050511] text-white flex flex-col font-display overflow-hidden relative">
            {/* Mobile Sidebar Overlays (TASK 3) */}
            <AnimatePresence>
                {(isSidebarOpen || isNovaOpen) && window.innerWidth < 1024 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setIsNovaOpen(false);
                        }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]"
                    />
                )}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="hidden sm:block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1 md:mx-0" />
                    <div className="max-w-[150px] md:max-w-none">
                        <h1 className="text-xs md:text-sm font-black tracking-tight uppercase truncate">{currentCourse.title}</h1>
                        <p className="text-[8px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest truncate">{activeTopic?.title || 'Synthesizing...'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <button 
                        onClick={() => setIsPodcastOpen(true)}
                        className="px-2 md:px-3 py-1.5 bg-primary/20 border border-primary/20 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                    >
                        <Mic2 className="w-3 h-3" />
                        <span className="hidden xs:inline text-[9px]">ForgeCast</span>
                    </button>
                    
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050511] bg-primary/20 flex items-center justify-center overflow-hidden">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Council</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Sidebar: Course Navigation (Mobile Drawer mode) */}
                <motion.aside
                    initial={false}
                    animate={{ 
                        width: isSidebarOpen ? (window.innerWidth < 1024 ? '100dvw' : 320) : 0, 
                        opacity: isSidebarOpen ? 1 : 0,
                        x: isSidebarOpen ? 0 : -320
                    }}
                    className={cn(
                        "border-r border-white/5 bg-white/[0.01] flex flex-col overflow-hidden z-[50] backdrop-blur-3xl",
                        window.innerWidth < 1024 ? "fixed inset-y-0 left-0 pt-16 h-full shadow-2xl" : "relative"
                    )}
                >
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 font-mono">Curriculum_Map.v2</h3>
                            {window.innerWidth < 1024 && (
                                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-white/40">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {modules.map((mod, mIdx) => (
                                <div key={mod.id || `mod-${mIdx}`} className="space-y-1">
                                    <button 
                                        onClick={() => toggleModule(mIdx)}
                                        className="w-full px-2 py-3 flex items-center justify-between group/mod"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/30 group-hover/mod:text-white transition-colors">
                                                {mIdx + 1}
                                            </div>
                                            <h4 className={cn(
                                                "text-[11px] font-black uppercase tracking-wider transition-colors",
                                                expandedModules[mIdx] ? "text-white" : "text-white/40 group-hover/mod:text-white/60"
                                            )}>
                                                {mod.title}
                                            </h4>
                                        </div>
                                        <ChevronRight className={cn(
                                            "w-3 h-3 text-white/20 transition-transform duration-300",
                                            expandedModules[mIdx] && "rotate-90 text-primary"
                                        )} />
                                    </button>
                                    
                                    <AnimatePresence initial={false}>
                                        {expandedModules[mIdx] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden space-y-1"
                                            >
                                                {(mod.topics || []).map((topic, tIdx) => (
                                                    <button
                                                        key={topic.id || `topic-${mIdx}-${tIdx}`}
                                                        onClick={() => {
                                                            updateProgress(mIdx, tIdx);
                                                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all group ml-2",
                                                            activeModuleIndex === mIdx && activeTopicIndex === tIdx
                                                                ? "bg-primary/20 border border-primary/20 text-white"
                                                                : "hover:bg-white/5 text-white/30 border border-transparent"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-black relative overflow-hidden",
                                                            topic.completed ? "bg-emerald-500/20 text-emerald-400" :
                                                                (activeModuleIndex === mIdx && activeTopicIndex === tIdx) ? "bg-primary text-white" : "bg-white/5"
                                                        )}>
                                                            {topic.generation_status === 'generating' && (
                                                                <motion.div 
                                                                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                                    className="absolute inset-0 bg-primary/40"
                                                                />
                                                            )}
                                                            {topic.completed ? <CheckCircle2 className="w-3 h-3" /> : (
                                                                topic.generation_status === 'generating' ? <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> : tIdx + 1
                                                            )}
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] font-bold text-left leading-tight",
                                                            topic.generation_status === 'generating' && "text-white/60 animate-pulse"
                                                        )}>{topic.title}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content Stage */}
                <main className="flex-1 flex flex-col relative overflow-hidden bg-black/20">
                    <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />

                    <div id="content-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                        <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-full flex flex-col">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeModuleIndex}-${activeTopicIndex}`}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="flex-1 flex flex-col"
                                >
                                    {isLoading ? (
                                        <div className="space-y-12">
                                            <div className="space-y-6">
                                                <div className="w-1/2 h-8 skeleton" />
                                                <div className="w-full h-4 skeleton" />
                                            </div>
                                            <div className="w-full aspect-video skeleton rounded-[2rem] opacity-40" />
                                        </div>
                                    ) : topicLoadError ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                                                <BrainCircuit className="w-8 h-8 text-red-400 animate-pulse" />
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-black mb-3">Connection Interrupted</h3>
                                            <p className="text-white/40 max-w-sm font-mono text-xs md:text-sm mb-8">{topicLoadError}</p>
                                            <button 
                                                onClick={() => {
                                                    setTopicLoadError(null);
                                                    setIsLoading(true);
                                                    fetchTopicContent(activeTopic.id, difficulty === 'auto')
                                                        .catch(err => setTopicLoadError(`Synthesis failed: ${err.message}`))
                                                        .finally(() => setIsLoading(false));
                                                }}
                                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Retry Synthesis
                                            </button>
                                        </div>
                                     ) : (
                                        <>
                                            <div className="mb-8 md:mb-12 text-left">
                                                <div className="flex items-center gap-3 mb-4 md:mb-6">
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary">
                                                        M{activeModuleIndex + 1} T{activeTopicIndex + 1}
                                                    </span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>
                                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 tracking-tighter leading-tight">{activeTopic?.title}</h2>
                                            </div>

                                            <ContentStage 
                                                activeTopic={activeTopic} 
                                                onStartQuiz={() => setIsQuizOpen(true)}
                                                difficulty={difficulty}
                                                setDifficulty={setDifficulty}
                                            />
                                            
                                            {activeTopic?.id && (
                                                <div className="mt-16 pt-8 border-t border-white/5">
                                                    <DiscussionPanel topicId={activeTopic.id} className="h-[400px] md:h-[600px] border-none bg-transparent" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Floating Layout Controls (TASK 4) */}
                    <div className="fixed md:absolute bottom-6 md:bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-[#050511]/80 border border-white/10 rounded-full p-1.5 shadow-2xl backdrop-blur-xl scale-90 md:scale-100">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={cn(
                                "p-2.5 rounded-full transition-all",
                                isSidebarOpen ? "bg-white/10 text-white" : "text-white/30 hover:text-white"
                            )}
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-white/10" />
                        <button 
                            onClick={() => setIsFocusMode(true)}
                            className="p-2.5 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            <Layout className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-white/10" />
                        <button
                            onClick={() => setIsNovaOpen(!isNovaOpen)}
                            className={cn(
                                "p-2.5 rounded-full transition-all",
                                isNovaOpen ? "bg-primary/20 text-primary" : "text-white/30 hover:text-white"
                            )}
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Module Navigation Footer */}
                    <div className="p-4 md:p-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-between">
                        <button
                            onClick={() => {
                                if (activeTopicIndex > 0) {
                                    updateProgress(activeModuleIndex, activeTopicIndex - 1);
                                } else if (activeModuleIndex > 0) {
                                    const prevMod = currentCourse.modules[activeModuleIndex - 1];
                                    updateProgress(activeModuleIndex - 1, prevMod.topics.length - 1);
                                }
                            }}
                            disabled={activeModuleIndex === 0 && activeTopicIndex === 0}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-20"
                        >
                            <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
                        </button>
                        
                        <div className="flex gap-2 mx-4">
                            <button 
                                onClick={() => setIsMentorOpen(true)}
                                className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-2 hover:bg-primary transition-all group"
                            >
                                <MessageSquare className="w-4 h-4 text-primary group-hover:text-white" />
                                <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-widest text-white">Mentor</span>
                            </button>
                        </div>

                        <button
                            onClick={async () => {
                                if (activeTopic && !activeTopic.completed) {
                                    setIsCompleting(true);
                                    try {
                                        await completeTopic(activeTopic.id);
                                    } finally {
                                        setIsCompleting(false);
                                    }
                                }
                                if (activeTopicIndex < (activeModule.topics || []).length - 1) {
                                    updateProgress(activeModuleIndex, activeTopicIndex + 1);
                                } else if (activeModuleIndex < modules.length - 1) {
                                    updateProgress(activeModuleIndex + 1, 0);
                                }
                            }}
                            disabled={isCompleting || (activeModuleIndex === modules.length - 1 && activeTopicIndex === (activeModule.topics || []).length - 1)}
                            className="px-4 md:px-6 py-2.5 md:py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-widest disabled:opacity-20"
                        >
                            <span className="hidden sm:inline">{isCompleting ? 'Processing...' : 'Continue'}</span> 
                            {isCompleting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles className="w-4 h-4" /></motion.div> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </main>

                {/* Right Sidebar: Nova AI Tutor (Mobile Drawer mode) */}
                <motion.aside
                    initial={false}
                    animate={{ 
                        width: isNovaOpen ? (window.innerWidth < 1024 ? '100dvw' : 400) : 0, 
                        opacity: isNovaOpen ? 1 : 0,
                        x: isNovaOpen ? 0 : 400
                    }}
                    className={cn(
                        "border-l border-white/5 bg-white/[0.01] flex flex-col overflow-hidden z-[50] backdrop-blur-3xl",
                        window.innerWidth < 1024 ? "fixed inset-y-0 right-0 pt-16 h-full shadow-2xl" : "relative"
                    )}
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black tracking-tight uppercase">Nova AI</h3>
                            </div>
                        </div>
                        <button onClick={() => setIsNovaOpen(false)} className="lg:hidden p-2 text-white/40">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <NovaChat className="flex-1" />
                </motion.aside>
            </div>

            {/* Global Overlays */}
            <FlashcardModal 
                isOpen={isFlashcardsOpen} 
                onClose={() => setIsFlashcardsOpen(false)} 
                topic={activeTopic}
                courseId={currentCourse?.id}
            />
            <MentorSidebar isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} courseId={currentCourse?.id} topicId={activeTopic?.id} />
            <ForgeCastPlayer isOpen={isPodcastOpen} onClose={() => setIsPodcastOpen(false)} courseId={currentCourse.id} courseTitle={currentCourse.title} />
            {isQuizOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsQuizOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />
                    <QuizOverlay 
                        quizzes={activeTopic?.quizzes || []}
                        onClose={() => setIsQuizOpen(false)}
                        onComplete={(score) => {
                            submitQuiz(activeTopic.id, score);
                            setIsQuizOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PlayerPage;
