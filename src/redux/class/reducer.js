import { Types } from './types'

const initialState = {
    dataListClasses: null,
    dataDetailClass: null,
    loading: false
}

const classReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_CLASSES:
            return {
                ...state,
                dataListClasses: action.payload
            }
        case Types.DETAIL_CLASS:
            return {
                ...state,
                dataDetailClass: action.payload
            }
        default:
            return state
    }
}

export default classReducer