
import Swal from 'sweetalert2';

// Toast notification config
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

// Các hàm alert phổ biến
export const showSuccessToast = (title = 'Thành công!') => {
    return Toast.fire({
        icon: 'success',
        title
    });
};

export const showErrorToast = (title = 'Có lỗi xảy ra!') => {
    return Toast.fire({
        icon: 'error',
        title
    });
};

export const showErrorAlert = (text = 'Đã xảy ra lỗi, vui lòng thử lại') => {
    return Swal.fire({
        title: 'Lỗi!',
        text,
        icon: 'error',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#d33'
    });
};

export const showSuccessAlert = (text, options = {}) => {
    return Swal.fire({
        title: 'Thành công!',
        text,
        icon: 'success',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
        timer: 2000,
        timerProgressBar: true,
        ...options
    });
};

export const showWarningToast = (title = 'Cảnh báo!') => {
    return Toast.fire({
        icon: 'warning',
        title
    });
};

export const showInfoToast = (title = 'Thông báo') => {
    return Toast.fire({
        icon: 'info',
        title
    });
};

export const showWarningAlert = (text, title = 'Cảnh báo!', options = {}) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#f0ad4e',
        ...options
    });
};

export const showInfoAlert = (text, title = 'Thông báo', options = {}) => {
    return Swal.fire({
        title,
        text,
        icon: 'info',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
        ...options
    });
};

export const showConfirmDialog = ({
    title = 'Xác nhận',
    html = '',
    confirmButtonText = 'Xác nhận',
    cancelButtonText = 'Hủy',
    icon = 'warning'
}) => {
    return Swal.fire({
        title,
        html,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        focusCancel: true
    });
};

export const showDeleteConfirmDialog = (itemName, itemType = 'mục') => {
    return showConfirmDialog({
        title: 'Xác nhận xóa',
        html: `Bạn có chắc chắn muốn xóa ${itemType} <br><strong>"${itemName}"</strong>?`,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    });
};

export const showUpdateConfirmDialog = (itemType = 'mục') => {
    return showConfirmDialog({
        title: 'Xác nhận cập nhật',
        text: `Bạn có chắc chắn muốn cập nhật ${itemType} này không?`,
        icon: 'question',
        confirmButtonText: 'Có, cập nhật',
        cancelButtonText: 'Hủy'
    });
};

export const showToggleAllConfirmDialog = (action, itemType = 'mục', groupName = '') => {
    const actionColors = {
        'bật': '#3085d6',
        'chọn': '#3085d6',
        'tắt': '#d33',
        'bỏ chọn': '#d33'
    };
    
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    
    return Swal.fire({
        title: `${capitalizedAction} tất cả ${itemType}?`,
        text: groupName 
            ? `Bạn có chắc chắn muốn ${action} tất cả ${itemType} trong nhóm "${groupName}"?`
            : `Bạn có chắc chắn muốn ${action} tất cả ${itemType}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: actionColors[action] || '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: `Đồng ý ${action}`,
        cancelButtonText: 'Hủy bỏ',
        reverseButtons: true
    });
};

// Loading alert
export const showLoading = (title = 'Đang xử lý...') => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

export const closeLoading = () => {
    Swal.close();
};

// Export Toast cho các trường hợp custom
export { Toast };