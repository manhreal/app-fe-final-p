import { Types } from './types'

const initialState = {
    dataListUserClasses: null,
    dataDetailClassByCode: null,
    loading: false
}

const userClassReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_USER_CLASSES:
            return {
                ...state,
                dataListUserClasses: action.payload
            }
        case Types.DETAIL_CLASS_BY_CODE:
            return {
                ...state,
                dataDetailClassByCode: action.payload
            }
        case Types.CLEAR_CLASS_BY_CODE:
            return {
                ...state,
                dataDetailClassByCode: null
            }
        default:
            return state
    }
}

export default userClassReducer