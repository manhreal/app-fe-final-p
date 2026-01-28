import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import LoginAdmin from '../pages/Auth/LoginAdmin';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import AuthPage from '../pages/Auth/AuthPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import MainLayout from '../layout/MainLayout';
import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard';
import { adminRoutes } from './adminRoutes';
import Profile from '../pages/Profile/Profile';
import MathTool from '../pages/math_tool/MathTool';
import { mathToolRoutes } from './mathToolRoutes';
import Forbidden from '../pages/Error/Forbidden';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ==================== AUTH ROUTES ==================== */}
            {/* Các route không cần layout và authentication */}
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/auth-page" element={<AuthPage />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* ==================== MAIN LAYOUT ==================== */}
            {/* Layout chung cho tất cả trang người dùng */}
            <Route path="/" element={<MainLayout />}>
                
                {/* ==================== PUBLIC ROUTES ==================== */}
                {/* Trang công khai - không cần đăng nhập */}
                <Route index element={<Home />} />
                
                <Route path="math-tool" element={<MathTool />}>
                    {mathToolRoutes.map((route) => (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={route.element} 
                        />
                    ))}
                </Route>

                {/* ==================== PROTECTED ROUTES ==================== */}
                {/* Các route yêu cầu đăng nhập (bất kỳ user nào) */}
                <Route 
                    path="profile" 
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } 
                />

                <Route 
                    path="courses" 
                    element={
                        <PrivateRoute>
                            <div>Course List</div>
                        </PrivateRoute>
                    } 
                />

                {/* ==================== ADMIN ROUTES ==================== */}
                {/* Chỉ admin (role_id === 1) mới truy cập được */}
                <Route 
                    path="admin" 
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                >
                    {/* Nested admin routes */}
                    {adminRoutes.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <AdminRoute>
                                    {route.element}
                                </AdminRoute>
                            }
                        />
                    ))}
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;