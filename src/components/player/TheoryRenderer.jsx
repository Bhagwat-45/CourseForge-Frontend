import React from 'react';
import { motion } from 'framer-motion';

const TheoryRenderer = ({ content }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert max-w-none"
        >
            <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed">
                {/* For now, we'll just split by newlines and render paragraphs since we haven't installed react-markdown yet.
                    In a production environment, we would use <ReactMarkdown>{content.text}</ReactMarkdown> */}
                {content.text?.split('\n').map((line, i) => (
                    line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                ))}
            </div>
        </motion.div>
    );
};

export default TheoryRenderer;
