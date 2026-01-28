import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";

export const actionGetListQuizDifficulties = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/quiz-difficulties', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListQuizDifficulties(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListQuizDifficulties:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailQuizDifficulty = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/quiz-difficulties/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailQuizDifficulty:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailQuizDifficulty(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailQuizDifficulty:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateQuizDifficulty = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/quiz-difficulties/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailQuizDifficulty(response.data));
        await dispatch(actionGetListQuizDifficulties());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateQuizDifficulty:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateQuizDifficulty = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/quiz-difficulties', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListQuizDifficulties());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateQuizDifficulty:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteQuizDifficulty = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/quiz-difficulties/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListQuizDifficulties());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteQuizDifficulty:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailQuizDifficulty = (payload) => ({
    type: Types.DETAIL_QUIZ_DIFFICULTY,
    payload,
});

export const actionSaveListQuizDifficulties = (payload) => ({
    type: Types.LIST_QUIZ_DIFFICULTIES,
    payload,
})