import toast from 'react-hot-toast';

// 1. Pull the Render backend URL from your .env, with a local fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Remove a trailing slash if it exists on the base URL to prevent double slashes (//api)
const CLEAN_BACKEND_URL = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
const API_BASE = `${CLEAN_BACKEND_URL}/api`;

export const getToken = () => localStorage.getItem('courseforge_token');

/**
 * Core internal fetch wrapper with error handling and automatic JWT attachment.
 */
const apiFetch = async (endpoint, options = {}, isFormData = false) => {
    const token = getToken();

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-User-Action': 'clicked',
        ...options.headers,
    };

    // Clean up slash formatting dynamically
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Build the absolute pathway to your Render server
    const path = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;
    
    try {
        const res = await fetch(path, { ...options, headers });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const reqId = err.request_id || res.headers.get('X-Request-ID') || 'unknown';
            const errorDetail = err.detail || err.error || 'Server Fault';
            const detailStr = Array.isArray(errorDetail)
                ? errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
                : errorDetail;
                
            const error = new Error(`[ReqID: ${reqId}] ${detailStr}`);
            error.response = { data: err, status: res.status };
            
            // Global Toast for "No Silent Failures"
            toast.error(detailStr, { id: reqId }); 
            
            throw error;
        }

        return res.json();
    } catch (networkError) {
        if (!networkError.response) {
            toast.error("Neural Link Fractured. Check connection.", { id: 'network-error' });
        }
        throw networkError;
    }
};

/**
 * Helper for endpoints that return file downloads (blob responses).
 */
const apiFetchBlob = async (endpoint) => {
    const token = getToken();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const path = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;
    
    const res = await fetch(path, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
        throw new Error('Download failed');
    }
    return res;
};

export const userAPI = {
    getStats: () => apiFetch('/user/stats'),
    getLearningSummary: () => apiFetch('/user/summary'),
    getLeaderboard: () => apiFetch('/user/leaderboard'),
    getKnowledgeMap: () => apiFetch('/user/knowledge-map'),
    updateProfile: (name, age) => apiFetch('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, age }),
    }),
    changePassword: (currentPassword, newPassword) => apiFetch('/user/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),
    getDueFlashcards: () => apiFetch('/user/flashcards/due'),
    reviewFlashcard: (flashcardId, quality) => apiFetch(`/user/flashcards/${flashcardId}/review?quality=${quality}`, {
        method: 'POST'
    }),
    initCourseSrs: (courseId) => apiFetch(`/user/flashcards/init/${courseId}`, {
        method: 'POST'
    }),
    getActivityData: () => apiFetch('/user/activity-data'),
};

export const authAPI = {
    register: (name, email, age, password) =>
        apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, age, password }),
        }),

    login: (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        return fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        }).then(async res => {
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const reqId = err.request_id || res.headers.get('X-Request-ID') || 'unknown';
                const errorDetail = err.detail || err.error || 'Login failed';
                const detailStr = Array.isArray(errorDetail)
                    ? errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
                    : errorDetail;
                    
                throw new Error(`[ReqID: ${reqId}] ${detailStr}`);
            }
            return res.json();
        });
    },
};

export const courseAPI = {
    generate: (topic, difficulty) => apiFetch('/courses/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, difficulty }),
    }),
    generateFromFile: (file, difficulty) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('difficulty', difficulty);
        return apiFetch('/courses/generate/file', {
            method: 'POST',
            body: formData,
        }, true);
    },
    generateFromUrl: (url, difficulty) => {
        const formData = new FormData();
        formData.append('url', url);
        formData.append('difficulty', difficulty);
        return apiFetch('/courses/generate/url', {
            method: 'POST',
            body: formData,
        }, true);
    },
    getMyCourses: () => apiFetch('/courses/my-courses'),
    getCourse: (courseId) => apiFetch(`/courses/${courseId}`),
    getTopic: (topicId, autoLevel = false, force = false) => {
        let url = `/courses/topics/${topicId}?`;
        if (autoLevel) url += 'auto_level=true&';
        if (force) url += 'force=true&';
        return apiFetch(url.endsWith('&') || url.endsWith('?') ? url.slice(0, -1) : url);
    },
    completeTopic: (topicId) => apiFetch(`/courses/topics/${topicId}/complete`, {
        method: 'POST'
    }),
    getProgress: (courseId) => apiFetch(`/courses/${courseId}/progress`),
    deleteCourse: (courseId) => apiFetch(`/courses/${courseId}`, {
        method: 'DELETE'
    }),
    getSchedule: (courseId) => apiFetch(`/courses/${courseId}/schedule`),
    chatWithMentor: (courseId, payload) => apiFetch(`/courses/${courseId}/mentor`, {
        method: 'POST',
        body: JSON.stringify(payload)
    }),
    getLab: (topicId) => apiFetch(`/courses/topics/${topicId}/lab`),
    submitLab: (topicId, payload) => apiFetch(`/courses/topics/${topicId}/lab/submit`, {
        method: 'POST',
        body: JSON.stringify(payload)
    }),
    submitQuiz: (topicId, score) => apiFetch(`/courses/topics/${topicId}/quiz/submit`, {
        method: 'POST',
        body: JSON.stringify({ score })
    }),
    getPodcast: (courseId) => apiFetch(`/courses/${courseId}/podcast`),
};

export const searchAPI = {
    search: (query) => apiFetch(`/search?q=${encodeURIComponent(query)}`),
};

export const exportAPI = {
    downloadMarkdown: async (courseId) => {
        const res = await apiFetchBlob(`/export/${courseId}/export/markdown`);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `course_${courseId}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },
    getJson: (courseId) => apiFetch(`/export/${courseId}/export/json`),
};

export const discussionAPI = {
    getDiscussions: (topicId) => apiFetch(`/discussions/${topicId}`),
    postDiscussion: (topicId, content, parentId = null) => apiFetch(`/discussions/${topicId}`, {
        method: 'POST',
        body: JSON.stringify({ content, parent_id: parentId }),
    }),
    upvoteDiscussion: (messageId) => apiFetch(`/discussions/${messageId}/upvote`, {
        method: 'POST'
    }),
};

export const sandboxAPI = {
    runCode: (code, language) => apiFetch(`/sandbox/run`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
    }),
};

/**
 * Default export providing an intuitive axios-like helper object mapping
 */
const api = {
    get: async (url, options) => {
        const data = await apiFetch(url, { ...options, method: 'GET' });
        return { data };
    },
    post: async (url, body, options) => {
        const data = await apiFetch(url, { ...options, method: 'POST', body: JSON.stringify(body) });
        return { data };
    },
    put: async (url, body, options) => {
        const data = await apiFetch(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
        return { data };
    },
    delete: async (url, options) => {
        const data = await apiFetch(url, { ...options, method: 'DELETE' });
        return { data };
    },
    fetch: apiFetch
};

export default api;