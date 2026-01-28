import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/reducer';
import homeReducer from '../redux/home/reducer';
import userReducer from '../redux/user/reducer';
import mathReducer from '../redux/math_tool/reducer';
import newsReducer from '../redux/news/reducer';
import permissionGroupReducer from '../redux/permission_group/reducer';
import permissionReducer from '../redux/permission/reducer';
import roleReducer from '../redux/role/reducer';
import classReducer from '../redux/class/reducer';
import classUserReducer from '../redux/class_user/reducer';
import classMaterialReducer from '../redux/class_material/reducer';
import classMaterialCategoryReducer from '../redux/class_material_category/reducer';
import examEventReducer from '../redux/exam_event/reducer';
import examReducer from '../redux/exam/reducer';
import examTypeReducer from '../redux/exam_type/reducer';
import quizReducer from '../redux/quiz/reducer';
import quizDifficultyReducer from '../redux/quiz_difficulty/reducer';
import quizFormatReducer from '../redux/quiz_format/reducer';
import quizTypeReducer from '../redux/quiz_type/reducer';

import statisticReducer from '../redux/statistic/reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        news: newsReducer,
        home: homeReducer,
        math_tool: mathReducer,
        permissionGroups: permissionGroupReducer,
        permissions: permissionReducer,
        roles: roleReducer,
        classes: classReducer,
        classUsers: classUserReducer,
        classMaterials: classMaterialReducer,
        classMaterialCategories: classMaterialCategoryReducer,
        examEvents: examEventReducer,
        exams: examReducer,
        examTypes: examTypeReducer,
        quizs: quizReducer,
        quizDifficulties: quizDifficultyReducer,
        quizFormats: quizFormatReducer,
        quizTypes: quizTypeReducer,
        statistics: statisticReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});
