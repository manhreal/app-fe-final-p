import { Types } from './types'

const initialState = {
    dataListPermissionGroups: null,
    dataDetailPermissionGroup: null,
    loading: false
}

const permissionGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_PERMISSION_GROUPS:
            return {
                ...state,
                dataListPermissionGroups: action.payload
            }
        case Types.DETAIL_PERMISSION_GROUP:
            return {
                ...state,
                dataDetailPermissionGroup: action.payload
            }
        default:
            return state
    }
}

export default permissionGroupReducer