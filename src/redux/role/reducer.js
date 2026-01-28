import { Types } from './types'

const initialState = {
    dataListRoles: null,
    dataDetailRole: null,
    dataListPermissionsByRole: null,
    loading: false
}

const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_ROLES:
            return {
                ...state,
                dataListRoles: action.payload
            }
        case Types.DETAIL_ROLE:
            return {
                ...state,
                dataDetailRole: action.payload
            }
        case Types.LIST_PERMISSIONS_BY_ROLE:
            return {
                ...state,
                dataListPermissionsByRole: action.payload
            }
        default:
            return state
    }
}

export default roleReducer