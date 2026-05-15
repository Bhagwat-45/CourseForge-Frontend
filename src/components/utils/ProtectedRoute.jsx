import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';

/**
 * Decodes a JWT token payload without external library.
 * Returns null if the token is invalid or expired.
 */
const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const payload = JSON.parse(atob(parts[1]));
        // Check expiry — JWT `exp` is in seconds
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, logout } = useCourse();
    const token = localStorage.getItem('courseforge_token');

    // If token exists but is expired, force logout
    if (isAuthenticated && !isTokenValid(token)) {
        logout();
        return <Navigate to="/login" replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
