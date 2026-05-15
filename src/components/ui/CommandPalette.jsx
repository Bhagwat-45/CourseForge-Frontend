import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, GraduationCap, ArrowRight, X, Clock, FileText, Layers } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { searchAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [serverResults, setServerResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const { courses, selectCourse } = useCourse();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setServerResults(null);
        }
    }, [isOpen]);

    // Debounced server search
    const doSearch = useCallback(async (q) => {
        if (!q || q.trim().length < 2) {
            setServerResults(null);
            return;
        }
        setIsSearching(true);
        try {
            const data = await searchAPI.search(q);
            setServerResults(data.results);
        } catch (err) {
            console.warn('Search failed, using local filter:', err);
            setServerResults(null);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(query), 300);
        return () => clearTimeout(debounceRef.current);
    }, [query, doSearch]);

    // Local fallback when no server results
    const safeCourses = Array.isArray(courses) ? courses : [];
    
    useEffect(() => {
        if (!Array.isArray(courses)) {
            console.warn('[CommandPalette] Courses is not an array:', courses);
        }
    }, [courses]);

    const localCourses = query.trim() === ''
        ? safeCourses.slice(0, 3)
        : safeCourses.filter(c => {
            const title = typeof c.title === 'string' ? c.title : '';
            return title.toLowerCase().includes(query.toLowerCase());
        });

    const handleSelectCourse = (course) => {
        selectCourse(course.id);
        navigate(`/player/${course.id}`);
        onClose();
    };

    const handleSelectTopic = (topic) => {
        if (topic.course_id) {
            selectCourse(topic.course_id);
            navigate(`/player/${topic.course_id}`);
        }
        onClose();
    };

    const typeIcons = {
        course: BookOpen,
        module: Layers,
        topic: FileText,
    };

    if (!isOpen) return null;

    const hasServerResults = serverResults && (
        serverResults.courses?.length > 0 ||
        serverResults.modules?.length > 0 ||
        serverResults.topics?.length > 0
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#050511]/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative w-full max-w-2xl bg-[#0A0A1F] border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    <div className="flex items-center px-8 py-6 border-b border-white/5 gap-4">
                        <Search className="w-6 h-6 text-primary" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search forged paths, modules, or topics..."
                            className="flex-1 bg-transparent border-none outline-none text-lg text-white/80 placeholder:text-white/20 font-light"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            {isSearching && (
                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            )}
                            <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-black text-white/20 border border-white/5">ESC</span>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-white/20" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                        {hasServerResults ? (
                            <>
                                {/* Server search results - Courses */}
                                {serverResults.courses?.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Courses</div>
                                        <div className="space-y-1 mb-4">
                                            {serverResults.courses.map(item => {
                                                const Icon = typeIcons.course;
                                                return (
                                                    <button
                                                        key={`c-${item.id}`}
                                                        onClick={() => handleSelectCourse(item)}
                                                        className="w-full text-left p-5 hover:bg-white/[0.03] rounded-2xl transition-all group flex items-center justify-between border border-transparent hover:border-white/5"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                                                <Icon className="w-5 h-5 text-white/20 group-hover:text-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white/80 group-hover:text-white text-sm">{item.title}</h4>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Course</span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* Server search results - Modules */}
                                {serverResults.modules?.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Modules</div>
                                        <div className="space-y-1 mb-4">
                                            {serverResults.modules.map(item => {
                                                const Icon = typeIcons.module;
                                                return (
                                                    <button
                                                        key={`m-${item.id}`}
                                                        onClick={() => { selectCourse(item.course_id); navigate(`/player/${item.course_id}`); onClose(); }}
                                                        className="w-full text-left p-5 hover:bg-white/[0.03] rounded-2xl transition-all group flex items-center justify-between border border-transparent hover:border-white/5"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                                                <Icon className="w-5 h-5 text-white/20 group-hover:text-cyan-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white/80 group-hover:text-white text-sm">{item.title}</h4>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/40">Module</span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* Server search results - Topics */}
                                {serverResults.topics?.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Topics</div>
                                        <div className="space-y-1">
                                            {serverResults.topics.map(item => {
                                                const Icon = typeIcons.topic;
                                                return (
                                                    <button
                                                        key={`t-${item.id}`}
                                                        onClick={() => handleSelectTopic(item)}
                                                        className="w-full text-left p-5 hover:bg-white/[0.03] rounded-2xl transition-all group flex items-center justify-between border border-transparent hover:border-white/5"
                                                    >
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                                                                <Icon className="w-5 h-5 text-white/20 group-hover:text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-white/80 group-hover:text-white text-sm">{item.title}</h4>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/40">Topic</span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Local fallback / recent courses */}
                                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">
                                    {query ? 'Search Results' : 'Recent Synchronizations'}
                                </div>
                                <div className="space-y-1">
                                    {localCourses.length > 0 ? (
                                        localCourses.map((course) => (
                                            <button
                                                key={course.id}
                                                onClick={() => handleSelectCourse(course)}
                                                className="w-full text-left p-6 hover:bg-white/[0.03] rounded-2xl transition-all group flex items-center justify-between border border-transparent hover:border-white/5"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                                        <BookOpen className="w-6 h-6 text-white/20 group-hover:text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white/80 group-hover:text-white">{course.title}</h4>
                                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                            <span>{course.level || 'Mastery'}</span>
                                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                                            <span>{course.progress || 0}% Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center opacity-20">
                                            <Clock className="w-10 h-10 mb-4 mx-auto" />
                                            <p className="text-xs font-black uppercase tracking-widest">No neural matches found</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/5"><Search className="w-3 h-3 text-white/40" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Navigate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/5"><ArrowRight className="w-3 h-3 text-white/40 rotate-90" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Select</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                            Neural Intelligence Active
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommandPalette;
