import { Types } from './types'

const initialState = {
    dataListExamTypes: null,
    dataDetailExamType: null,
    loading: false
}

const examTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_EXAM_TYPES:
            return {
                ...state,
                dataListExamTypes: action.payload
            }
        case Types.DETAIL_EXAM_TYPE:
            return {
                ...state,
                dataDetailExamType: action.payload
            }
        default:
            return state
    }
}

export default examTypeReducer