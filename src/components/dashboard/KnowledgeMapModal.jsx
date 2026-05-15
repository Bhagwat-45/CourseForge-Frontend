import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, X, Maximize2, ZoomIn, ZoomOut, MousePointer2, Sparkles, Brain } from 'lucide-react';
import ForceGraph3D from 'react-force-graph-3d';
import { userAPI } from '../../lib/api';
import { cn } from '../../lib/utils';

const KnowledgeMapModal = ({ isOpen, onClose }) => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [isLoading, setIsLoading] = useState(true);
    const fgRef = useRef();

    useEffect(() => {
        if (isOpen) {
            fetchGraph();
        }
    }, [isOpen]);

    const fetchGraph = async () => {
        try {
            setIsLoading(true);
            const data = await userAPI.getKnowledgeMap();
            setGraphData(data);
        } catch (error) {
            console.error('Failed to fetch knowledge map:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Color mapping for categories
    const getCategoryColor = (category) => {
        const colors = {
            'AI': '#7c3aed',
            'Development': '#3b82f6',
            'Design': '#ec4899',
            'Business': '#f59e0b',
            'Science': '#10b981',
            'General': '#64748b'
        };
        return colors[category] || colors.General;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10"
                >
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="relative w-full h-full bg-[#050511] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Overlay */}
                        <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-10 pointer-events-none">
                            <div className="flex items-center gap-4 pointer-events-auto">
                                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20">
                                    <Network className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter uppercase text-white">Neural Knowledge Map</h2>
                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] animate-pulse">Syncing Semantic Clusters...</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pointer-events-auto">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hidden md:flex items-center gap-3">
                                    <MousePointer2 className="w-3.5 h-3.5 text-white/20" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Drag to Rotate • Scroll to Zoom</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 bg-[#050511]/80">
                                <div className="w-20 h-20 relative">
                                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
                                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Constructing Visual Index</h3>
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Bridging hidden topical overlaps</p>
                                </div>
                            </div>
                        )}

                        {/* Force Graph */}
                        <div className="flex-1 w-full relative">
                            <ForceGraph3D
                                ref={fgRef}
                                graphData={graphData}
                                nodeLabel={(node) => `
                                    <div class="px-3 py-2 bg-black/90 border border-white/10 rounded-lg shadow-xl backdrop-blur-md">
                                        <div class="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">${node.category}</div>
                                        <div class="text-sm font-black text-white leading-tight">${node.title}</div>
                                    </div>
                                `}
                                nodeColor={(node) => getCategoryColor(node.category)}
                                nodeThreeObjectExtend={true}
                                linkWidth={0.5}
                                linkColor={() => '#ffffff20'}
                                linkDirectionalParticles={1}
                                linkDirectionalParticleWidth={1.5}
                                linkDirectionalParticleSpeed={0.005}
                                backgroundColor="#050511"
                                nodeRelSize={7}
                                onNodeClick={(node) => {
                                    // Aim at node from outside it
                                    const distance = 40;
                                    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
                                    fgRef.current.cameraPosition(
                                        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new pos
                                        node, // lookAt pos
                                        3000  // transitions duration
                                    );
                                }}
                            />
                        </div>

                        {/* Legend / Stats Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-none">
                            <div className="flex gap-4 pointer-events-auto">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Total Clusters</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-black text-white">{graphData.nodes.length}</span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Indexed</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Neural Synergy</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-black text-white">{graphData.links.length}</span>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Shared Links</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pointer-events-auto">
                                <button className="px-6 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Optimize Connections
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default KnowledgeMapModal;
