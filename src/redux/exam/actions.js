import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";

export const actionGetListExams = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/exams', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListExams(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListExams:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailExam = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/exams/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailExam:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExam(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateExam = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/exams/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExam(response.data));
        await dispatch(actionGetListExams());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateExam = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/exams', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExams());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteExam = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/exams/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExams());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteExam:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionRemoveExamFromEvent = (examId, examEventId) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/exams/${examId}/remove-from-event/${examEventId}`, 'delete', {}, {
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
        console.error("Error in actionRemoveExamFromEvent:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailExam = (payload) => ({
    type: Types.DETAIL_EXAM,
    payload,
});

export const actionSaveListExams = (payload) => ({
    type: Types.LIST_EXAMS,
    payload,
})