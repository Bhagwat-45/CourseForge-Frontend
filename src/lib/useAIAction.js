import { useState } from 'react';
import { getAuthToken } from './api'; // Ensure this matches your project's token util

/**
 * A standardized hook to manage strict AI interactions.
 * Applies a 5-second cooldown, custom security headers, and structured error boundaries.
 */
export function useAIAction() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [error, setError] = useState(null);

    const executeAI = async (endpoint, payload = {}, method = 'POST') => {
        if (cooldown || isProcessing) {
            console.warn("AI Action ignored: System is cooling down or currently processing.");
            return null;
        }

        const confirm = window.confirm("This action utilizes AI generation credits. Proceed?");
        if (!confirm) return null;

        setIsProcessing(true);
        setCooldown(true);
        setError(null);

        try {
            const token = getAuthToken();
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    // MANDATORY Security header for FastAPI middleware
                    'X-User-Action': 'clicked'
                },
                body: method === 'POST' ? JSON.stringify(payload) : null,
            });

            if (!response.ok) {
                let errData;
                try { errData = await response.json(); } catch (e) { errData = { detail: "Unknown server error." }; }
                throw new Error(errData.detail || `Error code ${response.status}`);
            }

            return await response.json();

        } catch (err) {
            console.error("[useAIAction] Error:", err.message);
            setError(err.message);
            throw err;
        } finally {
            setIsProcessing(false);
            // Engage strict 5-second cooldown
            setTimeout(() => setCooldown(false), 5000);
        }
    };

    return {
        executeAI,
        isProcessing,
        cooldown,
        error
    };
}
