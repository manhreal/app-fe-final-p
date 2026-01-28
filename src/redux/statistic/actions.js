import { fetchApi } from "../../app/lib/api";
import { Types } from './types';
import { getToken } from '../../lib/common';
import { checkErrorCode } from "../auth/actions";

// Loading Actions
export const actionLoadingUsers = (payload) => ({
    type: Types.LOADING_USERS,
    payload,
});

export const actionLoadingQuizs = (payload) => ({
    type: Types.LOADING_QUIZS,
    payload,
});

export const actionLoadingExams = (payload) => ({
    type: Types.LOADING_EXAMS,
    payload,
});

export const actionLoadingClasses = (payload) => ({
    type: Types.LOADING_CLASSES,
    payload,
});

// Get Total Users
export const actionGetTotalUsers = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoadingUsers(true));
        const token = getToken();
        const response = await fetchApi('/admin/statistics/users', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoadingUsers(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveTotalUsers(response.data));
        dispatch(actionLoadingUsers(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetTotalUsers:", error);
        dispatch(actionLoadingUsers(false));
        alert(error?.message || error);
    }
}

// Get Total Quizs
export const actionGetTotalQuizs = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoadingQuizs(true));
        const token = getToken();
        const response = await fetchApi('/admin/statistics/quizs', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });

        if (response.code !== 200) {
            dispatch(actionLoadingQuizs(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveTotalQuizs(response.data));
        dispatch(actionLoadingQuizs(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetTotalQuizs:", error);
        dispatch(actionLoadingQuizs(false));
        alert(error?.message || error);
    }
}

// Get Total Exams
export const actionGetTotalExams = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoadingExams(true));
        const token = getToken();
        const response = await fetchApi('/admin/statistics/exams', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });
        
        if (response.code !== 200) {
            dispatch(actionLoadingExams(false));
            return checkErrorCode(response?.code, response?.message);
        }

        await dispatch(actionSaveTotalExams(response.data));
        dispatch(actionLoadingExams(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetTotalExams:", error);
        dispatch(actionLoadingExams(false));
        alert(error?.message || error);
    }
}

// Get Total Classes
export const actionGetTotalClasses = (payload = {}) => async (dispatch) => {
    try {
        dispatch(actionLoadingClasses(true));
        const token = getToken();
        const response = await fetchApi('/admin/statistics/classes', 'get', payload, {
            Authorization: `Bearer ${token}`,
        });
        
        if (response.code !== 200) {
            dispatch(actionLoadingClasses(false));
            return checkErrorCode(response?.code, response?.message);
        }
        
        await dispatch(actionSaveTotalClasses(response.data));
        dispatch(actionLoadingClasses(false));
        return response.data;
    } catch (error) {
        console.error("Error in actionGetTotalClasses:", error);
        dispatch(actionLoadingClasses(false));
        alert(error?.message || error);
    }
}

// Save Actions
export const actionSaveTotalUsers = (payload) => ({
    type: Types.TOTAL_USERS,
    payload,
});

export const actionSaveTotalQuizs = (payload) => ({
    type: Types.TOTAL_QUIZS,
    payload,
});

export const actionSaveTotalExams = (payload) => ({
    type: Types.TOTAL_EXAMS,
    payload,
});

export const actionSaveTotalClasses = (payload) => ({
    type: Types.TOTAL_CLASSES,
    payload,
});