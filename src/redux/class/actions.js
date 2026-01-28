import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


export const actionGetListClasses = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/classes', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListClasses(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListClasses:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailClass = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/classes/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });
        console.log("Response in actionGetDetailClass:", response);
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailClass(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailUser:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdateClass = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/classes/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailClass(response.data));
        await dispatch(actionGetListClasses());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdateClass:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreateClass = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/classes', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListClasses());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreateClass:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeleteClass = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/classes/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListClasses());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeleteClass:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailClass = (payload) => ({
    type: Types.DETAIL_CLASS,
    payload,
});

export const actionSaveListClasses = (payload) => ({
    type: Types.LIST_CLASSES,
    payload,
})