import React from 'react';

const StatCard = ({ title, value, icon, trend, onClick, color = 'primary' }) => (
    <div 
        onClick={onClick}
        className={`bg-[#0A0A1F]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 hover:border-${color}/20 transition-all group overflow-hidden relative cursor-pointer`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-${color}/20 group-hover:border-${color}/30 transition-all`}>
                <div className={`text-${color}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tighter">{value}</span>
                </div>
            </div>
            {trend && (
                <div className="ml-auto px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-[8px] font-black text-emerald-500">{trend}</span>
                </div>
            )}
        </div>
    </div>
);

export default StatCard;
