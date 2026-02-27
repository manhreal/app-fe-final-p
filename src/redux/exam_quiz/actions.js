import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";

export const actionGetListExamQuizs = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/exam-quizs', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListExamQuizs(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListExamQuizs:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetListExamQuizsForPreview = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/exam-quizs', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetListExamQuizsForPreview:", response);

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListExamQuizsForPreview(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListExamQuizsForPreview:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailExamQuiz = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/exams/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailExamQuiz:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExamQuiz(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailExamQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

// ─── Thêm vào file redux/exam_quiz/actions.js ─────────────────────────────────
//
// actionUpdateExamQuiz: đã có sẵn, chỉ cần sửa endpoint (xem ghi chú bên dưới)
// actionUpdateExamQuizsOrder: MỚI – cập nhật thứ tự hàng loạt (batch order)
//

// ─── QUAN TRỌNG: Sửa lại actionUpdateExamQuiz cho đúng endpoint ───────────────
// Endpoint hiện tại bị SAI: `/admin/exams/${id}` → phải là `/admin/exam-quizs/${id}`
export const actionUpdateExamQuiz = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        // ✅ Đã sửa: dùng đúng endpoint exam-quiz
        const response = await fetchApi(`/admin/exam-quizs/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExamQuiz(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error('Error in actionUpdateExamQuiz:', error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

// ─── MỚI: Cập nhật thứ tự hàng loạt ──────────────────────────────────────────
/**
 * @param {Object} payload
 * @param {Array<{id: number, order_number: number}>} payload.examQuizOrders
 * @param {Object} payload.filterModal  – params để refresh lại danh sách sau khi update
 */
export const actionUpdateExamQuizsOrder = (payload) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const { examQuizOrders, filterModal } = payload;

        const response = await fetchApi(
            '/admin/exam-quizs/order/batch',
            'put',
            { examQuizOrders },
            { Authorization: `Bearer ${token}` }
        );

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        // Refresh lại danh sách sau khi cập nhật thứ tự (giống Lecture)
        await dispatch(actionGetListExamQuizs(filterModal));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error('Error in actionUpdateExamQuizsOrder:', error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionAddQuizToExam = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/exam-quizs', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExamQuizs());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionAddQuizToExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteExamQuiz = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/exam-quizs/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExamQuizs());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteExamQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionRemoveQuizFromExam = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/exam-quizs/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionRemoveQuizFromExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailExamQuiz = (payload) => ({
    type: Types.DETAIL_EXAM_QUIZ,
    payload,
});

export const actionSaveListExamQuizs = (payload) => ({
    type: Types.LIST_EXAM_QUIZS,
    payload,
});

export const actionSaveListExamQuizsForPreview = (payload) => ({
    type: Types.LIST_EXAM_QUIZS_FOR_PREVIEW,
    payload,
});