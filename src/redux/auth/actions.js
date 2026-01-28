import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { actionLoading, actionSetError } from '../home/actions';
import { getToken } from '../../lib/common'

export const actionGetProfile = () => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();
        console.log("token", token)
        const response = await fetchApi('/users/profile', 'get', null, {
            Authorization: `Bearer ${token}`,
        });

        dispatch(actionLoading(false));

        if (response.code !== 200) {
            checkErrorCode(response.code, response.message);
            return null;
        }

        return response.data; 
    } catch (error) {
        console.error("Error in actionGetProfile:", error);
        dispatch(actionLoading(false));
        dispatch(actionSetError(error?.message || error));
        return null;
    }
};

export const actionUpdateProfile = (payload) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const token = getToken();

        const response = await fetchApi('/users/profile', 'put', payload, {
            Authorization: `Bearer ${token}`,
        });

        dispatch(actionLoading(false));

        if (response.code !== 200) {
            checkErrorCode(response.code, response.message);
            return null;
        }

        const updatedUser = response.data;

        const safeUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
        };

        localStorage.setItem('user', JSON.stringify(safeUser));
        dispatch(actionLoginSuccess({ token, user: safeUser }));

        return updatedUser;
    } catch (error) {
        console.error("Error in actionUpdateProfile:", error);
        dispatch(actionLoading(false));
        dispatch(actionSetError(error?.message || error));
        return null;
    }
};

export const checkErrorCode = (code, message) => {
    switch (code) {
        case 401:
            localStorage.removeItem('token');
            window.location.href = '/auth-page';
            break;
        case 403:
            alert('Bạn không có quyền truy cập');
            break;
        default:
            alert(message || 'Có lỗi xảy ra');
    }
};

export const actionLogin = (payload) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const response = await fetchApi('/auth/login', 'post', payload);

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        const token = response.data.token;
        const user = response.data.user;

        const safeUser = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
            role_id: user.role_id,
            permissions: user.permissions || []
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(safeUser));

        dispatch(actionLoginSuccess({ token, user: safeUser }));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionLogin:", error);
        dispatch(actionLoading(false));
        dispatch(actionSetError(error?.message || error));
    }
};

export const actionLoginAdmin = (payload) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));
        const response = await fetchApi('/auth/login-admin', 'post', payload);

        if (response.code !== 200) {
            dispatch(actionLoading(false));
            return checkErrorCode(response?.code, response?.message);
        }

        const token = response.data.token;
        const user = response.data.user;

        const safeUser = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
            role_id: user.role_id,
            permissions: user.permissions || []
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(safeUser));

        dispatch(actionLoginSuccess({ token, user: safeUser }));
        dispatch(actionLoading(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionLogin:", error);
        dispatch(actionLoading(false));
        dispatch(actionSetError(error?.message || error));
    }
};

export const actionSignUp = (payload) => async (dispatch) => {
    try {
        dispatch(actionLoading(true));

        const response = await fetchApi('/users', 'post', payload); 

        dispatch(actionLoading(false));

        if (response.code !== 200) {
            checkErrorCode(response.code, response.message);
            return null;
        }
        return response.data;
    } catch (error) {
        console.error("Error in actionSignUp:", error);
        dispatch(actionLoading(false));
        dispatch(actionSetError(error?.message || error));
        return null;
    }
};



export const actionLoginSuccess = (payload) => ({
    type: Types.LOGIN_SUCCESS,
    payload
});


export const actionLogout = () => (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: Types.LOGOUT });
    window.location.href = '/auth-page';
};