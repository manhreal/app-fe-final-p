import { Types } from './types'

const initialState = {
    dataListQuizTypes: null,
    dataDetailQuizType: null,
    loading: false
}

const quizTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_QUIZ_TYPES:
            return {
                ...state,
                dataListQuizTypes: action.payload
            }
        case Types.DETAIL_QUIZ_TYPE:
            return {
                ...state,
                dataDetailQuizType: action.payload
            }
        default:
            return state
    }
}

export default quizTypeReducer