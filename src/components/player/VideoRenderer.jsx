import React from 'react';
import { motion } from 'framer-motion';

const VideoRenderer = ({ content }) => {
    // Extract YouTube ID from URL if possible
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYoutubeId(content.videoUrl) || 'dQw4w9WgXcQ'; // Fallback to Rickroll if no URL

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title="Course Module Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </motion.div>
    );
};

export default VideoRenderer;
