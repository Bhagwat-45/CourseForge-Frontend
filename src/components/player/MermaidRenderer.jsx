import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Maximize2 } from 'lucide-react';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    themeVariables: {
        primaryColor: '#0ea5e9',
        primaryTextColor: '#fff',
        primaryBorderColor: '#0ea5e9',
        lineColor: '#38bdf8',
        secondaryColor: '#0c4a6e',
        tertiaryColor: '#020617'
    }
});

const MermaidRenderer = ({ code, title }) => {
    const mermaidRef = useRef(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (mermaidRef.current && code) {
                try {
                    const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
                    // Use the modern render API to get SVG string
                    const { svg } = await mermaid.render(id, code);
                    mermaidRef.current.innerHTML = svg;
                } catch (err) {
                    console.error("Mermaid render failed:", err);
                    // Fallback: show raw code if rendering fails
                    mermaidRef.current.innerText = code;
                }
            }
        };
        renderDiagram();
    }, [code]);

    if (!code) return null;

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden group">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-black tracking-widest uppercase text-white/50">{title || 'Architecture Diagram'}</span>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white">
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>
            <div className="p-8 flex items-center justify-center min-h-[300px] overflow-x-auto bg-grid-white/[0.02]">
                <div ref={mermaidRef} className="flex justify-center w-full">
                    {/* SVG content will be injected here */}
                </div>
            </div>
        </div>
    );
};

export default MermaidRenderer;
