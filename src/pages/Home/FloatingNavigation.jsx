// components/FloatingNavigation.jsx
import React from 'react';
import { Menu, X, Calculator, Code, BookOpen, Users } from 'lucide-react';

const FloatingNavigation = ({ isOpen, setIsOpen, scrollToSection }) => {
    const navItems = [
        { name: 'Trang Chủ', icon: BookOpen, id: 'hero' },
        { name: 'Về Chúng Tôi', icon: Users, id: 'about' },
        { name: 'Khóa Học', icon: Calculator, id: 'courses' },
        { name: 'Liên Hệ', icon: Code, id: 'contact' }
    ];

    return (
        <>
            {/* Floating Button - now at bottom right */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-110 transition-all duration-300"
            >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Navigation Menu */}
            <div
                className={`fixed bottom-20 right-4 sm:bottom-28 sm:right-6 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 min-w-[200px] sm:min-w-[240px]">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                scrollToSection(item.id);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 group text-left"
                        >
                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-gray-900 font-medium text-sm sm:text-base group-hover:text-blue-600">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-20" onClick={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default FloatingNavigation;
