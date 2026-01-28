import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading } from '../home/actions';
import { getToken } from '../../lib/common'
import { checkErrorCode } from "../auth/actions";


export const actionFetchMyPermissions = () => async (dispatch) => {
    try {
        const token = getToken();
        const response = await fetchApi(
            '/admin/permissions/roles/for-user',
            'get',
            null,
            { Authorization: `Bearer ${token}` }
        );

        console.log("Permissions response:", response);
        if (response.code === 200) {
            // Lưu toàn bộ data (bao gồm cả permissions array)
            localStorage.setItem('permissions', JSON.stringify(response.data));
            dispatch(actionSaveUserPermissions(response.data));
        }
    } catch (error) {
        console.error("Error fetching permissions:", error);
    }
};
export const actionGetListPermissions = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/permissions/permissions', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveListPermissions(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetListPermissions:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetPermissionTree = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/permissions/permissions/tree', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSavePermissionTree(response.data));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetPermissionTree:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionGetDetailPermission = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/permissions/permissions/${id}`, 'get', {}, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailPermission(response.data));

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetDetailPermission:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionUpdatePermission = (id, payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi(`/admin/permissions/permissions/${id}`, 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveDetailPermission(response.data));
        await dispatch(actionGetListPermissions());

        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionUpdatePermission:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
};

export const actionCreatePermission = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi('/admin/permissions/permissions', 'post', payload, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListPermissions());
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionCreatePermission:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionDeletePermission = (id) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        const response = await fetchApi(`/admin/permissions/permissions/${id}`, 'delete', {}, {
            Authorization: `Bearer ${token}`,
        });
        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }
        await dispatch(actionGetListPermissions());
        dispatch(actionLoading(false));
        return response.data;
    }
    catch (error) {
        console.error("Error in actionDeletePermission:", error);
        dispatch(actionLoading(false));
        alert(error?.message || error);
    }
}

export const actionSaveDetailPermission = (payload) => ({
    type: Types.DETAIL_PERMISSION,
    payload,
});

export const actionSaveListPermissions = (payload) => ({
    type: Types.LIST_PERMISSIONS,
    payload,
})

export const actionSavePermissionTree = (payload) => ({
    type: Types.PERMISSION_TREE,
    payload,
})

export const actionSaveUserPermissions = (payload) => ({
    type: Types.USER_PERMISSIONS,
    payload,
})