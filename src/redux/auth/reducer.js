import { Types } from './types';

const userFromStorage = localStorage.getItem('user');

const initialState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token')
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                token: action.payload.token
            };
        case Types.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                token: null
            };
        case Types.SET_USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;