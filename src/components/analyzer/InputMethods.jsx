import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileUp, Camera, CheckCircle2, AlertCircle, BrainCircuit, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import GlassCard from '../ui/GlassCard';
import { useSaasStore } from '../../store/useSaasStore';

const InputMethods = ({ activeTab, setActiveTab, level, setLevel, onForge, isLoading }) => {
    const { canGenerate, generation_count, limit, fetchUsage } = useSaasStore();

    React.useEffect(() => {
        fetchUsage();
    }, []);

    const tabs = [
        { id: 'search', label: 'Topic Search', icon: <Search className="w-5 h-5" />, desc: 'Simple text input' },
        { id: 'pdf', label: 'PDF Upload', icon: <FileUp className="w-5 h-5" />, desc: 'Deep-scan docs' },
        { id: 'url', label: 'Link / YouTube', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Analyze web content' }
    ];

    const [topic, setTopic] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [file, setFile] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleForge = () => {
        if (activeTab === 'search') onForge({ type: 'text', value: topic });
        else if (activeTab === 'pdf') onForge({ type: 'file', value: file });
        else if (activeTab === 'url') onForge({ type: 'url', value: url });
    };

    return (
        <div className="space-y-8">
            {/* Tab Selection */}
            <div className="flex flex-wrap gap-4 justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300",
                            activeTab === tab.id
                                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                        )}
                    >
                        {tab.icon}
                        <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter a topic (e.g., Quantum Physics, Baking sourdough...)"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10 font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="h-8 w-[1px] bg-white/10 mr-2" />
                                    <button
                                        onClick={handleForge}
                                        className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary transition-all hover:text-white"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'pdf' && (
                        <motion.div
                            key="pdf"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-2xl relative">
                                <FileUp className="w-8 h-8 text-primary" />
                                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <div className="text-center relative z-10">
                                <p className="text-xl font-black tracking-tighter mb-1">
                                    {file ? file.name : 'Drag & Drop PDF'}
                                </p>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Deep-scanning for technical documents'}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'url' && (
                        <motion.div
                            key="url"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste YouTube link or Doc URL (e.g., https://...)"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10 font-medium"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="h-8 w-[1px] bg-white/10 mr-2" />
                                    <button
                                        onClick={handleForge}
                                        className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary transition-all hover:text-white"
                                    >
                                        <BrainCircuit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Neural Connector Bridge */}
                <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 w-[1px] h-10 bg-gradient-to-b from-primary/50 to-primary/0 hidden md:block">
                    <motion.div
                        className="w-2 h-2 rounded-full bg-primary blur-[4px] absolute top-0 -left-[3.5px]"
                        animate={{ top: ['0%', '100%'], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Usage Counter */}
            </div>

            <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Monthly Quota</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-sm font-black",
                        generation_count >= limit ? "text-red-400" : "text-white"
                    )}>
                        {generation_count} / {limit}
                    </span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-tight">Generated</span>
                </div>
            </div>

            {/* Action Button */}
            {!canGenerate() && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 mb-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold">
                        Monthly generation limit reached (5/5). Your quota will reset next month.
                    </p>
                </div>
            )}
            <button
                onClick={handleForge}
                disabled={isLoading || (!canGenerate()) || (activeTab === 'pdf' && !file) || (activeTab === 'url' && !url) || (activeTab === 'search' && !topic)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {isLoading ? (
                    <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 flex items-center justify-center">
                            <BrainCircuit className="w-5 h-5" />
                        </motion.div>
                        Synthesizing Neural Path...
                    </>
                ) : (
                    <>
                        <BrainCircuit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Forge Knowledge Path
                    </>
                )}
            </button>
        </div>
    );
};

export default InputMethods;
