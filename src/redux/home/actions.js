import { Types } from './types';

export const actionLoading = (loading) => ({
    type: Types.SET_LOADING,
    payload: loading
});

export const actionSetError = (error) => ({
    type: Types.SET_ERROR,
    payload: error
});

export const actionClearError = () => ({
    type: Types.CLEAR_ERROR
});