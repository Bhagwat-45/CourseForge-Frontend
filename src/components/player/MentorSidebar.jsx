import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Brain, Bot, User } from 'lucide-react';
import { courseAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const MentorSidebar = ({ isOpen, onClose, courseId, topicId }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your CourseForge Mentor. Ask me anything about this topic." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await courseAPI.chatWithMentor(courseId, {
                topic_id: topicId,
                query: input,
                history: messages.slice(-5) // Send last 5 for context
            });

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the forge. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 w-[400px] h-full bg-[#050511] border-l border-white/10 z-[100] flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Mentor</h3>
                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest animate-pulse">Syncing Context...</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-white/20" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                    >
                        {messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex gap-3",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                    msg.role === 'user' ? "bg-white/5 border border-white/10" : "bg-primary/20 border border-primary/30"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-white/40" /> : <Sparkles className="w-4 h-4 text-primary" />}
                                </div>
                                <div className={cn(
                                    "max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed font-medium",
                                    msg.role === 'user' 
                                        ? "bg-white/5 text-white/80 rounded-tr-none" 
                                        : "bg-white/[0.02] border border-white/5 text-white rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex gap-1">
                                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" />
                                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                        <div className="relative group">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about this unit..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/10 font-medium pr-12"
                                aria-label="Ask the AI mentor a question"
                            />
                            <button 
                                onClick={handleSend}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest mt-4 text-center">
                            Context: Current Learning Phase
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MentorSidebar;
