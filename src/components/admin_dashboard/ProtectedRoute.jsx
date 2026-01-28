import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../utils/permission';
import AuthError from '../../pages/AuthError/AuthError';

const ProtectedRoute = ({ children, permission, fallback }) => {
    const userPermissions = useSelector((state) => state.permissions.dataUserPermissions);

    // Nếu không có permission được chỉ định, cho phép truy cập
    if (!permission) {
        return children;
    }

    // Kiểm tra quyền
    const hasAccess = hasPermission(userPermissions, permission);

    if (!hasAccess) {
        // Sử dụng fallback component nếu có, nếu không thì dùng AuthError
        return fallback || <AuthError />;
    }

    return children;
};

export default ProtectedRoute;