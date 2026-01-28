import { Types } from './types';

const initialState = {
    dataTotalUsers: null,
    dataTotalQuizs: null,
    dataTotalExams: null,
    dataTotalClasses: null,
    loadingUsers: false,
    loadingQuizs: false,
    loadingExams: false,
    loadingClasses: false,
};

const statisticReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.TOTAL_USERS:
            return {
                ...state,
                dataTotalUsers: action.payload
            };
        case Types.TOTAL_QUIZS:
            return {
                ...state,
                dataTotalQuizs: action.payload
            };
        case Types.TOTAL_EXAMS:
            return {
                ...state,
                dataTotalExams: action.payload
            };
        case Types.TOTAL_CLASSES:
            return {
                ...state,
                dataTotalClasses: action.payload
            };
        case Types.LOADING_USERS:
            return {
                ...state,
                loadingUsers: action.payload
            };
        case Types.LOADING_QUIZS:
            return {
                ...state,
                loadingQuizs: action.payload
            };
        case Types.LOADING_EXAMS:
            return {
                ...state,
                loadingExams: action.payload
            };
        case Types.LOADING_CLASSES:
            return {
                ...state,
                loadingClasses: action.payload
            };
        default:
            return state;
    }
};

export default statisticReducer;