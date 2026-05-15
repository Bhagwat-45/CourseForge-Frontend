import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';

const ActivityHeatmap = ({ data = [], className }) => {
    // Generate last 365 days
    const days = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 365 }, (_, i) => subDays(today, 364 - i));
    }, []);

    const getColor = (count) => {
        if (count === 0) return 'bg-white/[0.03]';
        if (count < 3) return 'bg-primary/30';
        if (count < 6) return 'bg-primary/60';
        return 'bg-primary';
    };

    const getIntensity = (count) => {
        if (count === 0) return 'opacity-20';
        if (count < 3) return 'opacity-50 shadow-[0_0_8px_rgba(124,58,237,0.2)]';
        if (count < 6) return 'opacity-80 shadow-[0_0_12px_rgba(124,58,237,0.4)]';
        return 'opacity-100 shadow-[0_0_15px_rgba(124,58,237,0.6)] animate-pulse';
    };

    return (
        <div className={cn("bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8", className)}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black tracking-tight">Learning Momentum</h3>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Daily Activity Index</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-sm bg-white/5" />
                        <div className="w-2 h-2 rounded-sm bg-primary/30" />
                        <div className="w-2 h-2 rounded-sm bg-primary/60" />
                        <div className="w-2 h-2 rounded-sm bg-primary" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-max">
                    {days.map((day, i) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const entry = data.find(d => d.date === dateStr);
                        const count = entry ? entry.count : 0;

                        return (
                            <motion.div
                                key={dateStr}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.001 }}
                                className={cn(
                                    "w-3 h-3 rounded-sm transition-all duration-500",
                                    getColor(count),
                                    getIntensity(count)
                                )}
                                title={`${dateStr}: ${count} activities`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                    Past 12 Months
                </div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
                    Keep the streak alive!
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
