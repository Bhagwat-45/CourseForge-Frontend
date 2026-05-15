import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Key, Bell, CreditCard, ChevronRight, Zap, Trophy, Target, Globe, Github, Twitter, Linkedin, Mail, BrainCircuit, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCourse } from '../../lib/CourseContext';
import { userAPI } from '../../lib/api';

const Profile = () => {
    const { globalMemory, updateGlobalMemory, courses } = useCourse();
    const [name, setName] = useState(globalMemory.userName || '');
    const [bio, setBio] = useState(globalMemory.bio || '');
    const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [pwStatus, setPwStatus] = useState(null);

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            await userAPI.updateProfile(name, null);
            updateGlobalMemory({ userName: name, bio });
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 2000);
        } catch (err) {
            console.error('Profile save failed:', err);
            updateGlobalMemory({ userName: name, bio });
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || newPassword.length < 6) {
            setPwStatus('Password must be at least 6 characters');
            return;
        }
        setPwStatus('changing');
        try {
            await userAPI.changePassword(currentPassword, newPassword);
            setPwStatus('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setTimeout(() => setPwStatus(null), 3000);
        } catch (err) {
            setPwStatus(err.message || 'Failed to change password');
            setTimeout(() => setPwStatus(null), 4000);
        }
    };

    const totalMastery = Math.round(globalMemory?.totalMastery || 0);

    const stats = [
        { label: 'Neural Streak', value: `${globalMemory?.streakDays || 0} Days`, icon: <Zap className="w-5 h-5 text-orange-500" />, color: 'orange' },
        { label: 'Mastery XP', value: `${globalMemory?.xp || 0}`, icon: <Zap className="w-5 h-5 text-yellow-500" />, color: 'yellow' },
        { label: 'Topics Done', value: `${globalMemory?.totalTopicsDone || 0}`, icon: <Zap className="w-5 h-5 text-primary" />, color: 'primary' },
        { label: 'Courses Forged', value: `${globalMemory?.totalCourses || courses.length}`, icon: <Trophy className="w-5 h-5 text-emerald-500" />, color: 'emerald' }
    ];

    const themes = [
        { id: 'neural', name: 'Neural', color: '#7c3aed' },
        { id: 'solar', name: 'Solar', color: '#f59e0b' },
        { id: 'cyber', name: '#Cyber', color: '#0ea5e9' }
    ];

    const badges = [
        { name: 'Early Adopter', icon: <Trophy className="w-6 h-6 text-yellow-400" />, desc: 'One of the first 1000 agents' }, // Changed Award to Trophy
        { name: 'Quantum Pioneer', icon: <Shield className="w-6 h-6 text-primary" />, desc: 'Completed Advanced Physics path' },
        { name: 'Neural Linker', icon: <Zap className="w-6 h-6 text-accent" />, desc: '7-day consistent forge streak' } // Changed Activity to Zap
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            {/* Header / Banner */}
            <div className="relative h-64 lg:h-80 rounded-[3rem] overflow-hidden group">
                <div className="absolute inset-0 bg-[#0A0A1F] border border-white/5" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <div className="absolute bottom-0 left-0 w-full p-12 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="flex items-center gap-8 relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 rounded-[2.5rem] bg-black border-4 border-white/10 flex items-center justify-center relative overflow-hidden group/avatar"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
                            <User className="w-16 h-16 text-white opacity-80" />
                        </motion.div>
                        <div className="mb-4 flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black tracking-tighter mb-2">{globalMemory.userName || 'Alex Vance'}</h1>
                            <p className="text-white/40 font-medium mb-6 flex items-center justify-center md:justify-start gap-2 italic">
                                <Mail className="w-3 h-3" /> {globalMemory.email || 'alex.vance@neural.link'}
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{totalMastery}% Total Mastery</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full md:w-auto">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 ml-1">Agent Identifier</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                placeholder="Alex Vance"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 ml-1">Neural Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-primary/50 focus:bg-primary/5 transition-all outline-none min-h-[120px] resize-none"
                                placeholder="Synthesizing reality through neural interfaces..."
                            />
                        </div>
                        <div className="pt-4 flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saveStatus === 'saving'}
                                className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                {saveStatus === 'saving' ? 'Saving...' :
                                 saveStatus === 'saved' ? <><Check className="w-4 h-4" /> Saved</> :
                                 'Save Synchronization'}
                            </button>
                            {saveStatus === 'error' && (
                                <span className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Saved locally
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
                {/* Stats & Progress */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 group hover:border-primary/20 transition-all relative overflow-hidden"
                            >
                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br", `from-${stat.color}-500/5 to-transparent`)} />
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                                    {stat.icon}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">{stat.label}</p>
                                <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-white/[0.01] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black tracking-tight">Recent Mastery Matrix</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Beginner</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(30,58,138,0.5)]" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Intermediate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Advanced</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {[
                                { skill: 'Quantum Logic', value: 85, color: 'primary' },
                                { skill: 'Neural Design', value: 92, color: 'accent' },
                                { skill: 'Algorithm Forge', value: 64, color: 'orange' }
                            ].map((skill, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold px-1">
                                        <span className="text-white opacity-60 uppercase tracking-widest">{skill.skill}</span>
                                        <span className="text-white">{skill.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.value}%` }}
                                            className={cn("h-full", skill.color === 'primary' ? 'bg-primary' : skill.color === 'accent' ? 'bg-accent' : 'bg-orange-500')}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badges & Identity */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10">
                        <h3 className="text-xl font-black tracking-tight mb-8">Neural Theme</h3>
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => updateGlobalMemory({ theme: t.id })} // Changed setTheme to updateGlobalMemory
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all group",
                                        globalMemory.theme === t.id // Changed theme to globalMemory.theme
                                            ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full shadow-lg"
                                        style={{ backgroundColor: t.color, boxShadow: `0 0 15px ${t.color}66` }}
                                    />
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        globalMemory.theme === t.id ? "text-white" : "text-white/20" // Changed theme to globalMemory.theme
                                    )}>{t.name}</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xl font-black tracking-tight mb-10">Identity Honors</h3>
                        <div className="space-y-8">
                            {badges.map((badge, i) => (
                                <div key={i} className="flex gap-6 items-start group cursor-pointer">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors">{badge.name}</h4>
                                        <p className="text-xs text-white/30 font-light mt-1">{badge.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-white/5 rounded-[2.5rem] p-10 text-center flex flex-col items-center group overflow-hidden relative">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <BrainCircuit className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-black tracking-tight mb-4">Refer an Agent</h3>
                        <p className="text-xs text-white/40 leading-relaxed mb-8">Expand the Council Network and earn 500 mastery XP for every successful link.</p>
                        <button 
                            onClick={() => {
                                const link = `https://courseforge.ai/ref/${globalMemory.userName || 'agent'}`;
                                navigator.clipboard.writeText(link);
                                alert("Neural link copied to clipboard!");
                            }}
                            className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
                        >
                            Generate Referral Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
