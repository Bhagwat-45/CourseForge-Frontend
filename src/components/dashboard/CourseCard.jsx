import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, ArrowRight, Clock, Star, Brain, Play, Calendar, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import StudyPlannerModal from '../dashboard/StudyPlannerModal';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const [isPlannerOpen, setIsPlannerOpen] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all duration-500 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* Visual Thumbnail */}
                <div className="w-full md:w-48 h-32 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden flex items-center justify-center p-[1px]">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <Sparkles className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Play className="w-5 h-5 fill-black" />
                        </div>
                    </div>
                    {/* Progress Ring Overlay (Corner) */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
                        <span className="text-[10px] font-black tracking-widest text-primary">{course.progress}%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">
                            {course.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-white/30">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{course.timeRemaining} LEFT</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black tracking-tighter mb-4 group-hover:text-primary transition-colors leading-none">
                        {course.title}
                    </h3>

                    {/* Progress Axis */}
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                            <span>Course Progress</span>
                            <span className="text-white/40">{course.currentChapter || 0} / {course.totalChapters || 1} Units</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress || 0}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                </div>
                            ))}
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                                <span className="text-[8px] font-bold text-white/40">+4</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/player/${course.id}`);
                                }}
                                className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <Play className="w-3 h-3 fill-current" />
                                Resume
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsPlannerOpen(true);
                                }}
                                className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                title="AI Roadmap"
                            >
                                <Calendar className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <StudyPlannerModal 
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                courseId={course.id}
                courseTitle={course.title}
            />
        </motion.div>
    );
};

export default CourseCard;
