import { Types } from './types'

const initialState = {
    dataListExams: null,
    dataDetailExam: null,
    loading: false
}

const examReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_EXAMS:
            return {
                ...state,
                dataListExams: action.payload
            }
        case Types.DETAIL_EXAM:
            return {
                ...state,
                dataDetailExam: action.payload
            }
        default:
            return state
    }
}

export default examReducer