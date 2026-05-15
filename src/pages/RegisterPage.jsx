import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle,
    BrainCircuit, Check, ArrowLeft, Calendar
} from 'lucide-react';
import { useCourse } from '../lib/CourseContext';

// ─── Ambient background ────────────────────────────────────────────────────────
const BG = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <motion.div animate={{ scale: [1, 1.3, 1], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] bg-indigo-700/13 rounded-full blur-[250px]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], y: [0, -25, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[40%] -left-[20%] w-[75%] h-[75%] bg-violet-700/10 rounded-full blur-[250px]" />
    </div>
);

// ─── Floating particles ────────────────────────────────────────────────────────
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        {[...Array(8)].map((_, i) => (
            <motion.div key={i}
                className="absolute w-1 h-1 bg-indigo-400/12 rounded-full"
                style={{ left: `${12 + (i * 11) % 76}%`, top: `${8 + (i * 13) % 82}%` }}
                animate={{ y: [0, -14, 0], opacity: [0.06, 0.25, 0.06] }}
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
            <div className="absolute left-4.5 pointer-events-none z-10 transition-all duration-300">
                <Icon className="w-4.5 h-4.5 text-white/20 group-focus-within:text-violet-400 transition-colors duration-300" />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="input-premium w-full text-sm font-medium placeholder:text-white/10 placeholder:font-normal"
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

// ─── Password strength ────────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
    const checks = [
        { ok: password.length >= 8, label: '8+ chars' },
        { ok: /[A-Z]/.test(password), label: 'Uppercase' },
        { ok: /[0-9]/.test(password), label: 'Number' },
    ];
    const strength = checks.filter(c => c.ok).length;
    const barColors = ['bg-red-500', 'bg-amber-400', 'bg-emerald-500'];
    const labels = ['Weak', 'Good', 'Strong'];
    if (!password) return null;
    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                    <motion.div key={i} initial={{ scaleX: 0 }} animate={{ scaleX: i < strength ? 1 : 0.3 }}
                        className={`flex-1 h-1 rounded-full origin-left transition-colors duration-400 ${i < strength ? barColors[strength - 1] : 'bg-white/8'}`} />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {checks.map(c => (
                        <span key={c.label} className={`text-[9px] font-bold flex items-center gap-1 transition-colors ${c.ok ? 'text-emerald-400' : 'text-white/18'}`}>
                            {c.ok && <Check className="w-2.5 h-2.5" />}{c.label}
                        </span>
                    ))}
                </div>
                {strength > 0 && (
                    <span className={`text-[9px] font-black uppercase tracking-wide ${['text-red-400', 'text-amber-400', 'text-emerald-400'][strength - 1]}`}>
                        {labels[strength - 1]}
                    </span>
                )}
            </div>
        </div>
    );
};



// ─── Register Page ────────────────────────────────────────────────────────────
const RegisterPage = () => {
    const navigate = useNavigate();
    const { registerUser } = useCourse();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (!age || parseInt(age) < 5) { setError('Please enter a valid age.'); return; }
        if (!agreed) { setError('Please accept the Terms to continue.'); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address (e.g., name@domain.com).');
            return;
        }
        setIsLoading(true);
        try {
            await registerUser(name, email, age, password);
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1800);
        } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#030309] text-white flex items-center justify-center px-6 py-14 font-display relative">
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
                                <h1 className="text-2xl font-black tracking-tight mb-1.5">Create your account</h1>
                                <p className="text-white/35 text-sm">Start building AI courses for free</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
                                            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            <p className="text-red-400 text-xs font-semibold">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <FormInput label="Full Name" icon={User} type="text" placeholder="Your Name"
                                    value={name} onChange={e => setName(e.target.value)} required />

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                    <div className="sm:col-span-8">
                                        <FormInput label="Email Address" icon={Mail} type="email" placeholder="you@email.com"
                                            value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="sm:col-span-4">
                                        <FormInput
                                            label="Earthly Age"
                                            icon={Calendar}
                                            type="text"
                                            placeholder="24"
                                            value={age}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || /^\d+$/.test(val)) {
                                                    setAge(val);
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <FormInput label="Password" icon={Lock}
                                        type={showPass ? 'text' : 'password'} placeholder="Create a strong password"
                                        value={password} onChange={e => setPassword(e.target.value)} required
                                        rightElement={
                                            <button type="button" onClick={() => setShowPass(!showPass)}
                                                className="text-white/20 hover:text-white/50 transition-colors">
                                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        }
                                    />
                                    <PasswordStrength password={password} />
                                </div>

                                <FormInput label="Confirm Password" icon={Lock}
                                    type={showConf ? 'text' : 'password'} placeholder="Re-enter your password"
                                    value={confirm} onChange={e => setConfirm(e.target.value)} required
                                    rightElement={
                                        <button type="button" onClick={() => setShowConf(!showConf)}
                                            className="p-1 text-white/20 hover:text-white/50 transition-colors">
                                            {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />

                                {/* Terms checkbox */}
                                <label className="flex items-start gap-3 cursor-pointer group mt-1">
                                    <div onClick={() => setAgreed(!agreed)}
                                        className={`mt-0.5 w-[18px] h-[18px] rounded-lg border flex items-center justify-center shrink-0 transition-all ${agreed
                                            ? 'bg-violet-600 border-violet-500'
                                            : 'bg-white/5 border-white/15 group-hover:border-white/30'}`}>
                                        {agreed && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <span className="text-xs text-white/30 leading-relaxed">
                                        I agree to the{' '}
                                        <a href="#" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Privacy Policy</a>
                                    </span>
                                </label>

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
                                                Creating Account…
                                            </>
                                        ) : (
                                            <>Create Account <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </span>
                                </motion.button>
                            </form>



                            <p className="text-center text-sm text-white/25 font-semibold">
                                Already have an account?{' '}
                                <Link to="/login" className="text-violet-400 hover:text-violet-300 font-black transition-colors">
                                    Sign in →
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
                            className="w-20 h-20 mx-auto mb-7 bg-emerald-600/15 rounded-[2rem] border border-emerald-500/30 flex items-center justify-center">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </motion.div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Account Created!</h2>
                        <p className="text-white/35 text-sm mb-7">Welcome to CourseForge, <span className="text-white font-bold">{name}</span>. Opening your dashboard…</p>
                        <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }}
                                transition={{ duration: 1.8 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RegisterPage;
