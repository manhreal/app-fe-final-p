import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";

export const actionGetListQuizs = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/quizs', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListQuizs(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListQuizs:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailQuiz = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/quizs/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailQuiz:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailQuiz(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateQuiz = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/quizs/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailQuiz(response.data));
        await dispatch(actionGetListQuizs());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateQuiz = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/quizs', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListQuizs());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteQuiz = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/quizs/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListQuizs());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteQuiz:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

// AI Import Actions
export const actionAIAnalyzeFile = (analyzeData) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        // Gọi API analyze với data từ file đã upload
        const response = await fetchApi('/admin/quizs/ai-import/analyze', 'post', analyzeData, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveAIAnalyzeResult(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionAIAnalyzeFile:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
        throw error;
    }
};

export const actionBatchCreateQuizzes = (quizzes) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi('/admin/quizs/ai-import/batch-create', 'post', {
            quizzes
        }, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionGetListQuizs());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionBatchCreateQuizzes:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
        throw error;
    }
};

export const actionSaveDetailQuiz = (payload) => ({
    type: Types.DETAIL_QUIZ,
    payload,
});

export const actionSaveListQuizs = (payload) => ({
    type: Types.LIST_QUIZS,
    payload,
})

export const actionSaveAIAnalyzeResult = (payload) => ({
    type: Types.AI_ANALYZE_RESULT,
    payload,
});