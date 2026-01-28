import { Types } from './types'

const initialState = {
    dataListQuizDifficulties: null,
    dataDetailQuizDifficulty: null,
    loading: false
}

const quizDifficultyReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_QUIZ_DIFFICULTIES:
            return {
                ...state,
                dataListQuizDifficulties: action.payload
            }
        case Types.DETAIL_QUIZ_DIFFICULTY:
            return {
                ...state,
                dataDetailQuizDifficulty: action.payload
            }
        default:
            return state
    }
}

export default quizDifficultyReducer