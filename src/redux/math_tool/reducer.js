import { MathTypes } from './types';

const initialState = {
    loading: false,
    error: null,
    result: null 
};

const mathReducer = (state = initialState, action) => {
    switch (action.type) {
        case MathTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case MathTypes.SET_ERROR:
            return { ...state, error: action.payload };
        case MathTypes.SAVE_RESULT:
            return { ...state, result: action.payload, error: null };
        case MathTypes.CLEAR_RESULT: 
            return { ...state, result: null };
        default:
            return state;
    }
};

export default mathReducer;
