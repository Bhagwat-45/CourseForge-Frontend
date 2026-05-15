import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import MyCourses from './pages/dashboard/MyCourses';
import Exams from './pages/dashboard/Exams';
import Profile from './pages/dashboard/Profile';
import History from './pages/dashboard/History';
import PlaceholderPage from './pages/dashboard/PlaceholderPage';
import DemoTourPage from './pages/DemoTourPage';
import PlayerPage from './pages/PlayerPage';
import ScrollToHash from './components/utils/ScrollToHash';
import PageWrapper from './components/layout/PageWrapper';
import MouseGlow from './components/ui/MouseGlow';
import { CourseProvider, useCourse } from './lib/CourseContext';
import ProtectedRoute from './components/utils/ProtectedRoute';
import PublicRoute from './components/utils/PublicRoute';
import { Navigate } from 'react-router-dom';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Hybrid Home Route */}
                <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />

                {/* Public Area Shields */}
                <Route path="/demo" element={<PageWrapper><DemoTourPage /></PageWrapper>} />
                <Route path="/login" element={<PublicRoute><PageWrapper><LoginPage /></PageWrapper></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><PageWrapper><RegisterPage /></PageWrapper></PublicRoute>} />

                {/* Public Application Domain */}
                <Route path="/analyzer" element={
                    <PageWrapper><AnalyzerPage /></PageWrapper>
                } />

                <Route path="/player/:id" element={
                    <ProtectedRoute>
                        <PageWrapper><PlayerPage /></PageWrapper>
                    </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Overview />} />
                    <Route path="courses" element={<MyCourses />} />
                    <Route path="exams" element={<Exams />} />
                    <Route path="history" element={<History />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

            </Routes>
        </AnimatePresence>
    );
}

import { Toaster, toast } from 'react-hot-toast';

function App() {
    useEffect(() => {
        const handleOnline = () => {
            toast.success("Neural Link Restored. Node synchronized.", { id: 'conn-status' });
        };
        const handleOffline = () => {
            toast.error("Neural Link Lost. Running in local cache mode.", { id: 'conn-status' });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <CourseProvider>
            <Toaster 
                position="top-right" 
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#0A0A1F',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '12px',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '1rem',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#7c3aed',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Router>
                <div className="noise-bg" />
                <ScrollToHash />
                <MouseGlow />
                <AnimatedRoutes />
            </Router>
        </CourseProvider>
    );
}

export default App;
