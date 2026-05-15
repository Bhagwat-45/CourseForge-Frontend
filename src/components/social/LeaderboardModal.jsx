import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, ChevronRight, X, TrendingUp, Zap } from 'lucide-react';
import { userAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const LeaderboardModal = ({ isOpen, onClose }) => {
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        try {
            setIsLoading(true);
            const data = await userAPI.getLeaderboard();
            setPlayers(data);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#050511] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic">GLOBAL RANKINGS</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Forging_Mastery_Cohort</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5 text-white/20" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Syncing Ranks...</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {players.map((player, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={cn(
                                            "flex items-center justify-between p-5 rounded-2xl border transition-all group cursor-pointer",
                                            index === 0 
                                                ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)]" 
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm relative",
                                                index === 0 ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]" :
                                                index === 1 ? "bg-slate-300 text-black" :
                                                index === 2 ? "bg-amber-600 text-white" :
                                                "bg-white/5 text-white/40"
                                            )}>
                                                {index + 1}
                                                {index === 0 && <Medal className="absolute -top-1 -right-1 w-4 h-4 text-yellow-600" />}
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-white tracking-tight">{player.name}</p>
                                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary">LVL {player.level}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Rank Stable
                                                    </div>
                                                    <div className="h-1 w-1 rounded-full bg-white/10" />
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 uppercase tracking-widest">
                                                        <Zap className="w-3 h-3" />
                                                        {player.streak}d Streak
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-black text-white tabular-nums group-hover:text-primary transition-colors">{player.xp.toLocaleString()}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Forge Points</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">LIVE_DATA_FEED</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 italic">Forge harder to climb the index.</p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LeaderboardModal;
