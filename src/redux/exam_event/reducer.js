import { Types } from './types'

const initialState = {
    dataListExamEvents: null,
    dataDetailExamEvent: null,
    loading: false
}

const examEventReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_EXAM_EVENTS:
            return {
                ...state,
                dataListExamEvents: action.payload
            }
        case Types.DETAIL_EXAM_EVENT:
            return {
                ...state,
                dataDetailExamEvent: action.payload
            }
        default:
            return state
    }
}

export default examEventReducer