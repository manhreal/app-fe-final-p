import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuList = ({ collapsed, onMenuSelect }) => {
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [activeMenuName, setActiveMenuName] = useState(''); 
    const location = useLocation();

    const menuItems = [
        { path: '', name: 'Trang chủ', icon: '🏠' },
        { section: 'ĐẠI SỐ' },
        {
            path: 'equation',
            name: 'Phương trình & Hệ phương trình',
            icon: '📊',
            children: [
                { path: 'equation/linear-one', name: 'PT bậc nhất 1 ẩn' },
                { path: 'equation/quadratic-equation', name: 'PT bậc hai 1 ẩn' },
                { path: 'equation/system-2', name: 'Hệ 2 PT bậc nhất 2 ẩn' },
                { path: 'equation/system-3', name: 'HPT tuyến tính 3 ẩn' },
                { path: 'equation/linear-inequality', name: 'BPT bậc nhất 1 ẩn' },
                { path: 'equation/inequality-quadratic', name: 'BPT bậc hai 1 ẩn' },
                { path: 'equation/parametric', name: 'PT có tham số' },
                { path: 'equation/abs', name: 'PT chứa giá trị tuyệt đối' },
                { path: 'equation/root', name: 'PT chứa căn thức' },
                { path: 'equation/fraction', name: 'PT chứa phân thức' }
            ]
        },
        {
            path: 'calculus',
            name: 'Giải tích / Hàm số',
            icon: '📊',
            children: [
                { path: 'calculus/evaluate', name: 'Tính giá trị hàm số tại x' },
                { path: 'calculus/derivative', name: 'Tính đạo hàm cơ bản' },
                { path: 'calculus/slope', name: 'Tính hệ số góc tiếp tuyến tại x' },
                { path: 'calculus/monotonic', name: 'Xét chiều biến thiên của hàm số' },
                { path: 'calculus/extrema', name: 'Tìm cực trị (max/min)' },
                { path: 'calculus/intersection', name: 'Tìm giao điểm hai đồ thị' },
                { path: 'calculus/quadratic-vertex', name: 'Tính tọa độ đỉnh parabol' },
                { path: 'calculus/integral-simple', name: 'Tính tích phân cơ bản' },
                { path: 'calculus/area-between', name: 'Tính diện tích miền giới hạn bởi đồ thị' }
            ]
        },
        {
            path: 'sequence',
            name: 'Dãy số & Cấp số',
            icon: '📈',
            children: [
                { path: 'sequence/arithmetic-term', name: 'Tính số hạng cấp số cộng (CSC)' },
                { path: 'sequence/arithmetic-sum', name: 'Tính tổng cấp số cộng (CSC)' },
                { path: 'sequence/geometric-term', name: 'Tính số hạng cấp số nhân (CSN)' },
                { path: 'sequence/geometric-sum', name: 'Tính tổng cấp số nhân (CSN)' },
                { path: 'sequence/check-arithmetic', name: 'Kiểm tra dãy là CSC' },
                { path: 'sequence/check-geometric', name: 'Kiểm tra dãy là CSN' },
                { path: 'sequence/recursive-term', name: 'Tính số hạng dãy đệ quy đơn giản' },
                { path: 'sequence/find-common', name: 'Tìm công sai / công bội' }
            ]
        },
        {
            path: 'number-theory',
            name: 'Số học',
            icon: '🔢',
            children: [
                { path: 'number-theory/gcd', name: 'Tìm Ước chung lớn nhất (GCD)' },
                { path: 'number-theory/lcm', name: 'Tìm Bội chung nhỏ nhất (LCM)' },
                { path: 'number-theory/is-prime', name: 'Kiểm tra số nguyên tố' },
                { path: 'number-theory/is-perfect-square', name: 'Kiểm tra số chính phương' },
                { path: 'number-theory/is-perfect', name: 'Kiểm tra số hoàn hảo' },
                { path: 'number-theory/divisors', name: 'Liệt kê tất cả ước của số n' },
                { path: 'number-theory/prime-factors', name: 'Phân tích số thành thừa số nguyên tố' },
                { path: 'number-theory/common-divisors', name: 'Tìm các ước chung của 2 số' },
                { path: 'number-theory/co-prime', name: 'Kiểm tra 2 số nguyên tố cùng nhau' }
            ]
        },
        {
            path: 'combinatoric',
            name: 'Tổ hợp – Xác suất',
            icon: '🎲',
            children: [
                { path: 'combinatoric/factorial', name: 'Tính giai thừa n!' },
                { path: 'combinatoric/permutation', name: 'Tính hoán vị P(n)' },
                { path: 'combinatoric/arrangement', name: 'Tính chỉnh hợp A(n, k)' },
                { path: 'combinatoric/combination', name: 'Tính tổ hợp C(n, k)' },
                { path: 'combinatoric/binomial-theorem', name: 'Khai triển nhị thức Newton' },
                { path: 'combinatoric/probability', name: 'Tính xác suất đơn giản' }
            ]
        },
        { section: 'HÌNH HỌC' },
        {
            path: 'geometry-plane',
            name: 'Hình học phẳng',
            icon: '📐',
            children: [
                { path: 'geometry-plane/triangle-area', name: 'Tính diện tích tam giác' },
                { path: 'geometry-plane/triangle-height', name: 'Tính đường cao tam giác' },
                { path: 'geometry-plane/triangle-angle', name: 'Tính góc trong tam giác' },
                { path: 'geometry-plane/circle', name: 'Tính diện tích & chu vi hình tròn' },
                { path: 'geometry-plane/rectangle', name: 'Tính diện tích & chu vi hình chữ nhật' },
                { path: 'geometry-plane/square', name: 'Tính diện tích & chu vi hình vuông' },
                { path: 'geometry-plane/parallelogram', name: 'Tính diện tích hình bình hành' },
                { path: 'geometry-plane/trapezoid', name: 'Tính diện tích hình thang' },
                { path: 'geometry-plane/point-distance', name: 'Tính khoảng cách giữa 2 điểm' },
                { path: 'geometry-plane/point-mid', name: 'Tính trung điểm đoạn thẳng' },
                { path: 'geometry-plane/angle-cos-sin', name: 'Tính góc bằng định lý Cos/Sin' }
            ]
        },
        {
            path: 'solid-geometry',
            name: 'Hình học không gian',
            icon: '📦',
            children: [
                { path: 'solid-geometry/volume-prism', name: 'Thể tích khối lăng trụ' },
                { path: 'solid-geometry/volume-pyramid', name: 'Thể tích khối chóp' },
                { path: 'solid-geometry/volume-cylinder', name: 'Thể tích hình trụ' },
                { path: 'solid-geometry/volume-cone', name: 'Thể tích hình nón' },
                { path: 'solid-geometry/volume-sphere', name: 'Thể tích hình cầu' },
                { path: 'solid-geometry/surface-cylinder', name: 'Diện tích hình trụ' },
                { path: 'solid-geometry/surface-cone', name: 'Diện tích hình nón' },
                { path: 'solid-geometry/surface-sphere', name: 'Diện tích hình cầu' },
                { path: 'solid-geometry/space-distance', name: 'Khoảng cách giữa 2 điểm trong không gian' }
            ]
        }
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
        return location.pathname === `/math-tool/${childPath}`;
    };

    // Thêm function để handle click trên menu child
    const handleChildClick = (childName) => {
        setActiveMenuName(childName);
        if (onMenuSelect) {
            onMenuSelect();
        }
    };

    return (
        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
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

                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={`/math-tool/${child.path}`}
                                                className={`menu-child-item flex items-center pl-10 pr-3 py-2 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-800 cursor-pointer rounded-md transition-all duration-150 ${isActiveChild(child.path) ? 'active' : ''
                                                    }`}
                                                onClick={() => handleChildClick(child.name)}
                                                title={child.name}
                                            >
                                                <div className="menu-dot"></div>
                                                <span>{child.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.path}
                        to={`/math-tool/${item.path}`}
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