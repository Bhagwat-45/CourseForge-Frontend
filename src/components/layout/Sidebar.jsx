import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, GraduationCap, History, User, BrainCircuit, Sparkles, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCourse } from '../../lib/CourseContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useCourse();
    const links = [
        { name: 'Home', icon: <Sparkles className="w-5 h-5" />, path: '/' },
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
        { name: 'My Courses', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/courses' },
        { name: 'Exams', icon: <GraduationCap className="w-5 h-5" />, path: '/dashboard/exams' },
        { name: 'History', icon: <History className="w-5 h-5" />, path: '/dashboard/history' },
        { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/dashboard/profile' },
    ];

    return (
        <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 bg-[#050511]/40 backdrop-blur-3xl border-r border-white/5 flex-col z-50">
            <div className="px-8 py-10 flex items-center gap-5 border-b border-white/5">
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl relative z-10 transition-transform group-hover:scale-105">
                        <BrainCircuit className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="flex flex-col justify-center mt-1 space-y-1.5">
                    <span className="text-2xl font-black tracking-tight leading-none text-white/95">CourseForge</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80 leading-none">Learning Platform</span>
                </div>
            </div>

            <div className="flex-1 px-6 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 ml-4">Navigation</p>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/dashboard'}
                        className={({ isActive }) => cn(
                            "relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group overflow-hidden",
                            isActive
                                ? "bg-white/[0.03] text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
                                : "text-white/40 hover:bg-white/[0.02] hover:text-white"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-glow"
                                        className="absolute inset-0 bg-primary/5 blur-xl -z-10"
                                    />
                                )}
                                <span className={cn(
                                    "transition-colors duration-500",
                                    isActive ? "text-primary" : "group-hover:text-primary"
                                )}>
                                    {link.icon}
                                </span>
                                <span className="font-bold text-sm tracking-tight relative z-10">{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-6">

                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/'; // Strict reset
                    }}
                    className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-white/20 hover:bg-red-500/5 hover:text-red-400 transition-all group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-widest">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
