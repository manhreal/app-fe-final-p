import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


// Lấy danh sách lớp học user đang tham gia
export const actionGetMyClasses = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/user-classes/my-classes', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListUserClasses(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetMyClasses:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

// Kiểm tra lớp học theo code
export const actionGetClassByCode = (invite_code) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/user-classes/check-class-by-code`, 'get', { invite_code }, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveClassByCode(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetClassByCode:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Gửi yêu cầu tham gia lớp học
export const actionJoinClass = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi('/app/user-classes/join-class', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionJoinClass:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Rời khỏi lớp học (tự xóa)
export const actionLeaveClass = (classUserId) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/user-classes/leave-class/${classUserId}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionLeaveClass:", error);
        dispatch(actionLoading(false));
        throw error;
    }
};

// Clear class by code data
export const actionClearClassByCode = () => ({
    type: Types.CLEAR_CLASS_BY_CODE,
});

export const actionSaveListUserClasses = (payload) => ({
    type: Types.LIST_USER_CLASSES,
    payload,
});

export const actionSaveClassByCode = (payload) => ({
    type: Types.DETAIL_CLASS_BY_CODE,
    payload,
});