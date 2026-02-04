import { Types } from './types'

const initialState = {
    dataListClassUsers: null,
    dataDetailClassUser: null,
    loading: false
}

const examEventUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_EXAM_EVENT_USERS:
            return {
                ...state,
                dataListClassUsers: action.payload
            }
        case Types.DETAIL_EXAM_EVENT_USER:
            return {
                ...state,
                dataDetailClassUser: action.payload
            }
        default:
            return state
    }
}

export default examEventUserReducer