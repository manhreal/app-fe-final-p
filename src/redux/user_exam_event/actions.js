import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


// Lấy danh sách kỳ thi user đang tham gia
export const actionGetMyExamEvents = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/user-exam-events/my-exam-events', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListUserExamEvents(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetMyExamEvents:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

// Kiểm tra kỳ thi theo code
export const actionGetExamEventByCode = (invite_code) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/user-exam-events/check-exam-event-by-code`, 'get', { invite_code }, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveExamEventByCode(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetExamEventByCode:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Gửi yêu cầu tham gia kỳ thi
export const actionJoinExamEvent = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi('/app/user-exam-events/join-exam-event', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionJoinExamEvent:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Rời khỏi kỳ thi (tự xóa)
export const actionLeaveExamEvent = (classUserId) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/user-exam-events/leave-exam-event/${classUserId}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionLeaveExamEvent:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Clear exam event by code data
export const actionClearExamEventByCode = () => ({
    type: Types.CLEAR_EXAM_EVENT_BY_CODE,
});

export const actionSaveListUserExamEvents = (payload) => ({
    type: Types.LIST_USER_EXAM_EVENTS,
    payload,
});

export const actionSaveExamEventByCode = (payload) => ({
    type: Types.DETAIL_EXAM_EVENT_BY_CODE,
    payload,
});