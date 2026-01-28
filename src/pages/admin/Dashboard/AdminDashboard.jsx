import React, { useState, useEffect } from 'react';
import MenuList from '../../../components/admin_dashboard/MenuList';
import ContentMenu from '../../../components/admin_dashboard/ContentMenu';
import { actionFetchMyPermissions } from "../../../redux/permission/actions";
import { useDispatch } from 'react-redux';

const AdminDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actionFetchMyPermissions());
    }, [dispatch]);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            if (!mobile && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }

            if (mobile) {
                setCollapsed(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mobileMenuOpen]);

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const closeMobileMenu = () => {
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    const handleMenuSelect = () => {
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isMobile && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [isMobile, mobileMenuOpen]);

    // Ngăn scroll body khi mobile menu mở
    useEffect(() => {
        if (isMobile && mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, mobileMenuOpen]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {isMobile && !mobileMenuOpen && (
                <button
                    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-105 shadow-lg hover:shadow-xl z-50"
                    onClick={toggleSidebar}
                    title="Mở menu"
                    aria-label="Toggle navigation menu"
                >
                    <img
                        src="/icon/open_side_math_tool.png"
                        alt="Mở menu"
                        className="w-10 h-auto object-contain"
                    />
                </button>
            )}

            {/* Sidebar */}
            <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0' : 'relative'} 
                ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                ${collapsed && !isMobile ? 'w-20' : isMobile ? 'w-80' : 'w-72'}
                ${isMobile ? 'h-full' : 'h-full'} 
                bg-gray-50 text-gray-800 z-40
                transition-all duration-300 ease-in-out flex flex-col
                shadow-lg border-r border-blue-200 overflow-y-auto
                ${isMobile ? 'max-w-[85vw]' : ''}
            `}>

                {/* Sidebar Header */}
                <div className={`
                    ${collapsed && !isMobile ? 'px-4 justify-center' : 'px-6 justify-between'} 
                    h-16 flex items-center border-b border-blue-200 bg-blue-100 flex-shrink-0
                `}>
                    <div className={`flex items-center transition-all duration-300 ${collapsed && !isMobile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                        <div className="flex items-center space-x-3">
                            <span className={`text-lg font-semibold text-blue-800 ${isMobile ? 'text-base' : ''}`}>
                                TRANG QUẢN TRỊ
                            </span>
                        </div>
                    </div>

                    <button
                        className="w-10 h-10 bg-blue-200 hover:bg-blue-300 border border-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group flex-shrink-0"
                        onClick={toggleSidebar}
                        title={
                            isMobile
                                ? 'Đóng menu'
                                : (collapsed ? 'Mở rộng menu' : 'Thu gọn menu')
                        }
                        aria-label={
                            isMobile
                                ? 'Close navigation menu'
                                : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')
                        }
                    >
                        <img
                            src={
                                isMobile
                                    ? '/icon/close_side_math_tool.png'
                                    : (collapsed
                                        ? '/icon/open_side_math_tool.png'
                                        : '/icon/close_side_math_tool.png')
                            }
                            alt="Toggle Icon"
                            className="w-5 h-5 object-contain"
                        />
                    </button>

                </div>

                {/* Menu List Component */}
                <div className="flex-1 overflow-y-auto">
                    <MenuList
                        collapsed={collapsed && !isMobile}
                        onMenuSelect={handleMenuSelect}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 bg-white min-w-0 ${isMobile ? 'w-full' : ''}`}>
                <div className="w-full h-full overflow-x-auto">
                    <ContentMenu />
                </div>
            </div>

            {/* Overlay cho mobile */}
            {isMobile && (
                <div
                    className={`
                        fixed inset-0 bg-black/50 z-30 transition-opacity duration-300
                        ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                    `}
                    onClick={closeMobileMenu}
                />
            )}
        </div>
    );
};

export default AdminDashboard;