import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../../lib/api';

export function AnalyticsDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = getAuthToken();
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
                
                const [resMetrics, resStats] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/analytics/metrics`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${BACKEND_URL}/api/admin/api-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!resMetrics.ok || !resStats.ok) throw new Error("Failed to load analytics.");
                
                const dataMetrics = await resMetrics.json();
                const dataStats = await resStats.json();
                setMetrics(dataMetrics);
                setStats(dataStats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-800/50 h-28 rounded-xl border border-gray-700/50" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-400 bg-red-900/20 p-4 rounded-md mb-8">{error}</div>;
    }

    return (
        <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Platform Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-transform hover:scale-[1.02]">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-white">{metrics?.total_users || 0}</p>
                </div>
                
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-transform hover:scale-[1.02]">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Forged Courses</h3>
                    <p className="text-3xl font-bold text-white">{metrics?.total_courses || 0}</p>
                </div>
                
                <div className="bg-gray-900/60 p-6 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-transform hover:scale-[1.02]">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">AI Engine Cycles</h3>
                    <p className="text-3xl font-bold text-white">{metrics?.total_ai_generations || 0}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-white mt-8 mb-2">API Observability Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="text-white/40 text-sm font-medium mb-1">Total Requests</h3>
                    <p className="text-2xl font-black text-white">{stats?.total_requests || 0}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-red-500/20 shadow-lg">
                    <h3 className="text-white/40 text-sm font-medium mb-1">Failed Errors</h3>
                    <p className="text-2xl font-black text-red-400">{stats?.failed_requests || 0}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-yellow-500/20 shadow-lg">
                    <h3 className="text-white/40 text-sm font-medium mb-1">Slow Limits</h3>
                    <p className="text-2xl font-black text-yellow-400">{stats?.slow_requests || 0}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="text-white/40 text-sm font-medium mb-1">Avg Resolution</h3>
                    <p className="text-2xl font-black text-white">{stats?.avg_response_time_ms || 0} ms</p>
                </div>
            </div>
            {stats?.top_endpoints && (
                <div className="mt-4 p-4 bg-black/40 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Top Stressed Endpoints</h4>
                    {stats.top_endpoints.map((ep, i) => (
                        <div key={i} className="flex justify-between items-center text-xs text-white/50 border-b border-white/5 pb-1">
                            <span className="font-mono">{ep.endpoint}</span>
                            <span className="font-bold text-white/80">{ep.hits} hits</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
