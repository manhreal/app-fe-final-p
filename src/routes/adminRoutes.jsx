import Home from '../pages/Home/Home';
import ListUser from '../pages/admin/User/ListUser';
import InfoUser from '../pages/admin/User/InfoUser';

import ListNews from '../pages/admin/News/ListNews';
import CreateUpdateNews from '../pages/admin/News/CreateUpdateNews';

import ListPermissionGroups from '../pages/admin/PermissionGroup/ListPermissionGroup';

import ListRoles from '../pages/admin/Role/ListRoles';

import ListPermissions from '../pages/admin/Permission/ListPermissions';

import ProtectedRoute from '../components/admin_dashboard/ProtectedRoute';

import ListClasses from '../pages/admin/Class/ListClasses';
import InfoClass from '../pages/admin/Class/InfoClass';
import ListClassMaterialCategories from '../pages/admin/Class/ListClassMaterialCategories';
import ListClassMaterials from '../pages/admin/Class/ListClassMaterials';
import CreateUpdateClassMaterial from '../pages/admin/Class/CreateUpdateClassMaterial';

import ListExamEvents from '../pages/admin/ExamEvent/ListExamEvents';
import InfoExemEvent from '../pages/admin/ExamEvent/InfoExamEvent';
import ListExamTypes from '../pages/admin/ExamEvent/ListExamTypes';

import ListFullExams from '../pages/admin/Quiz/ListFullExams';
import ListQuizs from '../pages/admin/Quiz/ListQuizs';
import ListQuizTypes from '../pages/admin/Quiz/ListQuizTypes';
import ListQuizDifficulties from '../pages/admin/Quiz/ListQuizDifficulties';
import ListQuizFormat from '../pages/admin/Quiz/ListQuizFormat';
import CreateUpdateQuiz from '../pages/admin/Quiz/CreateUpdateQuiz';
import AIImportQuiz from '../pages/admin/Quiz/AIImportQuiz';

import { List } from 'antd';

// Helper function để wrap component với ProtectedRoute
const withPermission = (Component, permission) => {
    return (
        <ProtectedRoute permission={permission}>
            <Component />
        </ProtectedRoute>
    );
};

export const adminRoutes = [
    // Trang chủ và trường học - không cần permission
    {
        path: 'school/school-list',
        element: <Home />,
        name: 'Danh sách trường học',
    },
    {
        path: 'school/class-list',
        element: <Home />,
        name: 'Danh sách lớp học',
    },

    // Người dùng - có thể thêm permission nếu cần
    {
        path: 'user/user-list',
        element: <ListUser />,
        name: 'Danh sách Người dùng',
        permission: 'xem_danh_sach_nguoi_dung'
    },
    {
        path: 'user/info-user/:id',
        element: <InfoUser />,
        name: 'Thông tin Người dùng',
        permission: 'xem_thong_tin_nguoi_dung'
    },

    // Tin tức
    {
        path: 'news/news-list',
        element: withPermission(ListNews, 'xem_tin_tuc'),
        name: 'Danh sách Tin tức',
        permission: 'xem_tin_tuc'
    },
    {
        path: 'news/add-news',
        element: withPermission(CreateUpdateNews, 'tao_tin_tuc'),
        name: 'Thêm tin tức mới',
        permission: 'them_tin_tuc'
    },
    {
        path: 'news/edit-news/:id',
        element: withPermission(CreateUpdateNews, 'sua_tin_tuc'),
        name: 'Cập nhật tin tức',
        permission: 'sua_tin_tuc'
    },

    // Phân quyền
    {
        path: 'permission-groups/permission-groups-list',
        element: <ListPermissionGroups />,
        name: 'Danh sách nhóm quyền',
        permission: 'xem_nhom_quyen'
    },

    // Vai trò
    {
        path: 'permissions/roles-list',
        element: <ListRoles />,
        name: 'Danh sách vai trò',
        permission: 'xem_vai_tro'
    },

    // Phân quyền
    {
        path: 'permissions/permissions-list',
        element: <ListPermissions />,
        name: 'Danh sách phân quyền',
        permission: 'xem_phan_quyen'
    },

    // Lớp học
    {
        path: 'classes/classes-list',
        element: withPermission(ListClasses, 'xem_lop_hoc'),
        name: 'Danh sách lớp học',
        permission: 'xem_lop_hoc'
    },
    {
        path: 'classes/info-class/:id',
        element: withPermission(InfoClass, 'xem_thong_tin_lop_hoc'),
        name: 'Thông tin Lớp học',
        permission: 'xem_thong_tin_lop_hoc'
    },
    {
        path: 'classes/class-material-categories',
        element: withPermission(ListClassMaterialCategories, 'xem_danh_sach_danh_muc_tai_lieu_lop_hoc'),
        name: 'Danh mục tài liệu học tập',
        permission: 'xem_danh_sach_danh_muc_tai_lieu_lop_hoc'
    },
    {
        path: 'classes/:classId/materials/add',
        element: withPermission(CreateUpdateClassMaterial, 'them_tai_lieu_lop_hoc'),
        name: 'Thêm tài liệu học tập',
        permission: 'them_tai_lieu_lop_hoc'
    },
    {
        path: 'classes/:classId/materials/edit/:id',
        element: withPermission(CreateUpdateClassMaterial, 'sua_tai_lieu_lop_hoc'),
        name: 'Cập nhật tài liệu học tập',
        permission: 'sua_tai_lieu_lop_hoc'
    },
    // Kỳ thi
    {
        path: 'exam-events/list',
        element: <ListExamEvents />,
        name: 'Danh sách kỳ thi'
    },
    {
        path: 'exam-events/info-exam-event/:id',
        element: <InfoExemEvent />,
        name: 'Thông tin Kỳ thi',
        permission: 'xem_thong_tin_ky_thi'
    },
    {
        path: 'exam-events/list-exam-types',
        element: <ListExamTypes />,
        name: 'Danh sách loại đề thi'
    },
    // Bài thi 
    // Câu hỏi
    {
        path: 'quizs/exams-list',
        element: <ListFullExams />,
        name: 'Danh sách Đề thi'
    },
    {
        path: 'quizs/list',
        element: <ListQuizs />,
        name: 'Danh sách Câu hỏi'
    },
    {
        path: 'quizs/types-list',
        element: <ListQuizTypes />,
        name: 'Danh sách Loại câu hỏi'
    },
    {
        path: 'quizs/difficulties-list',
        element: <ListQuizDifficulties />,
        name: 'Danh sách Độ khó câu hỏi'
    },
    {
        path: 'quizs/formats-list',
        element: <ListQuizFormat />,
        name: 'Danh sách Dạng câu hỏi'
    },
    {
        path: 'quizs/add-quiz',
        element: <CreateUpdateQuiz />,
        name: 'Thêm câu hỏi mới'
    },
    {
        path: 'quizs/add-quiz-ai',
        element: <AIImportQuiz />,
        name: 'Thêm câu hỏi mới với AI'
    },
    {
        path: 'quizs/edit-quiz/:id',
        element: <CreateUpdateQuiz />,
        name: 'Cập nhật câu hỏi'
    },
];
