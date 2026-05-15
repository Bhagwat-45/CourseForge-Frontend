import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Search, ChevronDown, User, Menu, X,
  Sparkles, LogOut, Layout, Zap, BookOpen, BarChart2,
  ArrowRight, Star, Bell
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CommandPalette from '../ui/CommandPalette';
import { useUIStore } from '../../lib/uiStore';
import { useCourse } from '../../lib/CourseContext';

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative group",
      active ? "text-white" : "text-white/40 hover:text-white"
    )}
  >
    {active && (
      <motion.div
        layoutId="active-pill"
        className="absolute inset-0 bg-white/10 rounded-full -z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10">{children}</span>
  </Link>
);

const DropdownItem = ({ icon: Icon, title, sub, gradient, to }) => (
  <Link
    to={to}
    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group"
  >
    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform shadow-lg", gradient)}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{title}</div>
      <div className="text-[10px] font-medium text-white/30 uppercase tracking-widest">{sub}</div>
    </div>
  </Link>
);

const Navbar = () => {
  const { globalMemory, logout, isAuthenticated } = useCourse();
  const { unreadCount } = useUIStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Lock scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "py-0"
          : "py-2"
      )}>
        {/* Background */}
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          scrolled
            ? "bg-[#030309]/85 backdrop-blur-2xl border-b border-white/[0.05]"
            : "bg-transparent"
        )} />

        <div className="container mx-auto px-6 h-[72px] flex justify-between items-center relative">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white leading-none">
                CourseForge
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 leading-none mt-0.5">
                AI Learning
              </span>
            </div>
          </Link>

          {/* ── Center Nav Pills ── */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] p-1.5 rounded-2xl backdrop-blur-xl shadow-xl">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>

              {isAuthenticated && globalMemory.level && (
                <>
                  <div className="w-px h-4 bg-white/10 mx-1" />
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full group cursor-default">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[8px] font-black text-primary uppercase leading-none mb-0.5">Level</span>
                      <span className="text-xs font-black text-white leading-none">{globalMemory.level}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="w-px h-4 bg-white/10 mx-1" />

              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all outline-none">
                  Forge
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", dropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72"
                    >
                      <div className="bg-[#0d0d22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 relative">
                        <DropdownItem
                          icon={BrainCircuit}
                          title="Generate Course"
                          sub="AI Engine · v2.0"
                          gradient="from-violet-600 to-indigo-600"
                          to="/analyzer"
                        />
                        <DropdownItem
                          icon={Layout}
                          title="Dashboard"
                          sub="Personal Neural Hub"
                          gradient="from-emerald-600 to-teal-600"
                          to="/dashboard"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "p-2.5 rounded-xl transition-all border border-transparent relative",
                  isNotificationsOpen 
                    ? "text-primary bg-primary/10 border-primary/20" 
                    : "text-white/40 hover:text-white hover:bg-white/5 hover:border-white/10"
                )}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                   <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white border-2 border-[#030309]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                   </span>
                )}
              </button>
              <NotificationPanel 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>

            <div className="hidden md:block h-5 w-px bg-white/10" />

            {/* Desktop-only Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-all">
                      <Layout className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { logout(); window.location.href = '/'; }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-all group px-3 py-2 rounded-xl hover:bg-white/5">
                    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                      <User className="w-3.5 h-3.5 text-white/60" />
                    </div>
                    <span className="hidden lg:inline">Sign In</span>
                  </Link>

                  <Link to="/analyzer">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl overflow-hidden font-bold text-sm text-white"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                      <Zap className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">Get Started</span>
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden relative z-50 p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-24 z-50 bg-[#0d0d22]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col gap-6"
            >
              {/* Shimmer top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent rounded-t-3xl" />

              <div className="flex flex-col gap-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/demo', label: 'Try Demo' },
                  { to: '/#features', label: 'Features' },
                  { to: '/analyzer', label: 'Course Generator' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-semibold text-base transition-all border border-transparent hover:border-white/8"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5" />

              <div className="grid grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-sm text-center">
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); window.location.href = '/'; }}
                      className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 font-bold text-sm">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center">
                      Sign In
                    </Link>
                    <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)}
                      className="py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm text-center border border-violet-500/30">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};


import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      markAllAsRead();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, markAllAsRead]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            className="absolute top-full right-0 mt-4 w-96 bg-[#0d0d22]/95 border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-3xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-black text-sm uppercase tracking-widest">Neural Activity</h3>
              </div>
              <button 
                onClick={clearAll}
                className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Sparkles className="w-5 h-5 text-white/20" />
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[.2em]">No Neural Signals</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-5 hover:bg-white/[0.02] transition-all group cursor-pointer",
                        !n.read && "bg-primary/5"
                      )}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          n.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                          n.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                          'bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                        )} />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-white/90 mb-1 group-hover:text-white transition-colors">
                            {n.title || n.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/30 font-medium">
                              {formatDistanceToNow(new Date(n.timestamp))} ago
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
              <span className="text-[8px] font-black text-white/10 uppercase tracking-[.3em]">Neural History Core v1.0</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
