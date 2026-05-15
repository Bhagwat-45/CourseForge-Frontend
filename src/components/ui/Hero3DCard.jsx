import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PlayCircle, Award, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const Hero3DCard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-200 ease-out group"
        >
            <div
                style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 rounded-2xl bg-black/40 overflow-hidden flex flex-col shadow-inner"
            >
                {/* Course Image */}
                <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-mono text-white/80 border border-white/10">
                        AI_GENERATED
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Quantum Computing</h3>
                            <p className="text-xs text-white/50">Dr. Alan Turing AI • 12 Modules</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                            <MoreHorizontal className="w-4 h-4 text-white/60" />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-auto space-y-3">
                        <div className="flex justify-between text-xs text-white/40">
                            <span>Progress</span>
                            <span>0%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[0%] bg-gradient-to-r from-primary to-accent rounded-full" />
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            <button className="flex-1 bg-white text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                                <PlayCircle className="w-3 h-3" /> Start Learning
                            </button>
                            <button className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                                <Share2 className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Floating Elements */}
            <div
                style={{ transform: "translateZ(100px)" }}
                className="absolute -top-6 -right-6 bg-black/80 border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-xl"
            >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <Award className="w-5 h-5 text-black font-bold" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Quiz Aced!</div>
                    <div className="text-[10px] text-white/50 font-medium">+50 XP gained</div>
                </div>
            </div>
        </motion.div >
    );
};

export default Hero3DCard;
