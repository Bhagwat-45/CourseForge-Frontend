import React from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Zap, BookOpen, GraduationCap, Clock, Search, Filter } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { cn } from '../../lib/utils';

const History = () => {
    const { history } = useCourse();

    const getIcon = (type) => {
        switch (type) {
            case 'forge': return <Zap className="w-5 h-5 text-primary" />;
            case 'completion': return <BookOpen className="w-5 h-5 text-emerald-500" />;
            case 'exam': return <GraduationCap className="w-5 h-5 text-accent" />;
            case 'access': return <Clock className="w-5 h-5 text-white/40" />;
            default: return <HistoryIcon className="w-5 h-5 text-white/20" />;
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Chronological Archive</span>
                        </div>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-2">
                        Learning <span className="text-gradient">History</span>
                    </h1>
                    <p className="text-white/40 text-lg font-light">Trace the neural pathways you've forged and mastered.</p>
                </motion.div>

                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 rounded-2xl backdrop-blur-3xl">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                        <Filter className="w-4 h-4 text-white/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-8">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white/[0.01] border border-white/5 rounded-[3rem]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <HistoryIcon className="w-10 h-10 text-white/10" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">No History Detected</h2>
                        <p className="text-white/20 max-w-xs font-light">Your neural journey begins with your first forged course.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent opacity-20 hidden md:block" />

                        <div className="space-y-6">
                            {history.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group"
                                >
                                    <div className="hidden md:flex flex-col items-center justify-center w-20 relative z-10">
                                        <div className="w-10 h-10 bg-[#0A0A1F] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-primary/50 transition-all shadow-2xl">
                                            {getIcon(item.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 hover:border-white/10 transition-all relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
                                                        item.type === 'forge' ? 'bg-primary/20 text-primary' :
                                                            item.type === 'completion' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                item.type === 'exam' ? 'bg-accent/20 text-accent' :
                                                                    'bg-white/5 text-white/40'
                                                    )}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                        {formatTime(item.timestamp)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {item.courseId && (
                                                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                                        View Source
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
