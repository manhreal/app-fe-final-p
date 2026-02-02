// src/lib/validations.js

// Validate name - for Ant Design Form
export const validateName = (_, value) => {
    if (!value || !value.trim()) {
        return Promise.reject(new Error('Vui lòng nhập họ và tên'));
    }
    if (value.trim().length < 2) {
        return Promise.reject(new Error('Họ và tên phải có ít nhất 2 ký tự'));
    }
    if (!/^[\p{L}\s]+$/u.test(value.trim())) {
        return Promise.reject(new Error('Họ và tên chỉ được chứa chữ cái và khoảng trắng'));
    }
    return Promise.resolve();
};

// Validate email - for Ant Design Form
export const validateEmail = (_, value) => {
    if (!value || !value.trim()) {
        return Promise.reject(new Error('Vui lòng nhập email'));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
        return Promise.reject(new Error('Email không hợp lệ'));
    }
    return Promise.resolve();
};

// Validate mobile number - for Ant Design Form
export const validateMobile = (_, value) => {
    // Mobile là optional, nếu không nhập thì pass
    if (!value || !value.trim()) {
        return Promise.resolve();
    }
    
    const mobileRegex = /^[0-9]{10,11}$/;
    const cleanedMobile = value.replace(/\s/g, '');
    
    if (!mobileRegex.test(cleanedMobile)) {
        return Promise.reject(new Error('Số điện thoại hợp lệ gồm 10 hoặc 11 chữ số'));
    }
    return Promise.resolve();
};

// Validate password - for Ant Design Form
export const validatePassword = (_, value) => {
    if (!value) {
        return Promise.reject(new Error('Vui lòng nhập mật khẩu'));
    }
    if (value.length < 6) {
        return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự'));
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return Promise.reject(new Error('Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số'));
    }
    return Promise.resolve();
};

// Helper functions - trả về string (dùng cho validate thủ công)
export const checkName = (name) => {
    if (!name || !name.trim()) return 'Nhập họ và tên';
    if (name.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
    if (!/^[\p{L}\s]+$/u.test(name.trim())) return 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
    return '';
};

export const checkEmail = (email) => {
    if (!email || !email.trim()) return 'Nhập email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Email không hợp lệ';
    return '';
};

export const checkMobile = (mobile) => {
    if (!mobile || !mobile.trim()) return '';
    const mobileRegex = /^[0-9]{10,11}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
        return 'Số điện thoại hợp lệ gồm 10 hoặc 11 chữ số';
    }
    return '';
};

export const checkPassword = (password) => {
    if (!password) return 'Vui lòng nhập mật khẩu';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số';
    }
    return '';
};