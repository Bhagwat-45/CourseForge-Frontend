import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[CRITICAL_UI_ERROR]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white/[0.03] border border-red-500/20 rounded-[2.5rem] p-10 text-center relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
             
             <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                <AlertCircle className="w-10 h-10 text-red-500" />
             </div>

             <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Index Out of Bounds</h2>
             <p className="text-white/40 text-sm leading-relaxed mb-10">
                A critical neural mismatch occurred in the <span className="text-red-400 font-mono">CourseForge</span> runtime. 
                The interface has been isolated to prevent further data drift.
             </p>

             <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Attempt Re-Sync
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Return to Dashboard
                </button>
             </div>

             {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 text-[10px] font-mono text-red-400/50 bg-red-500/5 p-4 rounded-xl text-left overflow-auto max-h-32 border border-red-500/10">
                   {this.state.error?.toString()}
                </div>
             )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
