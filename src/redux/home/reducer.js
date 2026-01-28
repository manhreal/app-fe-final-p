import { Types } from './types';

const initialState = {
    loading: false,
    error: null
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case Types.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case Types.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export default homeReducer;