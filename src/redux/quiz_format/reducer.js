import { Types } from './types'

const initialState = {
    dataListQuizFormats: null,
    dataDetailQuizFormat: null,
    loading: false
}

const quizFormatReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_QUIZ_FORMATS:
            return {
                ...state,
                dataListQuizFormats: action.payload
            }
        case Types.DETAIL_QUIZ_FORMAT:
            return {
                ...state,
                dataDetailQuizFormat: action.payload
            }
        default:
            return state
    }
}

export default quizFormatReducer