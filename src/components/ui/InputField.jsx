import React from 'react';
import { cn } from '../../lib/utils';

const InputField = ({ type = "text", placeholder, className, ...props }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={cn(
                "w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "transition-all duration-300",
                className
            )}
            {...props}
        />
    );
};

export default InputField;
