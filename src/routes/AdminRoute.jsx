import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AdminRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth);

    const isAdmin = Number(user?.role_id) === 1;

    useEffect(() => {
        if (user && !isAdmin) {
            console.warn('Access denied: Admin role required');
        }
    }, [user, isAdmin]);

    if (!user) {
        return <Navigate to="/auth-page" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default AdminRoute;
