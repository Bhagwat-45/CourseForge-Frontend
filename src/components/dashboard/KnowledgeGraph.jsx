import React from 'react';
import { motion } from 'framer-motion';
import { useCourse } from '../../lib/CourseContext';
import { BrainCircuit, Cpu, Zap, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

const KnowledgeGraph = () => {
    const { courses } = useCourse();

    // Seed nodes with forged courses
    const nodes = courses.length > 0
        ? courses.map((c, i) => ({
            id: c.id,
            title: c.title,
            x: 20 + (i * 30) % 60,
            y: 30 + (i * 20) % 50,
            progress: c.progress || 0,
            color: i % 2 === 0 ? 'bg-primary' : 'bg-accent'
        }))
        : [
            { id: 'base1', title: 'Neural Architectures', x: 25, y: 40, progress: 85, color: 'bg-primary' },
            { id: 'base2', title: 'Quantum Theory', x: 60, y: 25, progress: 42, color: 'bg-accent' },
            { id: 'base3', title: 'Deep Logic', x: 75, y: 65, progress: 12, color: 'bg-primary' }
        ];

    return (
        <div className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 h-[400px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-black tracking-tight">Learning Topology</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Knowledge distribution map</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Core Path</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Linked Node</span>
                    </div>
                </div>
            </div>

            {/* Graph Area */}
            <div className="h-full relative mt-4">
                {/* Simulated Neural Bridges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                        <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--primary-color)" />
                            <stop offset="100%" stopColor="var(--accent-color)" />
                        </linearGradient>
                    </defs>
                    {nodes.map((node, i) => {
                        if (i === 0) return null;
                        const prev = nodes[i - 1];
                        return (
                            <motion.line
                                key={`line-${i}`}
                                x1={`${prev.x}%`}
                                y1={`${prev.y}%`}
                                x2={`${node.x}%`}
                                y2={`${node.y}%`}
                                stroke="url(#bridgeGradient)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: i * 0.5 }}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.2, type: 'spring' }}
                        className="absolute cursor-pointer group/node"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                className={cn(
                                    "absolute inset-0 blur-xl rounded-full",
                                    node.color
                                )}
                            />
                            <div className={cn(
                                "relative w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 group-hover/node:border-white/30 transition-all",
                                node.color,
                                "bg-opacity-20 backdrop-blur-md"
                            )}>
                                {i === 0 ? <BrainCircuit className="w-6 h-6 text-white" /> :
                                    i % 2 === 0 ? <Cpu className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
                            </div>

                            {/* Hover info */}
                            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-32 bg-[#050511] border border-white/10 rounded-xl p-3 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none z-50 shadow-2xl">
                                <p className="text-[10px] font-black tracking-tight text-white mb-1 truncate">{node.title}</p>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full" style={{ width: `${node.progress}%` }} />
                                </div>
                                <p className="text-[8px] font-black text-primary mt-2 uppercase tracking-widest">{node.progress}% Complete</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-white/10">
                <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    <span>Computation Mesh v4.0</span>
                </div>
                <span>Sync Delta: {courses.length > 0 ? '+14% / cycle' : 'Baseline Active'}</span>
            </div>
        </div>
    );
};

export default KnowledgeGraph;
