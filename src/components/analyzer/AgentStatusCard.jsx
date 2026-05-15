import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Sparkles, BrainCircuit, PenTool, Database, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const AgentStatusCard = ({ agent, status }) => {
    const getAgentIcon = (id) => {
        switch (id) {
            case 'architect': return <BrainCircuit className="w-5 h-5" />;
            case 'scribe': return <PenTool className="w-5 h-5" />;
            case 'illustrator': return <Sparkles className="w-5 h-5" />;
            case 'warden': return <ShieldCheck className="w-5 h-5" />;
            default: return <Database className="w-5 h-5" />;
        }
    };

    const isWorking = status === 'working';
    const isComplete = status === 'complete';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 5 }}
            className={cn(
                "p-5 rounded-[2rem] border transition-all duration-700 flex items-center gap-5 relative overflow-hidden group",
                isWorking
                    ? "bg-primary/5 border-primary/40 shadow-[0_0_40px_rgba(124,58,237,0.1)] scale-[1.02]"
                    : isComplete
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
            )}
        >
            {isWorking && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent animate-pulse" />
            )}

            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-500",
                isWorking ? "bg-primary text-white shadow-xl shadow-primary/20" :
                    isComplete ? "bg-emerald-500 text-white" : "bg-white/10 text-white/20"
            )}>
                {getAgentIcon(agent.id)}
                {isWorking && (
                    <motion.div
                        layoutId={`pulse-${agent.id}`}
                        className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20"
                    />
                )}
            </div>

            <div className="flex-1 relative z-10">
                <h4 className={cn(
                    "font-black text-sm tracking-tight mb-0.5 transition-colors",
                    isWorking || isComplete ? "text-white" : "text-white/40"
                )}>
                    {agent.name}
                </h4>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em]",
                        isWorking ? "text-primary animate-pulse" :
                            isComplete ? "text-emerald-500" : "text-white/20"
                    )}>
                        {isWorking ? 'Processing Neural Data' : isComplete ? 'Forge Optimized' : 'Interface Standby'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center w-8 relative z-10">
                {isWorking && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                {isComplete && (
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                        <Check className="w-4 h-4 text-white stroke-[3px]" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default AgentStatusCard;
