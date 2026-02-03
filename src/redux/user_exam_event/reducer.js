import { Types } from './types'

const initialState = {
    dataListUserExamEvents: null,
    dataDetailExamEventByCode: null,
    loading: false
}

const userExamEventReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_USER_EXAM_EVENTS:
            return {
                ...state,
                dataListUserExamEvents: action.payload
            }
        case Types.DETAIL_EXAM_EVENT_BY_CODE:
            return {
                ...state,
                dataDetailExamEventByCode: action.payload
            }
        case Types.CLEAR_EXAM_EVENT_BY_CODE:
            return {
                ...state,
                dataDetailExamEventByCode: null
            }
        default:
            return state
    }
}

export default userExamEventReducer