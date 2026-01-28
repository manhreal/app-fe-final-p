import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, User, BookOpen, Award, Settings, LogOut, Search, Bell } from 'lucide-react';
import { actionLogout } from '../../redux/auth/actions';
import AnimationButton1 from '../Button/AnimationButton1';

const styleCustom = {
    // Base styles
    baseButton: 'transition-all duration-200 hover:-translate-y-0.5',
    hoverIconEffect: 'hover:text-blue-600',
    gradientBackground: 'bg-gradient-to-br from-blue-600 to-blue-800',

    // Navigation styles
    navLink: 'px-3 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:-translate-y-0.5',
    dropdownToggle: 'flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:-translate-y-0.5 focus:outline-none',

    // Button styles
    primaryButton: 'px-4 py-1.5 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200',
    secondaryButton: 'px-4 py-1.5 text-sm text-blue-600 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5',
    mobileButton: 'block w-full py-3 text-white rounded-lg font-medium text-center transition-colors duration-150',

    // Icon button styles
    iconButton: 'p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 focus:outline-none',
    menuToggle: 'lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-200 focus:outline-none',

    // Dropdown styles
    dropdown: 'absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transform transition-all duration-200',
    dropdownItem: 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 group',
    dropdownLogout: 'w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group focus:outline-none',

    // Avatar styles
    avatar: 'w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center',
    avatarLarge: 'w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center',
    avatarText: 'text-white text-sm font-medium',
    avatarTextLarge: 'text-white text-lg font-medium',

    // Mobile menu styles
    mobileOverlay: 'fixed inset-0 z-40 lg:hidden transition-all duration-300',
    mobilePanel: 'absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col',
    mobileMenuItem: 'block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150',
    mobileMenuSubItem: 'flex items-center gap-3 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-150',
    mobileProfileItem: 'flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150',
    mobileScrollArea: 'flex-1 overflow-y-auto',

    // Header styles
    headerFixed: 'fixed top-0 left-0 right-0 z-50 transition-transform duration-300',
    headerScrolled: 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100',
    headerDefault: 'bg-white/80 backdrop-blur-sm',
    headerHidden: 'lg:translate-y-0 -translate-y-full', // Hide on mobile only
    headerVisible: 'translate-y-0',

    // Layout styles
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    flexCenter: 'flex items-center justify-between',
    flexGap: 'flex items-center gap-3',

    // Animation styles
    chevronRotate: 'w-4 h-4 transition-transform duration-200',
    slideIn: 'opacity-100 translate-y-0 visible',
    slideOut: 'opacity-0 -translate-y-2 invisible',
    mobileSlideIn: 'translate-x-0',
    mobileSlideOut: 'translate-x-full',

    // Text styles
    gradientText: 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent',
    userGreeting: 'font-semibold text-gray-800',
    userEmail: 'text-sm text-gray-500'
};

// Mock data for dropdowns
const mathToolCategories = [
    { name: 'Phương trình & Hệ phương trình', href: '/math-tool', icon: '💻' },
    { name: 'Giải tích / Hàm số', href: '/math-tool', icon: '📱' },
    { name: 'Dãy số & cấp số', href: '/math-tool', icon: '📊' },
    { name: 'Số học', href: '/math-tool/ai', icon: '🤖' },
    { name: 'Tổ hợp – Xác suất', href: '/math-tool', icon: '⚙️' },
    { name: 'Hình học phẳng', href: '/math-tool', icon: '🔗' },
    { name: 'Hình học không gian', href: '/math-tool', icon: '🔗' }
];


const profileMenuItems = [
    { name: 'Hồ sơ cá nhân', href: '/profile', icon: User },
    { name: 'Công cụ Toán của tôi', href: '/my-support', icon: BookOpen },
    { name: 'Chứng chỉ', href: '/certificates', icon: Award },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
];

const DropdownMenu = ({ children, items, isOpen, onClose, onItemClick }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div className="relative" ref={dropdownRef}>
            {children}
            <div className={`${styleCustom.dropdown} ${isOpen ? styleCustom.slideIn : styleCustom.slideOut}`}>
                {items.map((item, index) => (
                    item.href ? (
                        <Link
                            key={index}
                            to={item.href}
                            className={styleCustom.dropdownItem}
                            onClick={onClose}
                        >
                            {typeof item.icon === 'string' ? (
                                <span className="text-lg">{item.icon}</span>
                            ) : (
                                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
                            )}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onItemClick && onItemClick(item)}
                            className={styleCustom.dropdownLogout}
                        >
                            {typeof item.icon === 'string' ? (
                                <span className="text-lg">{item.icon}</span>
                            ) : (
                                <item.icon className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                            )}
                            <span className="font-medium">{item.name}</span>
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

const MobileMenu = ({ isOpen, onClose, isAuthenticated, user, onLogout, profileMenuItems  }) => (
    <div className={`${styleCustom.mobileOverlay} ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className={`${styleCustom.mobilePanel} ${isOpen ? styleCustom.mobileSlideIn : styleCustom.mobileSlideOut}`}>
            {/* Header */}
            <div className={`${styleCustom.flexCenter} p-6 border-b border-gray-100 flex-shrink-0`}>
                <h2 className={`text-xl font-bold ${styleCustom.gradientText}`}>
                    Menu
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* User Info in Mobile Menu */}
            {isAuthenticated && user && (
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <div className={styleCustom.flexGap}>
                        <div className={styleCustom.avatarLarge}>
                            <span className={styleCustom.avatarTextLarge}>
                                {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                            </span>
                        </div>
                        <div>
                            <p className={styleCustom.userGreeting}>👋 {user.name || 'User'}</p>
                            <p className={styleCustom.userEmail}>{user.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Scrollable Content */}
            <div className={styleCustom.mobileScrollArea}>
                <nav className="p-6 space-y-4">
                    <Link to="/" className={styleCustom.mobileMenuItem} onClick={onClose}>
                        Trang chủ
                    </Link>
                    <div className="space-y-2">
                        <div className="py-3 px-4 font-medium text-gray-700">Công cụ Toán</div>
                        {mathToolCategories.map((category, index) => (
                            <Link
                                key={index}
                                to={category.href}
                                className={styleCustom.mobileMenuSubItem}
                                onClick={onClose}
                            >
                                <span>{category.icon}</span>
                                <span className="text-gray-600">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                    {isAuthenticated && (
                        <>
                            <Link to="/profile" className={styleCustom.mobileMenuItem} onClick={onClose}>
                                Học tập
                            </Link>
                            {profileMenuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.href}
                                    className={styleCustom.mobileProfileItem}
                                    onClick={onClose}
                                >
                                    <item.icon className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                className={`${styleCustom.mobileProfileItem} hover:bg-red-50 hover:text-red-600 w-full text-left focus:outline-none`}
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Đăng xuất</span>
                            </button>
                        </>
                    )}
                </nav>
            </div>

            {/* Footer Buttons */}
            {!isAuthenticated && (
                <div className="p-6 border-t border-gray-100 space-y-3 flex-shrink-0">
                    <Link to="/auth-page">
                        <AnimationButton1
                            text="Đăng nhập"
                            baseColor="#2563eb"
                            hoverColor="#60a5fa"
                            fontSize="1rem"
                            onClick={onClose}
                        />
                    </Link>
                    <Link to="/auth-page">
                        <AnimationButton1
                            text="Đăng ký"
                            baseColor="#16a34a"
                            hoverColor="#4ade80"
                            fontSize="1rem"
                            onClick={onClose}
                        />
                    </Link>
                </div>
            )}
        </div>
    </div>
);

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const roleId = user?.role_id;
    // Check if user is authenticated
    const isAuthenticated = !!user;

    const isAdmin = Number(roleId) === 1;
    const profileMenuItemsByRole = [
        ...profileMenuItems,
        ...(isAdmin
            ? [{
                name: 'Trang quản trị Admin',
                href: '/admin',
                icon: Settings 
            }]
            : [])
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;

            // Update scrolled state for styling
            setScrolled(currentScrollY > 10);

            // Only hide header on mobile when scrolling down
            // Show header when scrolling up or at top
            if (window.innerWidth < 1024) { // lg breakpoint
                if (currentScrollY < 10) {
                    // Always show at top
                    setHeaderVisible(true);
                } else if (isScrollingDown && currentScrollY > lastScrollY + 5) {
                    // Hide when scrolling down significantly
                    setHeaderVisible(false);
                } else if (!isScrollingDown && lastScrollY - currentScrollY > 5) {
                    // Show when scrolling up significantly
                    setHeaderVisible(true);
                }
            } else {
                // Always visible on desktop
                setHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Handle window resize to show header on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setHeaderVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDropdownToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleLogout = () => {
        dispatch(actionLogout());
        setActiveDropdown(null);
    };

    const handleProfileMenuClick = (item) => {
        if (item.name === 'Đăng xuất') {
            handleLogout();
        }
        setActiveDropdown(null);
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header className={`${styleCustom.headerFixed} ${scrolled ? styleCustom.headerScrolled : styleCustom.headerDefault} ${headerVisible ? styleCustom.headerVisible : styleCustom.headerHidden}`}>
                <div className={styleCustom.container}>
                    <div className={`${styleCustom.flexCenter} h-14 lg:h-16`}>

                        {/* Logo */}
                        <div className={styleCustom.flexGap}>
                            <Link to="/" className={styleCustom.flexGap}>
                                <img src="/logo_header.png" alt="Manh Logo" className="h-10 w-auto" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link to="/" className={`${styleCustom.navLink} add-btn-header`}>
                                Trang chủ
                            </Link>

                            <DropdownMenu
                                items={mathToolCategories}
                                isOpen={activeDropdown === 'support'}
                                onClose={() => setActiveDropdown(null)}
                            >
                                <button
                                    onClick={() => handleDropdownToggle('support')}
                                    className={styleCustom.dropdownToggle}
                                >
                                    Công cụ Toán
                                    <ChevronDown className={`${styleCustom.chevronRotate} ${activeDropdown === 'support' ? 'rotate-180' : ''}`} />
                                </button>
                            </DropdownMenu>

                            {isAuthenticated && (
                                <Link to="/profile" className={styleCustom.navLink}>
                                    Học tập
                                </Link>
                            )}

                            <Link to="/about" className={styleCustom.navLink}>
                                Về chúng tôi
                            </Link>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <button className={styleCustom.iconButton}>
                                        <Search className="w-5 h-5" />
                                    </button>
                                    <button className={`${styleCustom.iconButton} relative`}>
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                    </button>

                                    <DropdownMenu
                                        items={[
                                            ...profileMenuItemsByRole,
                                            { name: 'Đăng xuất', icon: LogOut }
                                        ]}
                                        isOpen={activeDropdown === 'profile'}
                                        onClose={() => setActiveDropdown(null)}
                                        onItemClick={handleProfileMenuClick}
                                    >
                                        <button
                                            onClick={() => handleDropdownToggle('profile')}
                                            className={`${styleCustom.flexGap} p-2 rounded-lg transition-all duration-200 focus:outline-none`}
                                        >
                                            <div className={styleCustom.avatar}>
                                                <span className={styleCustom.avatarText}>
                                                    {getUserInitials(user?.name)}
                                                </span>
                                            </div>
                                            <div className="text-left">
                                                <span className="text-xs text-gray-500">👋 {user?.name || 'User'}</span>
                                            </div>
                                            <ChevronDown className={`${styleCustom.chevronRotate} text-gray-500 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                                        </button>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className={styleCustom.flexGap}>
                                    <Link to="/auth-page" className={styleCustom.secondaryButton}>
                                        Đăng nhập
                                    </Link>
                                    <Link to="/auth-page" className={styleCustom.primaryButton}>
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button - Changes icon based on menu state */}
                        <button
                            onClick={handleMobileMenuToggle}
                            className={styleCustom.menuToggle}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                profileMenuItems={profileMenuItemsByRole} 
            />

            {/* Spacer for fixed header */}
            <div className="h-9 lg:h-11"></div>
        </>
    );
};

export default Header;