import { Types } from './types'

const initialState = {
    dataListClassMaterials: null,
    dataDetailClassMaterial: null,
    loading: false
}

const classMaterialReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_CLASS_MATERIALS:
            return {
                ...state,
                dataListClassMaterials: action.payload
            }
        case Types.DETAIL_CLASS_MATERIAL:
            return {
                ...state,
                dataDetailClassMaterial: action.payload
            }
        default:
            return state
    }
}

export default classMaterialReducer