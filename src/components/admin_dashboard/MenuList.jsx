import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { hasPermission } from '../../utils/permission';

const MenuList = ({ collapsed, onMenuSelect }) => {
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [activeMenuName, setActiveMenuName] = useState(''); 
    const location = useLocation();
    const userPermissions = useSelector((state) => state.permissions.dataUserPermissions);
    console.log("User permissions from Redux:", userPermissions);
    const menuItems = [
        { path: '', name: 'Trang chủ', icon: '🏠' },
        { section: 'EDUCATION' },
        {
            path: 'classes',
            name: 'Quản lý Lớp học',
            icon: '🏫',
            children: [
                { path: 'classes/classes-list', name: 'Danh sách lớp học', permission: 'xem_lop_hoc' },
                { path: 'classes/class-material-categories', name: 'Danh mục tài liệu học tập', permission: 'xem_danh_sach_danh_muc_tai_lieu_lop_hoc' }
            ]
        },
        {
            path: 'user',
            name: 'Quản lý Người dùng',
            icon: '👥',
            children: [
                { path: 'user/user-list', name: 'Danh sách Người dùng' },
            ]
        },
        { section: 'THÔNG TIN', permission: 'xem_tin_tuc' },
        {
            path: 'news',
            name: 'Quản lý Tin tức',
            icon: '🏫',
            children: [
                { path: 'news/news-list', name: 'Danh sách tin tức', permission: 'xem_tin_tuc' },
            ]
        },
        { section: 'KỲ THI' },
        {
            path: 'exam-events',
            name: 'Quản lý Kỳ thi',
            icon: '🏫',
            children: [
                { path: 'exam-events/list', name: 'Danh sách kỳ thi'},
                { path: 'exam-events/list-exam-types', name: 'Danh sách loại đề thi'}
            ]
        },
        {
            path: 'quizs',
            name: 'Ngân hàng Đề thi',
            icon: '🏫',
            children: [
                { path: 'quizs/exams-list', name: 'Danh sách đề thi' },
                { path: 'quizs/list', name: 'Danh sách câu hỏi'},
                { path: 'quizs/types-list', name: 'Danh sách loại câu hỏi' },
                { path: 'quizs/difficulties-list', name: 'Danh sách độ khó câu hỏi' },
                { path: 'quizs/formats-list', name: 'Danh sách định dạng câu hỏi' }
            ]
        },
        { section: 'CÔNG CỤ' },
        {
            path: 'tools',
            name: 'Quản lý Trường học',
            icon: '🏫',
            children: [
                { path: 'tools/set-password', name: 'Cấp lại mật khẩu' },
            ]
        },
        { section: 'PHÂN QUYỀN' },
        {
            path: 'permission-groups',
            name: 'Quản lý nhóm quyền',
            icon: '🏫',
            children: [
                { path: 'permission-groups/permission-groups-list', name: 'Danh sách nhóm quyền' },
            ]
        },
        {
            path: 'permissions',
            name: 'Quản lý phân quyền',
            icon: '🏫',
            children: [
                { path: 'permissions/roles-list', name: 'Danh sách vai trò' },
                { path: 'permissions/permissions-list', name: 'Danh sách phân quyền' },
            ]
        },
        { path: 'logs', name: 'Nhật ký hoạt động', icon: '📋' },
    ];

    const toggleSubmenu = (path) => {
            const newExpandedGroups = new Set(expandedGroups);
            if (newExpandedGroups.has(path)) {
                newExpandedGroups.delete(path);
            } else {
                newExpandedGroups.add(path);
            }
            setExpandedGroups(newExpandedGroups);
        };

        const isExpanded = (path) => expandedGroups.has(path);

        const isActiveChild = (childPath) => {
            return location.pathname === `/admin/${childPath}`;
        };

        // Thêm function để handle click trên menu child
        const handleChildClick = (childName) => {
            setActiveMenuName(childName);
            if (onMenuSelect) {
                onMenuSelect();
            }
        };
    // Hàm kiểm tra quyền cho menu item
    const checkMenuPermission = (item) => {
        if (!item.permission) return true;
        return hasPermission(userPermissions, item.permission);
    };

    // Hàm kiểm tra xem parent menu có children được phép hiển thị không
    const hasVisibleChildren = (children) => {
        if (!children || !Array.isArray(children)) return false;
        return children.some(child => checkMenuPermission(child));
    };
    const hasSectionVisibleItems = (startIndex) => {
        for (let i = startIndex + 1; i < menuItems.length; i++) {
            const item = menuItems[i];

            // Nếu gặp section mới thì dừng
            if (item.section) break;

            // Kiểm tra menu item
            if (item.children) {
                if (hasVisibleChildren(item.children)) return true;
            } else {
                if (checkMenuPermission(item)) return true;
            }
        }
        return false;
    };
        return (
            <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden xs:pt-10">
                <style jsx>{`
                    .menu-slide-enter {
                        transform: translateX(-5px);
                        opacity: 0;
                    }
                    .menu-slide-active {
                        transform: translateX(0);
                        opacity: 1;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    .submenu-expand {
                        max-height: 0;
                        opacity: 0;
                        transform: scaleY(0.95);
                        transform-origin: top;
                        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .submenu-expand.expanded {
                        max-height: none;
                        opacity: 1;
                        transform: scaleY(1);
                    }

                    .menu-dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: #3b82f6;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        margin-right: 12px;
                        flex-shrink: 0;
                    }

                    .menu-child-item {
                        position: relative;
                        transition: all 0.15s ease-out;
                    }

                    .menu-child-item::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        width: 0;
                        height: 2px;
                        background-color: #3b82f6;
                        transition: all 0.2s ease-out;
                        transform: translateX(-50%);
                    }

                    .menu-child-item:hover::after {
                        width: calc(100% - 24px);
                    }

                    .menu-child-item.active::after {
                        width: calc(100% - 24px);
                    }

                    .menu-child-item.active .menu-dot {
                        transform: scale(1.5);
                        background-color: #1d4ed8;
                    }
                `}</style>

                {menuItems.map((item, index) => {
                    if (item.section) {
                        if (item.permission && !hasPermission(userPermissions, item.permission)) {
                            return null;
                        }
                        if (!hasSectionVisibleItems(index)) {
                            return null;
                        }
                        return (
                            <div key={index} className="mb-6 first:mt-2">
                                {!collapsed && (
                                    <div className="px-4 mb-3">
                                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
                                            {item.section}
                                        </span>
                                    </div>
                                )}
                                {collapsed && (
                                    <div className="w-full h-px bg-blue-300 mx-auto mb-3"></div>
                                )}
                            </div>
                        );
                    }

                    if (item.children) {
                        if (!hasVisibleChildren(item.children)) {
                            return null; // Ẩn toàn bộ parent menu nếu không có children nào được phép hiển thị
                        }
                        const expanded = isExpanded(item.path);

                        return (
                            <div key={item.path} className="mb-1">
                                <div
                                    className={`
                                        flex items-center px-4 py-3 mx-2 rounded-xl cursor-pointer
                                        text-blue-700 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200
                                        transition-all duration-200 ease-out group relative
                                        ${expanded ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' : ''}
                                    `}
                                    onClick={() => !collapsed && toggleSubmenu(item.path)}
                                    title={collapsed ? item.name : ''}
                                >
                                    <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <span className="text-sm font-medium truncate flex-1">
                                            {item.name}
                                        </span>
                                    )}
                                    {/* Thêm icon mũi tên cho collapsed state */}
                                    {!collapsed && (
                                        <span className={`text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    )}
                                </div>

                                {!collapsed && (
                                    <div className={`submenu-expand overflow-hidden ml-2 ${expanded ? 'expanded' : ''}`}>
                                        <div className="py-2 space-y-1 relative">
                                            <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-300"></div>

                                            {item.children.map((child) => {
                                                // Kiểm tra quyền trước khi render
                                                if (!checkMenuPermission(child)) {
                                                    return null;
                                                }

                                                return (
                                                    <Link
                                                        key={child.path}
                                                        to={`/admin/${child.path}`}
                                                        className={`menu-child-item flex items-center pl-10 pr-3 py-2 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-800 cursor-pointer rounded-md transition-all duration-150 ${isActiveChild(child.path) ? 'active' : ''
                                                            }`}
                                                        onClick={() => handleChildClick(child.name)}
                                                        title={child.name}
                                                    >
                                                        <div className="menu-dot"></div>
                                                        <span>{child.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (!checkMenuPermission(item)) {
                        return null;
                    }

                    return (
                        <Link
                            key={item.path}
                            to={`/admin/${item.path}`}
                            className="flex items-center px-4 py-3 mx-2 mb-1 rounded-xl relative text-blue-700 hover:text-blue-800 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200 ease-out group"
                            onClick={onMenuSelect}
                            title={collapsed ? item.name : ''}
                        >
                            <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="text-sm font-medium truncate">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        );
    };

    export default MenuList;