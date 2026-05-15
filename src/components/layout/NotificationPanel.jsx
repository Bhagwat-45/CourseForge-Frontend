import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../lib/uiStore';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, markAllAsRead, unreadCount } = useUIStore();

    useEffect(() => {
        if (isOpen) {
            markAllAsRead();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, markAllAsRead]);

    const icons = {
        info: <Info className="w-4 h-4 text-primary" />,
        success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        error: <AlertTriangle className="w-4 h-4 text-red-500" />,
        warning: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent" // Added overlay for mobile
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed md:absolute top-0 right-0 md:top-auto h-full md:h-auto md:mt-4 w-full md:w-96 bg-[#050511]/95 md:bg-[#0A0A1F] border-l md:border border-white/10 rounded-none md:rounded-[2rem] shadow-[0_20px_100px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-3xl"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Bell className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm tracking-tight text-white/80">Neural Notifications</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                        {unreadCount} Unread Pulse{unreadCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => markAsRead(n.id)}
                                        className={cn(
                                            "p-4 hover:bg-white/[0.02] rounded-2xl transition-all group cursor-pointer border m-1",
                                            n.read ? "border-transparent text-white/40" : "border-primary/20 bg-primary/5 text-white"
                                        )}
                                    >
                                        <div className="flex gap-4">
                                            <div className="mt-1 shrink-0">{icons[n.type] || icons.info}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-bold text-white transition-colors">
                                                        {n.title}
                                                        {!n.read && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary" />}
                                                    </h4>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className={cn(
                                                    "text-xs leading-relaxed",
                                                    n.read ? "text-white/30" : "text-white/60"
                                                )}>{n.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center flex flex-col items-center justify-center opacity-40">
                                    <Zap className="w-8 h-8 mx-auto mb-4 text-white/20" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Neural Quiet</p>
                                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">No active pulses detected</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10">Synchronized Node v2.4.0</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
