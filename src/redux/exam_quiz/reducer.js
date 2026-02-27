import { Types } from './types'

const initialState = {
    dataListExamQuizs: null,
    dataListExamQuizsForPreview: null,
    dataDetailExamQuiz: null,
    loading: false
}

const examQuizReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_EXAM_QUIZS:
            return {
                ...state,
                dataListExamQuizs: action.payload
            }
        case Types.LIST_EXAM_QUIZS_FOR_PREVIEW:
            return {
                ...state,
                dataListExamQuizsForPreview: action.payload
            }
        case Types.DETAIL_EXAM_QUIZ:
            return {
                ...state,
                dataDetailExamQuiz: action.payload
            }
        default:
            return state
    }
}

export default examQuizReducer