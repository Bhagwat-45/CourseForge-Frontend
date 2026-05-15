import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, Send, CornerDownRight, User, Loader2 } from 'lucide-react';
import { discussionAPI } from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';

const DiscussionPanel = ({ topicId, className }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (topicId) {
            loadDiscussions();
            
            // Pillar 3: Real-time update via polling (every 10s)
            const interval = setInterval(() => {
                loadDiscussions(true); // silent refresh
            }, 10000);
            
            return () => clearInterval(interval);
        }
    }, [topicId]);

    const loadDiscussions = async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        try {
            const data = await discussionAPI.getDiscussions(topicId);
            setMessages(data);
        } catch (err) {
            console.error('Failed to load discussions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSubmitting(true);
        try {
            await discussionAPI.postDiscussion(topicId, newMessage, replyingTo);
            setNewMessage('');
            setReplyingTo(null);
            await loadDiscussions(); // Reload to get fresh data
        } catch (err) {
            console.error('Failed to post discussion:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpvote = async (messageId) => {
        try {
            await discussionAPI.upvoteDiscussion(messageId);
            // Optimistic update
            setMessages(currentMessages => {
                const updateNode = (nodes) => {
                    return nodes.map(node => {
                        if (node.id === messageId) {
                            return { ...node, upvotes: node.upvotes + 1 };
                        }
                        if (node.replies && node.replies.length > 0) {
                            return { ...node, replies: updateNode(node.replies) };
                        }
                        return node;
                    });
                };
                return updateNode(currentMessages);
            });
        } catch (err) {
            console.error('Failed to upvote:', err);
        }
    };

    const MessageNode = ({ message, isReply = false }) => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "p-4 rounded-2xl bg-white/[0.02] border border-white/5",
                isReply && "ml-8 mt-2 border-l-primary/30"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                        <span className="text-xs font-bold text-white uppercase">{message.author.charAt(0)}</span>
                    </div>
                    
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-white/90">{message.author}</span>
                            <span className="text-xs text-white/40">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        
                        <p className="text-sm text-white/70 leading-relaxed mb-3 break-words">
                            {message.content.split(/(@\w+)/g).map((part, i) => 
                                part.startsWith('@') ? (
                                    <span key={i} className="text-primary font-bold bg-primary/10 px-1 rounded-md">
                                        {part}
                                    </span>
                                ) : part
                            )}
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handleUpvote(message.id)}
                                className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-emerald-400 transition-colors"
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {message.upvotes || 0}
                            </button>
                            
                            {!isReply && (
                                <button 
                                    onClick={() => {
                                        if (replyingTo === message.id) {
                                            setReplyingTo(null);
                                        } else {
                                            setReplyingTo(message.id);
                                            setNewMessage(`@${message.author} `);
                                        }
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-primary transition-colors"
                                >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    Reply
                                </button>
                            )}
                        </div>
                        
                        {/* Reply Input Box */}
                        <AnimatePresence>
                            {replyingTo === message.id && (
                                <motion.form 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={handleSubmit}
                                    className="mt-4 flex gap-2"
                                >
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={`Reply to ${message.author}...`}
                                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-primary/50"
                                        autoFocus
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim() || isSubmitting}
                                        className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Render Replies */}
            {message.replies && message.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {message.replies.map(reply => (
                        <MessageNode key={reply.id} message={reply} isReply={true} />
                    ))}
                </div>
            )}
        </motion.div>
    );

    return (
        <div className={cn("flex flex-col h-full bg-[#0a0c10] border border-white/5 rounded-3xl overflow-hidden", className)}>
            <div className="p-5 border-b border-white/5 bg-[#0f1117] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Community Discussion</h3>
                        <p className="text-xs text-white/40">Ask questions, share insights</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[400px]">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-medium">Loading discussions...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 gap-3">
                        <MessageSquare className="w-12 h-12 opacity-20" />
                        <span className="text-sm font-medium">Be the first to start a discussion here.</span>
                    </div>
                ) : (
                    messages.map(msg => <MessageNode key={msg.id} message={msg} />)
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#0f1117]">
                {replyingTo && (
                    <div className="flex items-center justify-between px-3 py-1.5 mb-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/60">
                        <span>Replying to thread</span>
                        <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-white">&times; Cancel</button>
                    </div>
                )}
                
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share your thoughts or ask a question..."
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/30"
                        aria-label="Type a discussion message"
                    />
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim() || isSubmitting}
                        className={cn(
                            "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all",
                            !newMessage.trim() || isSubmitting
                                ? "bg-white/5 text-white/30 cursor-not-allowed"
                                : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                        )}
                        aria-label="Send message"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DiscussionPanel;
