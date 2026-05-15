import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle,
    BrainCircuit, Sparkles, ArrowLeft
} from 'lucide-react';
import { useCourse } from '../lib/CourseContext';

// ─── Ambient background ────────────────────────────────────────────────────────
const BG = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-violet-700/14 rounded-full blur-[250px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[40%] -right-[20%] w-[75%] h-[75%] bg-blue-700/10 rounded-full blur-[250px]" />
    </div>
);

// ─── Floating particles ────────────────────────────────────────────────────────
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        {[...Array(8)].map((_, i) => (
            <motion.div key={i}
                className="absolute w-1 h-1 bg-violet-400/15 rounded-full"
                style={{ left: `${12 + (i * 11) % 76}%`, top: `${8 + (i * 13) % 82}%` }}
                animate={{ y: [0, -16, 0], opacity: [0.08, 0.3, 0.08] }}
                transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
        ))}
    </div>
);

// ─── Input field ──────────────────────────────────────────────────────────────
const FormInput = ({ label, icon: Icon, type, placeholder, value, onChange, required, rightElement }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{label}</label>
        <div className="relative group flex items-center">
            <div className="absolute left-4.5 pointer-events-none z-10">
                <Icon className="w-4.5 h-4.5 text-white/20 group-focus-within:text-violet-400 transition-all duration-300" />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="input-premium w-full text-sm font-medium placeholder:text-white/10"
                style={{
                    height: '56px',
                    paddingLeft: '3.75rem',
                    paddingRight: rightElement ? '3.75rem' : '1.25rem'
                }}
            />
            {rightElement && (
                <div className="absolute right-4 z-10 flex items-center">{rightElement}</div>
            )}
        </div>
    </div>
);



// ─── Login Page ────────────────────────────────────────────────────────────────
const LoginPage = () => {
    const navigate = useNavigate();
    const { loginUser } = useCourse();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [typedText, setTypedText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        setIsLoading(true);
        try {
            await loginUser(email, password);
            const userName = email.split('@')[0];
            setIsLoading(false);
            setSuccess(true);
            const fullText = `Welcome back, ${userName}!`;
            let i = 0;
            const iv = setInterval(() => {
                if (i < fullText.length) { setTypedText(fullText.slice(0, i + 1)); i++; }
                else { clearInterval(iv); setTimeout(() => navigate('/dashboard'), 1000); }
            }, 42);
        } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-[#030309] text-white flex items-center justify-center px-6 py-12 font-display relative">
            <BG />

            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            <AnimatePresence mode="wait">
                {!success ? (
                    <motion.div key="form"
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 w-full max-w-md">

                        {/* Card */}
                        <div className="relative glass-elite rounded-[2rem] p-10 border border-white/[0.07] shadow-2xl overflow-hidden">
                            <Particles />

                            {/* Logo */}
                            <div className="flex flex-col items-center mb-8">
                                <Link to="/" className="flex items-center gap-2.5 mb-6 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl blur-sm opacity-50 group-hover:opacity-90 transition-opacity" />
                                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20">
                                            <BrainCircuit className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-lg font-black tracking-tight">CourseForge</span>
                                </Link>
                                <h1 className="text-2xl font-black tracking-tight mb-1.5">Welcome back</h1>
                                <p className="text-white/35 text-sm">Sign in to continue your learning</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
                                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            <p className="text-red-400 text-xs font-semibold">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <FormInput label="Email Address" icon={Mail} type="email" placeholder="you@email.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required />
                                <FormInput label="Password" icon={Lock}
                                    type={showPass ? 'text' : 'password'} placeholder="••••••••"
                                    value={password} onChange={e => setPassword(e.target.value)} required
                                    rightElement={
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="text-white/20 hover:text-white/50 transition-colors">
                                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />

                                <div className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 text-white/30 hover:text-white/55 transition-colors cursor-pointer font-semibold">
                                        <input type="checkbox" className="rounded border-white/10 bg-white/5 text-violet-500 h-3.5 w-3.5" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Forgot password?</a>
                                </div>

                                <motion.button type="submit" disabled={isLoading}
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="w-full relative overflow-hidden py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all disabled:opacity-60 mt-1">
                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%] animate-text-shimmer" />
                                    <div className="absolute inset-0 border border-white/15 rounded-2xl" />
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <motion.div animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                                Signing in…
                                            </>
                                        ) : (
                                            <>Sign In <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </span>
                                </motion.button>
                            </form>



                            <p className="text-center text-sm text-white/25 font-semibold">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-violet-400 hover:text-violet-300 font-black transition-colors">
                                    Create new account →
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="success"
                        initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 text-center px-6">
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 120 }}
                            className="w-20 h-20 mx-auto mb-7 bg-violet-600/15 rounded-[2rem] border border-violet-500/30 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-violet-400 animate-pulse" />
                        </motion.div>
                        <h2 className="text-4xl font-black tracking-tighter mb-3">
                            {typedText}<span className="text-violet-400 animate-pulse">_</span>
                        </h2>
                        <p className="text-white/25 text-xs font-black uppercase tracking-[0.4em] mb-6">Opening Dashboard…</p>
                        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                                transition={{ duration: 1.2 }}
                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginPage;
