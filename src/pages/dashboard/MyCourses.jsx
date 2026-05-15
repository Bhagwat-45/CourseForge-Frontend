import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Play, Trash2, Download, FileJson } from 'lucide-react';
import { useCourse } from '../../lib/CourseContext';
import { courseAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
    const { courses, selectCourse, deleteCourse } = useCourse();
    const navigate = useNavigate();
    const [progressMap, setProgressMap] = useState({});

    // Fetch real progress for each course from backend
    useEffect(() => {
        const fetchProgress = async () => {
            const map = {};
            for (const c of courses) {
                try {
                    const data = await courseAPI.getProgress(c.id);
                    map[c.id] = data.percentage || 0;
                } catch {
                    map[c.id] = 0;
                }
            }
            setProgressMap(map);
        };
        if (courses.length > 0) fetchProgress();
    }, [courses]);

    const handleContinue = (id) => {
        selectCourse(id);
        navigate(`/player/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Terminate this neural forged course? This cannot be undone.')) {
            deleteCourse(id);
        }
    };


    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Library Sync Active</span>
                        </div>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-2">
                        My <span className="text-gradient">Forged Courses</span>
                    </h1>
                    <p className="text-white/40 text-lg font-light">Continue your journey across the neural frontier.</p>
                </motion.div>
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="w-10 h-10 text-white/20" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-4">No Courses Forged Yet</h2>
                    <p className="text-white/40 max-w-sm mb-8 font-light leading-relaxed">
                        Start by forging your first masterwork in the Analyzer Labs.
                    </p>
                    <button
                        onClick={() => navigate('/analyzer')}
                        className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/80 transition-all flex items-center gap-3"
                    >
                        Go to Analyzer <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, i) => {
                        const progress = progressMap[course.id] ?? (course.progress || 0);
                        return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all group relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">
                                        {course.difficulty || course.level || 'Mastery'}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black tracking-tight mb-4 flex-1">{course.title}</h3>

                                <div className="space-y-6 mb-6">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40 font-bold uppercase tracking-widest">Progress</span>
                                        <span className="text-primary font-black">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <button
                                        onClick={() => handleContinue(course.id)}
                                        className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
                                    >
                                        <Play className="w-4 h-4 fill-current" /> Continue
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 border border-white/10 text-white/40 font-black rounded-2xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" /> Clear
                                    </button>
                                </div>


                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
