import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, RefreshCw, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { sandboxAPI } from '../../lib/api';

const CodePlayground = ({ 
    initialCode = '', 
    initialLanguage = 'python', 
    title = 'Interactive Code Playground',
    onChange
}) => {
    const [code, setCode] = useState(initialCode);
    // ... rest of the state ...

    const handleCodeChange = (val) => {
        const newCode = val || '';
        setCode(newCode);
        if (onChange) onChange(newCode);
    };
    const [language, setLanguage] = useState(initialLanguage);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [runStatus, setRunStatus] = useState(null); // 'success', 'error', null

    // Reset when initial props change
    useEffect(() => {
        setCode(initialCode);
        setLanguage(initialLanguage);
        setOutput('');
        setError('');
        setRunStatus(null);
    }, [initialCode, initialLanguage]);

    const handleRun = async () => {
        if (!code.trim()) return;
        
        setIsRunning(true);
        setOutput('');
        setError('');
        setRunStatus(null);

        try {
            const result = await sandboxAPI.runCode(code, language);
            
            if (result.success) {
                setOutput(result.stdout || 'Program exited successfully with no output.');
                setRunStatus('success');
            } else {
                setError(result.stderr || result.stdout || 'Execution failed.');
                setRunStatus('error');
            }
        } catch (err) {
            setError(err.message || 'Failed to connect to the execution server.');
            setRunStatus('error');
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        setCode(initialCode);
        setOutput('');
        setError('');
        setRunStatus(null);
    };

    const getLanguageLabel = (lang) => {
        if (lang === 'python') return 'Python 3';
        if (lang === 'javascript' || lang === 'js') return 'Node.js';
        return lang;
    };

    return (
        <div className="my-8 rounded-xl overflow-hidden border border-white/10 bg-[#0f1117] shadow-xl flex flex-col">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#151821] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium text-white/90 text-sm">{title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-white/50 border border-white/10 ml-2">
                        {getLanguageLabel(language)}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="p-1.5 text-white/50 hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                        title="Reset code"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !code.trim()}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isRunning || !code.trim() 
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
                        }`}
                    >
                        {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                        <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="h-[300px] w-full border-b border-white/5">
                <Editor
                    height="100%"
                    language={language === 'js' ? 'javascript' : language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleCodeChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        renderLineHighlight: "all",
                    }}
                />
            </div>

            {/* Output / Console Area */}
            {(output || error) && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex flex-col max-h-[250px] bg-[#0A0C10]"
                >
                    <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 bg-[#0f1117]">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Console Output</span>
                        {runStatus === 'success' && <div className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3"/> Success</div>}
                        {runStatus === 'error' && <div className="flex items-center gap-1 text-xs text-rose-400"><XCircle className="w-3 h-3"/> Error</div>}
                    </div>
                    
                    <div className="p-4 overflow-y-auto font-mono text-sm leading-relaxed">
                        {error ? (
                            <div className="text-rose-400 whitespace-pre-wrap">{error}</div>
                        ) : (
                            <div className="text-emerald-300/90 whitespace-pre-wrap">{output}</div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CodePlayground;
