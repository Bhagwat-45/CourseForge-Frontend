import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, userAPI, courseAPI, searchAPI, exportAPI } from './api';

const CourseContext = createContext();

export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState(() => {
        try {
            const saved = localStorage.getItem('courseforge_all_courses');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to parse courses from localStorage:', e);
            return [];
        }
    });

    const [currentCourse, setCurrentCourse] = useState(() => {
        const saved = localStorage.getItem('courseforge_current_course');
        return saved ? JSON.parse(saved) : null;
    });

    const [lastForgedAt, setLastForgedAt] = useState(() => {
        return localStorage.getItem('courseforge_last_forge_time') || null;
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('courseforge_nova_messages');
        return saved ? JSON.parse(saved) : [
            { id: '1', role: 'assistant', text: "Welcome to the Stage. I'm Nova, your interactive co-pilot. I've analyzed your course blueprint and I'm ready to help you bridge any gaps in understanding.", time: new Date().toLocaleTimeString('en-GB', { hour12: false }) }
        ];
    });

    const [activeModuleIndex, setActiveModuleIndex] = useState(() => {
        const saved = localStorage.getItem('courseforge_active_module_index');
        return saved ? parseInt(saved) : 0;
    });

    const [activeTopicIndex, setActiveTopicIndex] = useState(() => {
        const saved = localStorage.getItem('courseforge_active_topic_index');
        return saved ? parseInt(saved) : 0;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('courseforge_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('courseforge_theme') || 'neural';
    });

    const [globalMemory, setGlobalMemory] = useState(() => {
        const saved = localStorage.getItem('courseforge_global_memory');
        return saved ? JSON.parse(saved) : {
            userName: '',
            email: '',
            preferences: [],
            totalMastery: 0
        };
    });

    // Check for existing token on load to restore session
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('courseforge_token');
    });

    const THEMES = {
        neural: { primary: '#7c3aed', secondary: '#2563eb', accent: '#06b6d4' },
        solar: { primary: '#f59e0b', secondary: '#d97706', accent: '#ea580c' },
        cyber: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#10b981' }
    };

    useEffect(() => {
        const colors = THEMES[theme] || THEMES.neural;
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent-color', colors.accent);
        localStorage.setItem('courseforge_theme', theme);
    }, [theme]);

    // Synchronize and validate indices when the course changes
    useEffect(() => {
        if (!currentCourse) return;

        // Extract modules safely
        const modules = currentCourse.modules || [];
        
        // Validate activeModuleIndex
        if (activeModuleIndex >= modules.length) {
            console.warn("Module index out of bounds, resetting to 0");
            setActiveModuleIndex(0);
            localStorage.setItem('courseforge_active_module_index', '0');
        } else {
            // Validate activeTopicIndex for the current module
            const activeModule = modules[activeModuleIndex];
            const topics = activeModule?.topics || activeModule?.lessons || [];
            if (activeTopicIndex >= topics.length) {
                console.warn("Topic index out of bounds, resetting to 0");
                setActiveTopicIndex(0);
                localStorage.setItem('courseforge_active_topic_index', '0');
            }
        }
    }, [currentCourse, activeModuleIndex, activeTopicIndex]);

    const setTheme = (newTheme) => {
        if (THEMES[newTheme]) setThemeState(newTheme);
    };

    const updateGlobalMemory = (update) => {
        setGlobalMemory(prev => {
            const updated = { ...prev, ...update };
            localStorage.setItem('courseforge_global_memory', JSON.stringify(updated));
            return updated;
        });
    };

    const logActivity = (type, title, metadata = {}) => {
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type, // 'forge', 'completion', 'exam', 'access'
            title,
            ...metadata
        };
        setHistory(prev => {
            const updated = [entry, ...prev].slice(0, 50); // Keep last 50 entries
            localStorage.setItem('courseforge_history', JSON.stringify(updated));
            return updated;
        });
    };

    const commitCourse = (courseData) => {
        const time = new Date().toISOString();

        // Update current course
        setCurrentCourse(courseData);
        setLastForgedAt(time);
        setActiveModuleIndex(0);

        // Add to all courses list if not already present
        setCourses(prev => {
            const exists = prev.find(c => c.id === courseData.id);
            const updated = exists
                ? prev.map(c => c.id === courseData.id ? { ...courseData, lastAccessed: time } : c)
                : [...prev, { ...courseData, lastAccessed: time }];
            localStorage.setItem('courseforge_all_courses', JSON.stringify(updated));
            return updated;
        });

        // Log history
        logActivity('forge', `Forged Course: ${courseData.title}`, { courseId: courseData.id });

        setMessages([
            { id: Date.now().toString(), role: 'assistant', text: `Welcome to ${courseData.title}. I'm Nova. We've synthesized ${courseData.modules.length} modules for you. Where should we begin?`, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) }
        ]);

        localStorage.setItem('courseforge_current_course', JSON.stringify(courseData));
        localStorage.setItem('courseforge_last_forge_time', time);
        localStorage.setItem('courseforge_active_module_index', '0');
        localStorage.removeItem('courseforge_nova_messages');
    };

    const addMessage = (message) => {
        const newMessage = {
            id: Date.now().toString(),
            ...message,
            time: new Date().toLocaleTimeString('en-GB', { hour12: false })
        };
        const updated = [...messages, newMessage];
        setMessages(updated);
        localStorage.setItem('courseforge_nova_messages', JSON.stringify(updated));
    };

    const updateProgress = (moduleIdx, topicIdx = 0) => {
        setActiveModuleIndex(moduleIdx);
        setActiveTopicIndex(topicIdx);
        localStorage.setItem('courseforge_active_module_index', moduleIdx.toString());
        localStorage.setItem('courseforge_active_topic_index', topicIdx.toString());

        // Also update progress in the courses list
        if (currentCourse) {
            const isCompleted = moduleIdx === currentCourse.modules.length - 1 &&
                topicIdx === currentCourse.modules[moduleIdx].topics.length - 1;

            if (isCompleted) {
                logActivity('completion', `Completed Course: ${currentCourse.title}`, { courseId: currentCourse.id });
            }

            setCourses(prev => {
                const updated = prev.map(c =>
                    c.id === currentCourse.id
                        ? { ...c, lastModuleIndex: moduleIdx, lastTopicIndex: topicIdx }
                        : c
                );
                localStorage.setItem('courseforge_all_courses', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const fetchTopicContent = async (topicId, isAuto = false, force = false) => {
        try {
            const topicData = await courseAPI.getTopic(topicId, isAuto, force);
            // Update the current course in place with the fresh content
            setCurrentCourse(prev => {
                if (!prev) return prev;
                const newModules = prev.modules.map(mod => ({
                    ...mod,
                    topics: mod.topics.map(t => t.id === topicId ? { ...t, ...topicData } : t)
                }));
                const updated = { ...prev, modules: newModules };
                localStorage.setItem('courseforge_current_course', JSON.stringify(updated));
                return updated;
            });
            return topicData;
        } catch (error) {
            console.error("Failed to fetch topic content:", error);
            throw error;
        }
    };

    const regenerateTopicContent = async (topicId, isAuto = false) => {
        return fetchTopicContent(topicId, isAuto, true);
    };

    const submitQuiz = async (topicId, score) => {
        try {
            const result = await courseAPI.submitQuiz(topicId, score);
            await refreshUserData();
            return result;
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            throw error;
        }
    };

    const completeTopic = async (topicId) => {
        try {
            const result = await courseAPI.completeTopic(topicId);
            await refreshUserData(); // Refresh XP and stats
            
            // Mark topic as completed in local state
            setCurrentCourse(prev => {
                if (!prev) return prev;
                const newModules = prev.modules.map(mod => ({
                    ...mod,
                    topics: mod.topics.map(t => t.id === topicId ? { ...t, completed: true } : t)
                }));
                return { ...prev, modules: newModules };
            });

            return result;
        } catch (error) {
            console.error("Failed to complete topic:", error);
            throw error;
        }
    };

    const clearCourse = () => {
        setCurrentCourse(null);
        setLastForgedAt(null);
        localStorage.removeItem('courseforge_current_course');
        localStorage.removeItem('courseforge_last_forge_time');
    };

    const deleteCourse = async (courseId) => {
        try {
            await courseAPI.deleteCourse(courseId);
        } catch (err) {
            console.warn('Backend delete failed, removing locally:', err);
        }
        setCourses(prev => {
            const updated = prev.filter(c => c.id !== courseId);
            localStorage.setItem('courseforge_all_courses', JSON.stringify(updated));
            return updated;
        });
        if (currentCourse?.id === courseId) {
            clearCourse();
        }
        logActivity('access', `Deleted Course: ${courseId}`);
    };

    const logout = () => {
        setGlobalMemory({ userName: '', email: '', preferences: [], totalMastery: 0 });
        setCourses([]);
        setCurrentCourse(null);
        setHistory([]);
        setIsAuthenticated(false);
        localStorage.clear();
    };

    const refreshUserData = useCallback(async () => {
        try {
            const [summary, userCourses] = await Promise.all([
                userAPI.getLearningSummary(),
                courseAPI.getMyCourses()
            ]);
            
            updateGlobalMemory({
                totalMastery: summary.average_progress,
                xp: summary.xp || 0,
                level: summary.level || 1,
                badges: summary.badges || [],
                streakDays: summary.streak_days || 0,
                totalCourses: summary.total_courses,
                totalTopicsDone: summary.total_topics_done
            });
            
            const validatedCourses = Array.isArray(userCourses) ? userCourses : [];
            
            setCourses(validatedCourses);
            localStorage.setItem('courseforge_all_courses', JSON.stringify(validatedCourses));
        } catch (error) {
            console.error("Failed to refresh user data:", error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            refreshUserData();
        }
    }, [isAuthenticated]);

    const loginUser = async (email, password) => {
        const data = await authAPI.login(email, password);
        localStorage.setItem('courseforge_token', data.access_token);
        setIsAuthenticated(true);
        const userName = email.split('@')[0];
        updateGlobalMemory({ userName, email });
        await refreshUserData();
    };

    const registerUser = async (name, email, age, password) => {
        await authAPI.register(name, email, age, password);
        await loginUser(email, password);
    };

    const selectCourse = (courseOrId) => {
        // Accept both a course object or an id
        let course;
        if (typeof courseOrId === 'object' && courseOrId !== null) {
            course = courseOrId;
        } else {
            course = courses.find(c => String(c.id) === String(courseOrId));
        }
        if (course) {
            setCurrentCourse(course);
            const modIdx = course.lastModuleIndex || 0;
            const topIdx = course.lastTopicIndex || 0;
            setActiveModuleIndex(modIdx);
            setActiveTopicIndex(topIdx);
            localStorage.setItem('courseforge_current_course', JSON.stringify(course));
            localStorage.setItem('courseforge_active_module_index', modIdx.toString());
            localStorage.setItem('courseforge_active_topic_index', topIdx.toString());
            logActivity('access', `Resumed Course: ${course.title}`, { courseId: course.id });
        }
    };

    const chatWithMentor = useCallback(async (courseId, payload) => {
        return courseAPI.chatWithMentor(courseId, payload);
    }, []);

    return (
        <CourseContext.Provider value={{
            courses,
            currentCourse,
            commitCourse,
            clearCourse,
            lastForgedAt,
            messages,
            addMessage,
            activeModuleIndex,
            activeTopicIndex,
            setActiveTopicIndex,
            updateProgress,
            fetchTopicContent,
            regenerateTopicContent,
            completeTopic,
            submitQuiz,
            selectCourse,
            chatWithMentor,
            history,
            logActivity,
            theme,
            setTheme,
            globalMemory,
            updateGlobalMemory,
            deleteCourse,
            logout,
            loginUser,
            registerUser,
            isAuthenticated,
            refreshUserData,
        }}>
            {children}
        </CourseContext.Provider>
    );
};
