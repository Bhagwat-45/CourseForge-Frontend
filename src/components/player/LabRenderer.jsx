import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, RotateCcw, CheckCircle2, AlertCircle, Cpu, Code2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const LabRenderer = ({ content }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState([]);
    const [input, setInput] = useState('');

    const handleRun = () => {
        setIsRunning(true);
        setOutput(prev => [...prev, { type: 'input', text: `> exec ${content.title.toLowerCase().replace(/ /g, '_')}` }]);

        setTimeout(() => {
            setOutput(prev => [...prev, {
                type: 'system',
                text: `[SYSTEM] Neural synchronization verified. Running simulation: ${content.title}...`
            }]);

            setTimeout(() => {
                setOutput(prev => [...prev, {
                    type: 'success',
                    text: `[SUCCESS] ${content.title} sequence complete. 1042 operations successfully validated.`
                }]);
                setIsRunning(false);
            }, 1500);
        }, 800);
    };

    const handleClear = () => {
        setOutput([]);
    };

    return (
        <div className="flex flex-col h-full bg-[#050511] rounded-[2rem] border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-5 border-bottom border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/20 rounded-xl">
                        <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black tracking-tight uppercase">Interactive Neural Lab</h3>
                        <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Target: {content.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleClear}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/40"
                        title="Clear Buffer"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2.5 px-6 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/80 transition-all disabled:opacity-50"
                    >
                        {isRunning ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                        Process
                    </button>
                </div>
            </div>

            {/* Main Lab Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Instruction Pane */}
                <div className="p-8 border-r border-white/5 overflow-y-auto custom-scrollbar">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-6">
                        <Code2 className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Instruction Protocol</span>
                    </div>
                    <h4 className="text-2xl font-black mb-6 tracking-tight">System Configuration</h4>
                    <div className="space-y-6 text-white/60 font-light leading-relaxed text-sm">
                        <p>To successfully forged this neural pathway, you must synchronize the following parameters:</p>
                        <ul className="space-y-4">
                            {[
                                "Initialize neural sequence v2.4",
                                "Validate quantum state coherence",
                                "Execute localized forge command"
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40 shrink-0 mt-0.5">{i + 1}</div>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Console Pane */}
                <div className="bg-black/40 flex flex-col overflow-hidden font-mono">
                    <div className="flex-1 p-8 overflow-y-auto space-y-3 custom-scrollbar">
                        {output.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <Cpu className="w-12 h-12 mb-4" />
                                <p className="text-xs uppercase tracking-[0.3em] font-black">Waiting for Command</p>
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {output.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "text-xs leading-relaxed break-all",
                                        line.type === 'input' ? 'text-primary font-bold' :
                                            line.type === 'success' ? 'text-emerald-400' :
                                                line.type === 'error' ? 'text-red-400' : 'text-white/40'
                                    )}
                                >
                                    {line.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-black/20 flex items-center gap-4">
                        <span className="text-primary font-bold">{'>'}</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="neural_input_v2.0..."
                            className="bg-transparent border-none outline-none text-white/80 text-xs w-full placeholder:text-white/10"
                            onKeyPress={(e) => e.key === 'Enter' && handleRun()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabRenderer;
