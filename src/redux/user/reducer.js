import { Types } from './types'

const initialState = {
    dataListUser: null,
    dataDetailUser: null,
    dataListUsersToAddClass: null,
    loading: false
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_USER:
            return {
                ...state,
                dataListUser: action.payload
            }
        case Types.LIST_USERS_TO_ADD_CLASS:
                    return {
                        ...state,
                        dataListUsersToAddClass: action.payload
                    }
        case Types.DETAIL_USER:
            return {
                ...state,
                dataDetailUser: action.payload
            }
        default:
            return state
    }
}

export default userReducer