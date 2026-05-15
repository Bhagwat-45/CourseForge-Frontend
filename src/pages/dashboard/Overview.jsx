import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Trophy, Flame, Sparkles, Zap, BrainCircuit, ChevronRight, Timer, Award, Network, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import KnowledgeGraph from '../../components/dashboard/KnowledgeGraph';
import StatCard from '../../components/dashboard/StatCard'; // Assuming this is the new imported StatCard
import CourseCard from '../../components/dashboard/CourseCard';
import CourseCarousel from '../../components/dashboard/CourseCarousel';
import { useCourse } from '../../lib/CourseContext';
import LeaderboardModal from '../../components/social/LeaderboardModal';
import KnowledgeMapModal from '../../components/dashboard/KnowledgeMapModal';
import ActivityHeatmap from '../../components/dashboard/ActivityHeatmap';
import { userAPI } from '../../lib/api';
import { useEffect } from 'react';
import { useSaasStore } from '../../store/useSaasStore';


const Overview = () => {
    const { courses, globalMemory } = useCourse();
    const navigate = useNavigate();
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activityData, setActivityData] = useState([]);

    const { generation_count, limit, cycle_end_date, fetchUsage } = useSaasStore();

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await userAPI.getActivityData();
                setActivityData(data);
            } catch (err) {
                console.error("Failed to fetch activity data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
        fetchUsage();
    }, []);

    // Calculate level: floor(sqrt(XP / 100)) + 1
    const currentLevel = Math.floor(Math.sqrt((globalMemory?.xp || 0) / 100)) + 1;

    const activeCourses = courses.length > 0 ? courses.map(c => ({ ...c, progress: 0 })) : [
        {
            id: 'mock-1',
            title: "Advanced Quantum Computing",
            level: "Mastery",
            progress: 0,
            duration: "18 Hours Content",
            modules: new Array(5).fill({})
        },
        {
            id: 'mock-2',
            title: "Neural Network Architectures",
            level: "Expert",
            progress: 0,
            duration: "24 Hours Content",
            modules: new Array(8).fill({})
        },
        {
            id: 'mock-3',
            title: "React Design Patterns",
            level: "Intermediate",
            progress: 0,
            duration: "10 Hours Content",
            modules: new Array(6).fill({})
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
            {/* Top Bar: Welcome & Streak */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Online</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                            Welcome back, <span className="text-gradient">{globalMemory?.userName || 'Explorer'}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">LVL {currentLevel}</span>
                        </h1>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-500/20 flex items-center justify-center relative">
                        <Flame className="w-8 h-8 text-orange-500 fill-orange-500/30 animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-[#050511]">
                            <Sparkles className="w-2 h-2 text-orange-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Current Streak</p>
                        <p className="text-4xl font-black tracking-tighter text-orange-500">{globalMemory?.streakDays || 0} Days</p>
                    </div>
                </motion.div>
            </div>

            {/* Knowledge Topology Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <KnowledgeGraph />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            title="Total XP"
                            value={`${globalMemory?.xp || 0} XP`}
                            trend="Level Up"
                            icon={<Award className="w-6 h-6" />}
                        />
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 col-span-2">
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Monthly Course Quota</h3>
                              <Database className="w-4 h-4 text-primary" />
                           </div>
                           <div className="flex items-end gap-2">
                              <p className="text-4xl font-black text-white">{generation_count}</p>
                              <p className="text-xl font-bold text-white/20 mb-1">/ {limit}</p>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(generation_count / limit) * 100}%` }}
                                 className={cn(
                                    "h-full rounded-full",
                                    generation_count >= limit ? "bg-red-500" : "bg-primary"
                                 )}
                              />
                           </div>
                           <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-widest">Resets: {cycle_end_date ? new Date(cycle_end_date).toLocaleDateString() : 'Next Cycle'}</p>
                        </div>
                        <StatCard
                            title="Topics Mastered"
                            value={`${globalMemory?.totalTopicsDone || 0}`}
                            trend="Active User"
                            icon={<Zap className="w-6 h-6" />}
                        />
                    </div>

                <ActivityHeatmap data={activityData} className="mt-8" />
                </div>

                {/* Right Column: Achievements & Activities */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black tracking-tight">Recent Activity</h3>
                            <button onClick={() => navigate('/dashboard/history')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">View History</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: "Course Started", time: "2h ago", icon: <Trophy className="w-4 h-4 text-emerald-500" />, type: "success" },
                                { title: "Lesson Done", time: "5h ago", icon: <Sparkles className="w-4 h-4 text-primary" />, type: "info" },
                                { title: "Quiz Done", time: "1d ago", icon: <BookOpen className="w-4 h-4 text-white/40" />, type: "neutral" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold tracking-tight">{item.title}</p>
                                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{item.time}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/5 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Global Rankings Card */}
                    <div 
                        onClick={() => setIsLeaderboardOpen(true)}
                        className="bg-gradient-to-br from-yellow-500/10 to-transparent backdrop-blur-3xl border border-yellow-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer hover:border-yellow-500/40 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                        <div className="flex items-center justify-between mb-4">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                                <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Global Index</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-2 italic">LEADERBOARD</h3>
                        <p className="text-xs text-white/40 font-medium leading-relaxed">
                            Compare your metrics with <br /> top-tier knowledge forgers.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-yellow-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Open Rankings</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    <LeaderboardModal 
                        isOpen={isLeaderboardOpen} 
                        onClose={() => setIsLeaderboardOpen(false)} 
                    />

                    <KnowledgeMapModal 
                        isOpen={isMapOpen}
                        onClose={() => setIsMapOpen(false)}
                    />
                </div>
            </div>

            {/* Continue Learning Matrix */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter">Your Courses</h2>
                        <p className="text-sm text-white/20 font-bold uppercase tracking-[0.2em] mt-1">Continue your learning journey</p>
                    </div>
                    <button onClick={() => navigate('/dashboard/courses')} className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                        View All Courses
                    </button>
                </div>

                <div className="w-full">
                    <CourseCarousel courses={activeCourses} />
                </div>
            </section>
        </div>
    );
};

export default Overview;
