import { AirVent } from 'lucide-react'
import { Types } from './types'

const initialState = {
    dataListQuizs: null,
    dataDetailQuiz: null,
    aiAnalyzeResult: null,
    loading: false
}

const quizReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_QUIZS:
            return {
                ...state,
                dataListQuizs: action.payload
            }
        case Types.DETAIL_QUIZ:
            return {
                ...state,
                dataDetailQuiz: action.payload
            }
        case Types.AI_ANALYZE_RESULT:
            return {
                ...state,
                aiAnalyzeResult: action.payload
            }
        default:
            return state
    }
}

export default quizReducer