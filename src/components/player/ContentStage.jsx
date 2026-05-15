import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Zap, Sparkles, Award, Lightbulb, CheckCircle2, FlaskConical, Youtube, RefreshCcw, BrainCircuit, Target, AlertTriangle, PlayCircle, Clock } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import LabWorkshop from './LabWorkshop';
import CodePlayground from './CodePlayground';

// Lazy-load Mermaid to keep it out of the initial bundle (~450KB)
import MermaidRenderer from './MermaidRenderer';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import VideoPlayerModal from './VideoPlayerModal';


const ContentStage = ({ activeTopic, onStartQuiz, difficulty, setDifficulty }) => {
    const { regenerateTopicContent } = useCourse();
    const [mode, setMode] = useState('theory'); // 'theory' or 'workshop'
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);


    const handleRegenerate = async () => {
        if (!activeTopic) return;
        setIsRegenerating(true);
        try {
            await regenerateTopicContent(activeTopic.id, difficulty === 'auto');
        } catch (error) {
            console.error("Regeneration failed:", error);
        } finally {
            setIsRegenerating(false);
        }
    };

    if (!activeTopic || activeTopic.generation_status === 'generating') return (
        <div className="flex flex-col items-center justify-center p-20 py-32 text-center space-y-8">
             <div className="relative group">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                 <div className="relative w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center border border-white/10">
                    <BrainCircuit className="w-10 h-10 text-primary animate-[pulse_1.5s_ease-in-out_infinite]" />
                 </div>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural Synthesis in Progress</p>
                <h3 className="text-2xl md:text-3xl font-black text-white max-w-sm mx-auto tracking-tight">Forging Intelligence for "{activeTopic?.title}"</h3>
                <p className="text-xs md:text-sm text-white/30 max-w-xs mx-auto leading-relaxed">Nova is deep-indexing the curriculum to provide high-fidelity insights. This usually takes 30-60 seconds.</p>
             </div>
             <div className="flex gap-1.5 justify-center">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
             </div>
        </div>
    );

    const contentKey = difficulty === 'auto' ? 'intermediate_content' : `${difficulty}_content`;
    const textContent = activeTopic.concept_explanation || activeTopic[contentKey] || activeTopic.beginner_content || 'Content not available for this level.';

    return (
        <div className="space-y-12 pb-24">
            {/* Mode & Difficulty Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                    {[
                        { id: 'theory', label: 'Theory', icon: <Book className="w-3.5 h-3.5" /> },
                        { id: 'workshop', label: 'Workshop', icon: <FlaskConical className="w-3.5 h-3.5" /> }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                mode === m.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/30 hover:text-white/60"
                            )}
                        >
                            {m.icon}
                            {m.label}
                        </button>
                    ))}
                </div>

                {mode === 'theory' && (
                    <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
                        {['auto', 'beginner', 'intermediate', 'expert'].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setDifficulty(lvl)}
                                className={cn(
                                    "relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    difficulty === lvl ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white/60"
                                )}
                            >
                                {lvl === 'auto' && (
                                    <Sparkles className={cn("absolute -top-1 -right-1 w-3 h-3 text-emerald-400 drop-shadow-md", difficulty === 'auto' && "animate-pulse")} />
                                )}
                                {lvl}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {mode === 'theory' ? (
                    <motion.div
                        key="theory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Learning Objectives */}
                        {activeTopic.learning_objectives?.length > 0 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 mb-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
                                <div className="flex items-center gap-3 text-primary mb-6 relative z-10">
                                    <Target className="w-6 h-6" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Learning Objectives</h4>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                    {activeTopic.learning_objectives.map((obj, i) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary shrink-0">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            <span className="text-white/80 leading-relaxed text-sm">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Core Content: Explanation */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden mb-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                            
                            <div className="prose prose-invert max-w-none relative z-10">
                                {textContent && textContent.length > 50 ? (
                                    <div className="text-lg md:text-xl leading-relaxed font-light text-white/90 selection:bg-primary/30">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                p: ({ children }) => <p className="mb-8 last:mb-0">{children}</p>,
                                                h1: ({ children }) => <h1 className="text-3xl font-black mb-6 mt-12 text-gradient">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-2xl font-black mb-4 mt-10 text-white">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-xl font-bold mb-4 mt-8 text-white/90">{children}</h3>,
                                                ul: ({ children }) => <ul className="space-y-3 mb-8 list-none">{children}</ul>,
                                                ol: ({ children }) => <ol className="space-y-3 mb-8 list-decimal pl-6">{children}</ol>,
                                                li: ({ children }) => (
                                                    <li className="flex gap-3">
                                                        <span className="text-primary mt-1.5">•</span>
                                                        <span>{children}</span>
                                                    </li>
                                                ),
                                                code: ({ node, inline, className, children, ...props }) => {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline ? (
                                                        <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                                            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{match ? match[1] : 'code'}</span>
                                                                <div className="flex gap-1.5">
                                                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                                                </div>
                                                            </div>
                                                            <code className={cn("block p-6 text-sm font-mono overflow-x-auto", className)} {...props}>
                                                                {children}
                                                            </code>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary font-bold text-[0.9em]" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-primary bg-primary/5 p-6 rounded-r-2xl my-8 italic text-white/70">
                                                        {children}
                                                    </blockquote>
                                                )
                                            }}
                                        >
                                            {textContent}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                                        <div className="relative w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group">
                                            {isRegenerating ? <RefreshCcw className="w-10 h-10 text-primary animate-spin" /> : <BrainCircuit className="w-10 h-10 text-white/20" />}
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-white">Neural Gap Detected</h3>
                                            <p className="text-sm text-white/40 max-w-sm mx-auto">This lesson's synthesis is incomplete. Bridge the gap with a manual forge.</p>
                                        </div>
                                        <button disabled={isRegenerating} onClick={handleRegenerate} className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
                                            Forge Intelligence
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subtopics */}
                        {activeTopic.subtopics?.length > 0 && (
                            <div className="space-y-12 mb-12">
                                {activeTopic.subtopics.map((sub, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                                        <h3 className="text-2xl font-black text-white mb-6">{sub.title}</h3>
                                        <div className="prose prose-invert max-w-none text-white/80">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                                                {sub.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Misconceptions */}
                        {activeTopic.misconceptions?.length > 0 && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 mb-12">
                                <div className="flex items-center gap-3 text-red-500 mb-8">
                                    <AlertTriangle className="w-6 h-6" />
                                    <h4 className="text-sm font-black uppercase tracking-widest">Common Misconceptions</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeTopic.misconceptions.map((misc, i) => (
                                        <div key={i} className="bg-white/[0.03] rounded-2xl p-6 border border-red-500/10">
                                            <p className="text-red-400 font-bold mb-2 line-through text-sm">Myth: {misc.myth}</p>
                                            <p className="text-emerald-400 font-bold mb-4 text-sm">Reality: {misc.reality}</p>
                                            <p className="text-white/60 text-sm leading-relaxed">{misc.why}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Worked Examples */}
                        {activeTopic.worked_examples?.length > 0 && (
                            <div className="mb-12 space-y-8">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Worked Examples</h4>
                                </div>
                                {activeTopic.worked_examples.map((ex, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden">
                                        <div className="bg-white/5 px-8 py-4 border-b border-white/10">
                                            <h5 className="font-bold text-white">{ex.title}</h5>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Problem</p>
                                                <p className="text-white/90">{ex.problem}</p>
                                            </div>
                                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                                                <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Step-by-step Solution</p>
                                                <div className="prose prose-invert max-w-none text-white/80">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                                                        {ex.solution}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Why this works</p>
                                                <p className="text-white/70 italic">{ex.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Interactive Code Blueprints */}
                        {(activeTopic.code_examples?.length > 0 || (activeTopic.code && activeTopic.code.length > 0)) && (
                            <div className="space-y-8 mb-12">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Interactive Blueprints</h4>
                                </div>
                                {activeTopic.code_examples?.length > 0 ? (
                                    activeTopic.code_examples.map((snippet, idx) => (
                                        <div key={idx} className="space-y-4">
                                            <CodePlayground 
                                                initialCode={snippet.code.trim()} 
                                                initialLanguage={snippet.language || "python"}
                                                title={snippet.title} 
                                            />
                                            {snippet.explanation && (
                                                <p className="text-sm text-white/60 px-4">{snippet.explanation}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    activeTopic.code.map((snippet, idx) => (
                                        <CodePlayground 
                                            key={idx} 
                                            initialCode={snippet.trim()} 
                                            initialLanguage="python"
                                            title={`Snippet ${idx + 1}`} 
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Examples & Analogies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {(activeTopic.practical_applications?.length > 0 || (activeTopic.examples && activeTopic.examples.length > 0)) && (
                                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Lightbulb className="w-5 h-5" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Practical Applications</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {(activeTopic.practical_applications?.length > 0 ? activeTopic.practical_applications : activeTopic.examples).map((ex, i) => (
                                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-colors">
                                                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-[10px] font-black text-primary">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm font-medium text-white/70 leading-relaxed">{ex}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(activeTopic.key_takeaways?.length > 0 || (activeTopic.takeaways && activeTopic.takeaways.length > 0)) && (
                                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-400">
                                        <Award className="w-5 h-5" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Core Takeaways</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {(activeTopic.key_takeaways?.length > 0 ? activeTopic.key_takeaways : activeTopic.takeaways).map((tk, i) => (
                                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <p className="text-sm font-bold text-white/80 italic">"{tk}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Suggested Images */}
                        {activeTopic.images && activeTopic.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {activeTopic.images.map((img, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group bg-white/5"
                                    >
                                        <img 
                                            src={img.url || `https://picsum.photos/seed/${encodeURIComponent(img.alt || 'code')}/800/450`}
                                            alt={img.alt}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Visual context</p>
                                            <p className="text-xs font-bold text-white leading-tight">{img.alt}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Diagrams Section (lazy-loaded) */}
                        {activeTopic.diagrams && activeTopic.diagrams.length > 0 && (
                            <Suspense fallback={<div className="p-8 text-center text-white/20 text-sm animate-pulse">Loading diagrams...</div>}>
                                <div className="space-y-6 mb-12">
                                    {activeTopic.diagrams.map((diagram, idx) => (
                                        <MermaidRenderer key={idx} code={diagram.code} title={diagram.title} />
                                    ))}
                                </div>
                            </Suspense>
                        )}

                        {/* YouTube Integration */}
                        {(activeTopic.video_resources?.length > 0 || activeTopic.youtube_params) && (
                            <div className="mb-12 space-y-8">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Curated Video Context</h4>
                                </div>
                                
                                {activeTopic.video_resources?.filter(v => v.video_id && v.video_id !== 'undefined').length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {activeTopic.video_resources
                                            .filter(v => v.video_id && v.video_id !== 'undefined')
                                            .map((video, idx) => (
                                            <div key={idx} className="flex flex-col group">
                                                <button 
                                                    onClick={() => {
                                                        setActiveVideo(video);
                                                        setIsVideoPlayerOpen(true);
                                                    }}
                                                    className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl mb-4 group"
                                                >
                                                    {video.thumbnail ? (
                                                        <img 
                                                            src={video.thumbnail} 
                                                            alt={video.title} 
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-black flex items-center justify-center">
                                                            <Youtube className="w-12 h-12 text-red-500/30" />
                                                        </div>
                                                    )}
                                                    
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                                                            <PlayCircle className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60" />
                                                    <div className="absolute bottom-6 left-6 right-6 text-left">
                                                        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                                                            {video.title || "Topic Deep Dive"}
                                                        </h3>
                                                    </div>
                                                </button>

                                                <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 flex-1 hover:border-red-500/20 transition-colors">
                                                    <p className="text-xs font-bold text-white/40 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                                        <Sparkles className="w-3 h-3 text-red-400" />
                                                        Pedagogical Context
                                                    </p>
                                                    <p className="text-sm text-white/70 mb-4 leading-relaxed line-clamp-3">
                                                        {video.relevance || "Essential visual guide for this concept."}
                                                    </p>
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        Focus: {video.focus_area || "Conceptual walkthrough"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    activeTopic.youtube_params?.video_id && activeTopic.youtube_params.video_id !== 'undefined' ? (
                                        <button 
                                            onClick={() => {
                                                setActiveVideo({
                                                    video_id: activeTopic.youtube_params.video_id,
                                                    title: activeTopic.youtube_params.title || activeTopic.youtube_params.search_query || activeTopic.title,
                                                    watch_url: activeTopic.youtube_params.watch_url,
                                                    embed_url: activeTopic.youtube_params.embed_url,
                                                    relevance: "Primary video masterclass for this topic chapter.",
                                                    focus_area: "Full conceptual walkthrough."
                                                });
                                                setIsVideoPlayerOpen(true);
                                            }}
                                            className="w-full relative aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-black to-black" />
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)] group-hover:scale-110 transition-transform">
                                                        <PlayCircle className="w-10 h-10 text-white" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400 mb-2">Neural Masterclass</p>
                                                        <h3 className="text-2xl font-black text-white">{activeTopic.youtube_params.search_query || activeTopic.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-8 right-8 z-10">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold text-white/60">
                                                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                                                    Embedded Neural Stream
                                                </div>
                                            </div>
                                        </button>
                                    ) : (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 text-center group hover:border-primary/20 transition-all">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                                <Youtube className="w-8 h-8 text-white/20" />
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-2">Neural Stream Unavailable</h3>
                                            <p className="text-sm text-white/40 max-w-md mx-auto mb-8">No direct video match found for this concept yet. You can search the YouTube index directly for additional context.</p>
                                            <a 
                                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeTopic.youtube_params?.search_query || activeTopic.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
                                            >
                                                Search YouTube Index
                                                <PlayCircle className="w-4 h-4 text-red-500" />
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {activeTopic.summary && (
                            <div className="p-10 bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-[3rem] text-center mb-12">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-black mb-6">Final Neural Synthesis</p>
                                <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto font-light">
                                    {activeTopic.summary}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-white">Mastery Assessment</p>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Final Proof of Indexing</p>
                                </div>
                            </div>
                            <button 
                                onClick={onStartQuiz}
                                className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                START ASSESSMENT
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="workshop"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LabWorkshop topicId={activeTopic.id} onComplete={onStartQuiz} />
                    </motion.div>
                )}
            </AnimatePresence>
            <VideoPlayerModal 
                isOpen={isVideoPlayerOpen}
                onClose={() => setIsVideoPlayerOpen(false)}
                video={activeVideo}
                title={activeTopic.title}
            />
        </div>
    );
};

export default React.memo(ContentStage);
