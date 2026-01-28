import { Types } from './types'

const initialState = {
    dataListClassMaterialCategories: null,
    dataDetailClassMaterialCategory: null,
    loading: false
}

const classMaterialCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.LIST_CLASS_MATERIAL_CATEGORIES:
            return {
                ...state,
                dataListClassMaterialCategories: action.payload
            }
        case Types.DETAIL_CLASS_MATERIAL_CATEGORY:
            return {
                ...state,
                dataDetailClassMaterialCategory: action.payload
            }
        default:
            return state
    }
}

export default classMaterialCategoryReducer