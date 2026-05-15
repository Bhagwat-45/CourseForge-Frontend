import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, User, Cpu } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NovaChat = () => {
    const { messages, addMessage, currentCourse, activeModuleIndex, globalMemory, updateGlobalMemory, activeTopic, chatWithMentor } = useCourse();
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleInput = (e) => {
        setInputValue(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        
        // Add User Message Optimistically
        addMessage({ role: 'user', text: userMsg });
        setIsThinking(true);

        try {
            // Check memory hooks quickly for personalization
            if (userMsg.toLowerCase().includes('call me')) {
                const name = userMsg.split('call me')[1].trim();
                updateGlobalMemory({ userName: name });
            }

            // Real API Call to the Mentor
            const apiHistory = messages.map(m => ({ role: m.role, content: m.text }));
            const response = await chatWithMentor(currentCourse.id, {
                topic_id: activeTopic?.id,
                query: userMsg,
                history: apiHistory.slice(-10) // Send last 10 messages for context
            });

            if (response && response.response) {
                addMessage({
                    role: 'assistant',
                    text: response.response
                });
            } else {
                throw new Error("Invalid format");
            }

        } catch (err) {
            const isQuota = err.message?.includes('Quota');
            if (!isQuota) console.error(err);
            
            addMessage({
                role: 'assistant',
                text: isQuota 
                    ? "High demand detected, adjusting response... Please wait a moment while I switch to a backup node."
                    : "My connection to the nexus is currently unstable. Please try asking again."
            });
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative z-10 bg-[#050511]/50 backdrop-blur-xl">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pt-10"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-40 space-y-6">
                         <div className="relative">
                             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                             <Cpu className="relative w-16 h-16 text-primary mx-auto mb-2 opacity-80" />
                         </div>
                         <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Neural Nexus Active</p>
                            <p className="text-xs font-light max-w-[200px] leading-relaxed">I have fully indexed <span className="text-primary font-bold">"{activeTopic?.title || 'the curriculum'}"</span>. High-fidelity support ready.</p>
                         </div>
                         <div className="flex gap-2">
                             {['Analogy', 'Code Help', 'Concept Check'].map((tag) => (
                                 <button key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:border-primary/50 transition-colors">
                                     {tag}
                                 </button>
                             ))}
                         </div>
                    </div>
                )}
                
                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id || i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                            "flex gap-4",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden",
                            msg.role === 'assistant'
                                ? "bg-primary/20 border-primary/30 text-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                : "bg-white/5 border-white/10 text-white/40"
                        )}>
                            {msg.role === 'assistant' ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                    <Cpu className="w-5 h-5 relative z-10" />
                                </>
                            ) : <User className="w-5 h-5" />}
                        </div>

                        <div className={cn(
                            "max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed relative group transition-all",
                            msg.role === 'assistant'
                                ? "bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none hover:border-white/10"
                                : "bg-primary/10 border border-primary/20 text-white rounded-tr-none hover:border-primary/30"
                        )}>
                            {msg.role === 'user' ? (
                                <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{msg.time}</span>
                                {msg.role === 'assistant' && (
                                    <Sparkles className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                            <Cpu className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none p-5 flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40">Synthesizing Response</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 pb-10 border-t border-white/5 bg-gradient-to-t from-black/40 to-transparent">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full pointer-events-none" />
                    <div className="relative flex items-end gap-3 bg-[#0A0A0A]/80 border border-white/10 rounded-3xl p-3 group-focus-within:border-primary/50 transition-all shadow-2xl backdrop-blur-md">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 bg-transparent text-white border-none focus:ring-0 text-sm px-4 py-4 placeholder:text-white/20 resize-none min-h-[60px] max-h-[180px] custom-scrollbar leading-relaxed font-medium"
                            placeholder="Consult Nova... (eg. Explain the second paragraph like I'm five)"
                            value={inputValue}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            aria-label="Chat with Nova AI tutor"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isThinking}
                            className={cn(
                                "p-4 bg-primary text-white rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100 shrink-0 mb-1 relative overflow-hidden group/btn",
                                isThinking && "animate-pulse"
                            )}
                            aria-label="Send message to Nova"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <Send className="w-4 h-4 relative z-10" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovaChat;
