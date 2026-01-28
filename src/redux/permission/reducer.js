import { Types } from './types'

const initialState = {
    dataListPermissions: null,
    dataDetailPermission: null,
    dataPermissionTree: null,
    dataUserPermissions: null,
    loading: false
}

const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_PERMISSIONS:
            return {
                ...state,
                dataListPermissions: action.payload
            }
        case Types.DETAIL_PERMISSION:
            return {
                ...state,
                dataDetailPermission: action.payload
            }
        case Types.PERMISSION_TREE:
            return {
                ...state,
                dataPermissionTree: action.payload
            }
        case Types.USER_PERMISSIONS:
            return {
                ...state,
                dataUserPermissions: action.payload
            }
        default:
            return state
    }
}

export default permissionReducer