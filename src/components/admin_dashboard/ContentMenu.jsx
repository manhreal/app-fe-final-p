import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { adminRoutes } from '../../routes/adminRoutes';
import MainDashboard from '../../pages/admin/Statistic/MainDashboard';

const ContentMenu = () => {
    const location = useLocation();

    const getCurrentRoute = () => {
        const currentPath = location.pathname.replace('/admin/', '');

        return adminRoutes.find(route => {
            if (route.path.includes(':')) {
                const basePath = route.path.split('/:')[0];
                return currentPath.startsWith(basePath);
            }
            return route.path === currentPath;
        });
    };

    const currentRoute = getCurrentRoute();
    const pageTitle = currentRoute?.name || 'DASHBOARD';

    const isHomePage = !currentRoute || currentRoute.path === '';

    return (
        <div className="p-0 sm:p-2">
            <div className="mx-auto">
                <div className="p-4">
                    {/* Header với tên trang */}
                    <h1 className="text-2xl font-bold text-blue-800 mb-6">{pageTitle}</h1>

                    {/* Nội dung */}
                    {isHomePage ? (
                        <>
                            <div className="mb-8 flex justify-center">
                                <MainDashboard />
                            </div>
                        </>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentMenu;