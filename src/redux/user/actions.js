import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";

export const actionGetListUsers = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/users/list-users', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListUser(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListUsers:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetListUsersToAdd = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/class-users/list-users-to-add', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListUsersToAddClass(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListUsersToAdd:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

// Lấy thông tin chi tiết User theo ID
export const actionGetDetailUser = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/users/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        // Lưu dữ liệu user vào Redux
        await dispatch(actionSaveDetailUser(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

// Cập nhật thông tin User theo ID
export const actionUpdateUser = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/users/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailUser(response.data));
        await dispatch(actionGetListUsers());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};


// Action lưu thông tin chi tiết User vào Redux
export const actionSaveDetailUser = (payload) => ({
    type: Types.DETAIL_USER,
    payload,
});

export const actionSaveListUser = (payload) => ({
    type: Types.LIST_USER,
    payload,
})

export const actionSaveListUsersToAddClass = (payload) => ({
    type: Types.LIST_USERS_TO_ADD_CLASS,
    payload,
})