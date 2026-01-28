import { message } from "antd"
import { fetchApiUpload } from "../../app/lib/api"
import { actionLoading } from '../home/actions'

// Hàm helper chung để xử lý upload
const handleUpload = async (dispatch, payload, type, successMessage) => {
    try {
        dispatch(actionLoading(true));

        const formData = new FormData();
        formData.append('type', type);

        // Xử lý payload linh hoạt
        if (payload instanceof FormData) {
            for (let [key, value] of payload.entries()) {
                if (key !== 'type') {
                    formData.append(key, value);
                }
            }
        } else if (payload.file) {
            formData.append('file', payload.file);
            if (payload.oldImage) {
                formData.append('oldImage', payload.oldImage);
            }
            if (payload.customFilename) {
                formData.append('customFilename', payload.customFilename);
            }
        } else {
            formData.append('file', payload);
        }

        const response = await fetchApiUpload(`/api/uploadOneImage`, "post", formData);

        if (response.code === 400) {
            message.error(response?.message || 'Upload failed');
            setTimeout(() => {
                message.destroy();
            }, 2000);
            dispatch(actionLoading(false));
            return null;
        }

        if (response.code === 200 && response.signal === 1) {
            message.success(successMessage);
            setTimeout(() => {
                message.destroy();
            }, 1500);
        }

        dispatch(actionLoading(false));
        return response?.data?.filePaths?.file;
    } catch (error) {
        dispatch(actionLoading(false));
        console.error(`Upload ${type} error:`, error);
        message.error(error?.message || 'Upload failed');
        setTimeout(() => {
            message.destroy();
        }, 2000);
        return null;
    }
};

// Các action creators sử dụng hàm helper
export const uploadImageProfile = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'profile', 'Profile image uploaded successfully');
};

export const uploadImageNews = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'news', 'News image uploaded successfully');
};

export const uploadImageClass = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'class', 'Class image uploaded successfully');
};

export const uploadImageExamEvent = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'exam_event', 'Exam event image uploaded successfully');
};

export const uploadImageExam = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'exam', 'Exam image uploaded successfully');
};

export const uploadClassMaterial = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'material', 'Class material uploaded successfully');
};

export const uploadImageQuiz = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'quiz', 'Quiz image uploaded successfully');
}

export const uploadFileQuizAI = (payload) => async (dispatch) => {
    return handleUpload(dispatch, payload, 'ai_analyze', 'Quiz AI file uploaded successfully');
}

// Hàm generic nếu cần upload với type động
export const uploadImage = (payload, type) => async (dispatch) => {
    const successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`;
    return handleUpload(dispatch, payload, type, successMessage);
};