import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Info, Youtube, Maximize2, Minimize2 } from 'lucide-react';

const VideoPlayerModal = ({ isOpen, onClose, video, title }) => {
    if (!video) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl aspect-video bg-black rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Player Area */}
                        <div className="flex-1 relative group bg-black flex items-center justify-center">
                            {video.video_id && video.video_id !== 'undefined' ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={video.embed_url || `https://www.youtube.com/embed/${video.video_id}?autoplay=1&rel=0&modestbranding=1`}
                                    title={video.title || title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                                        <Youtube className="w-10 h-10 text-red-500/40" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Visual Stream Unavailable</h3>
                                    <p className="text-white/40 max-w-xs text-sm mb-8">This specific educational deep-dive could not be synchronized. You can still access the core curriculum or search YouTube directly.</p>
                                    <a 
                                        href={video.watch_url && !video.watch_url.includes('undefined') ? video.watch_url : `https://www.youtube.com/results?search_query=${encodeURIComponent(video.title || title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
                                    >
                                        Try External Search
                                    </a>
                                </div>
                            )}
                            
                            {/* Overlay Controls */}
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-xl border border-white/10 rounded-full text-white/70 hover:text-white transition-all z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Sidebar Info (Optional/Conditional) */}
                        <div className="w-full md:w-80 bg-white/[0.03] border-l border-white/5 p-8 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                        <Youtube className="w-4 h-4 text-red-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Deep Dive</span>
                                </div>
                                <h3 className="text-lg font-bold text-white leading-tight mb-4">
                                    {video.title || title}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-white/40 mb-2">
                                        <Info className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Context</span>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed italic">
                                        "{video.relevance || 'Core pedagogical content for this topic.'}"
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-white/40 mb-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Focus Area</span>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/80 leading-relaxed">
                                        {video.focus_area || 'Watch the full masterclass for complete mastery.'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 space-y-3">
                                {video.video_id && video.video_id !== 'undefined' && (
                                    <a 
                                        href={video.watch_url && !video.watch_url.includes('undefined') ? video.watch_url : `https://www.youtube.com/watch?v=${video.video_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 transition-all flex items-center justify-center gap-2 group/link"
                                    >
                                        <Youtube className="w-4 h-4" />
                                        External Playback
                                        <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
                                >
                                    Return to Lesson
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VideoPlayerModal;
