export const LIMIT_PAGE = 10;

export const API_CODES = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

export const ROUTES = {
    HOME: '/',
    LOGIN_ADMIN: '/login-admin',
    REGISTER: '/register',
    PROFILE: '/profile',
    COURSES: '/courses',
    COURSE_DETAIL: '/courses/:id'
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token không tồn tại");
    return token;
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getStatusLabel = (status, statusList = []) => {
    const statusItem = statusList.find(s => s.value === status);
    return statusItem ? statusItem.label : 'Unknown';
};

export const CLASS_STATUS = [
    { value: 1, label: 'ACTIVE' },
    { value: 0, label: 'INACTIVE' },
    { value: 2, label: 'DRAFT' }
];

export const validateImageFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: `${file.name} không phải là file ảnh hợp lệ (PNG, JPG, JPEG, WEBP)`
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            message: "Kích thước file phải nhỏ hơn 10MB!"
        };
    }

    return { isValid: true };
};

export const generateImageFileName = (prefix, name) => {
    const nameSlug = name.toLowerCase().replace(/\s+/g, '-');
    const timestamp = new Date().getTime();
    return `${prefix}-${nameSlug}-${timestamp}`;
};