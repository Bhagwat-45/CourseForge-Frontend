import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCourse } from '../../lib/CourseContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useCourse();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
