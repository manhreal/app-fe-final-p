import { Types } from './types'

const initialState = {
    dataListClassUsers: null,
    dataDetailClassUser: null,
    loading: false
}

const classUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_CLASS_USERS:
            return {
                ...state,
                dataListClassUsers: action.payload
            }
        case Types.DETAIL_CLASS_USER:
            return {
                ...state,
                dataDetailClassUser: action.payload
            }
        default:
            return state
    }
}

export default classUserReducer