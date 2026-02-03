import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


export const actionGetListClassUsers = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/user-classes/list-class-users', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListClassUsers(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListClassUsers:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailClassUser = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/class-users/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailClassUser:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailClassUser(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateStatusClassUser = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/app/class-users/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailClassUser(response.data));
        await dispatch(actionGetListClassUsers());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateStatusClassUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateClassUser = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/app/class-users', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListClassUsers());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateClassUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteClassUser = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/app/class-users/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListClassUsers());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteClassUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailClassUser = (payload) => ({
    type: Types.DETAIL_CLASS_USER,
    payload,
});

export const actionSaveListClassUsers = (payload) => ({
    type: Types.LIST_CLASS_USERS,
    payload,
})