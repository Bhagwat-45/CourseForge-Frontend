import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Activity, User, BookOpen, Cpu, Database, Sparkles, ChevronRight, LogOut, Settings, Award } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';

const DashboardBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050511]">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
    </div>
);

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { globalMemory, logout, courses } = useCourse();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const profileRef = React.useRef(null);

    // Shortcut for search
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('keydown', down);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', down);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen text-white font-display selection:bg-primary/30 relative">
            <DashboardBackground />
            <Sidebar />

            <main className="lg:pl-72 min-h-screen relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-40 h-24 bg-[#050511]/40 backdrop-blur-2xl border-b border-white/5 px-8 flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Type 'CMD + K' to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
                            <Activity className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ready to Learn</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="relative p-2.5 text-white/40 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all group flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Home</span>
                            </button>

                            <button className="relative p-2.5 text-white/40 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all group">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#050511] group-hover:scale-110 transition-transform"></span>
                            </button>

                            <div className="h-8 w-[1px] bg-white/10 mx-2" />

                            <div className="relative" ref={profileRef}>
                                <div
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-4 group cursor-pointer"
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-black tracking-tight text-white group-hover:text-primary transition-colors">{globalMemory.userName || 'Alex Morgan'}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Learning Progress: {globalMemory.progress || 85}%</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 p-[1px] group-hover:from-primary group-hover:to-accent transition-all duration-500 shadow-2xl">
                                        <div className="w-full h-full rounded-[calc(1rem+2px)] bg-[#0A0A1F] flex items-center justify-center overflow-hidden border border-white/5">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${globalMemory.userName || 'Alex'}&backgroundColor=050511`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-64 bg-[#0A0A1F]/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                                        >
                                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-white/20">Your Account</p>
                                                <p className="text-[10px] font-mono text-primary truncate mt-1">{globalMemory.email || 'alex.vance@courseforge.io'}</p>
                                            </div>

                                            <button
                                                onClick={() => { navigate('/dashboard/profile'); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.05] transition-all text-sm group"
                                            >
                                                <Settings className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                                                <span className="font-bold">Profile Settings</span>
                                            </button>

                                            <button
                                                onClick={() => { navigate('/dashboard/history'); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.05] transition-all text-sm group"
                                            >
                                                <Award className="w-4 h-4 text-white/40 group-hover:text-accent transition-colors" />
                                                <span className="font-bold">Course History</span>
                                            </button>

                                            <div className="my-2 border-t border-white/5" />

                                            <button
                                                onClick={() => {
                                                    logout();
                                                    window.location.href = '/';
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all text-sm group"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="font-bold">Logout</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 lg:p-12 relative">
                    <Outlet />
                </div>
            </main>

            {/* Search Palette - Cinematic Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-[#0A0A1F]/90 border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden backdrop-blur-3xl"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                                <Search className="w-5 h-5 text-primary" />
                                <input
                                    autoFocus
                                    placeholder="Search your library..."
                                    className="bg-transparent border-none outline-none text-xl font-bold w-full placeholder-white/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-white/40">ESC</div>
                            </div>
                            <div className="p-4 max-h-[480px] overflow-y-auto custom-scrollbar">
                                {searchQuery ? (
                                    <div className="space-y-6">
                                        <div>
                                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Your Courses</p>
                                            <div className="space-y-2">
                                                {(courses || [])
                                                    .filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .slice(0, 5)
                                                    .map((c) => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => {
                                                            setIsSearchOpen(false);
                                                            navigate(`/player/${c.id}`);
                                                        }}
                                                        className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all flex items-center justify-between group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-11 h-11 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 transition-all">
                                                                <BookOpen className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-white block">{c.title}</span>
                                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Course</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                                {(courses || []).filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                                    <p className="px-5 py-4 text-sm text-white/30">No courses match "{searchQuery}"</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Shortcuts</p>
                                            <div className="grid grid-cols-2 gap-2 px-2">
                                                {['Go to Courses', 'My Profile', 'Learning Path', 'Open Settings'].map((cmd, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            setIsSearchOpen(false);
                                                            if (cmd === 'Go to Courses') navigate('/dashboard/courses');
                                                            if (cmd === 'Open Settings') navigate('/dashboard/profile');
                                                            if (cmd === 'Learning Path') alert('Your learning path is optimized for performance.');
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all text-[11px] font-bold text-white/40 hover:text-white"
                                                    >
                                                        <Sparkles className="w-3 h-3 text-primary" />
                                                        {cmd}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-24 text-center space-y-6">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="w-20 h-20 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center mx-auto"
                                        >
                                            <Search className="w-8 h-8 text-primary opacity-40" />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <p className="text-white font-black uppercase text-xs tracking-[0.3em]">Library Search</p>
                                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest max-w-[240px] mx-auto">Access your entire course library in milliseconds.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
                                <span>↑↓ to navigate</span>
                                <span>Enter to select</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
