import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


export const actionGetListExamEventUsers = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/user-exam-events/list-exam-event-users', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListExamEventUsers(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListExamEventUsers:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailExamEventUser = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/exam-event-users/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailExamEventUser:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExamEventUser(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateStatusExamEventUser = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/exam-event-users/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailExamEventUser(response.data));
        await dispatch(actionGetListExamEventUsers());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateStatusExamEventUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateExamEventUser = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/exam-event-users', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExamEventUsers());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateExamEventUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteExamEventUser = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/app/exam-event-users/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListExamEventUsers());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteExamEventUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailExamEventUser = (payload) => ({
    type: Types.DETAIL_EXAM_EVENT_USER,
    payload,
});

export const actionSaveListExamEventUsers = (payload) => ({
    type: Types.LIST_EXAM_EVENT_USERS,
    payload,
})