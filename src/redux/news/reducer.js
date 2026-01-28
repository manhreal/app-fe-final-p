import { Types } from './types'

const initialState = {
    dataListNews: null,
    dataDetailNews: null,
    loading: false
}

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_NEWS:
            return {
                ...state,
                dataListNews: action.payload
            }
        case Types.DETAIL_NEWS:
            return {
                ...state,
                dataDetailNews: action.payload
            }
        default:
            return state
    }
}

export default newsReducer