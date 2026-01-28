import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { mathToolRoutes } from '../../routes/mathToolRoutes'; // import routes

const ContentMenu = () => {
    const location = useLocation();

    const getCurrentTime = () => {
        return new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Tìm route hiện tại để lấy tên trang
    const getCurrentRoute = () => {
        const currentPath = location.pathname.replace('/math-tool/', '');
        return mathToolRoutes.find(route => route.path === currentPath);
    };

    const currentRoute = getCurrentRoute();
    const pageTitle = currentRoute?.name || 'Hướng dẫn sử dụng';

    // Kiểm tra nếu là trang chủ (route rỗng)
    const isHomePage = !currentRoute || currentRoute.path === '';

    return (
        <div className="p-0 sm:p-2">
            <div className="mx-auto">
                <div className="p-4">
                    {/* Header với tên trang */}
                    <h1 className="text-2xl font-bold text-blue-800 mb-6">{pageTitle}</h1>

                    {/* Nội dung */}
                    {isHomePage ? (
                        // Hiển thị nội dung hướng dẫn cho trang chủ
                        <>
                            {/* Ảnh hướng dẫn chính */}
                            <div className="mb-8 flex justify-center">
                                <img
                                    src="/math_tool/guide.jpg"
                                    alt="Hướng dẫn sử dụng công cụ toán học"
                                    className="w-full max-w-2xl h-auto rounded-lg shadow-md object-cover"
                                />
                            </div>

                            {/* Hướng dẫn sử dụng */}
                            <div className="p-6 mb-8">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-blue-800 mb-1">Tìm công cụ phù hợp</h3>
                                            <p className="text-gray-600 text-sm">Hãy sử dụng thanh công cụ để tìm công cụ giải toán phù hợp với bạn</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">2</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-blue-800 mb-1">Đọc kỹ hướng dẫn</h3>
                                            <p className="text-gray-600 text-sm">Đọc kỹ mô tả, mẫu để sử dụng đúng cách</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">3</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-blue-800 mb-1">Nhập thông tin</h3>
                                            <p className="text-gray-600 text-sm">Điền thông tin yêu cầu và ấn tính toán</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">4</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-blue-800 mb-1">Nhận kết quả</h3>
                                            <p className="text-gray-600 text-sm">Bạn sẽ được nhận kết quả và lời giải sơ lược từng bước</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lưu ý quan trọng */}
                                <div className="mt-6 p-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-yellow-600 text-lg">⚠️</span>
                                        <h3 className="font-medium text-rose-800">Lưu ý quan trọng</h3>
                                    </div>
                                    <p className="text-rose-700 text-sm mt-2 font-bold">
                                        Công cụ mang tính chất hỗ trợ, tham khảo. Hãy sử dụng đúng cách và kiểm tra lại kết quả khi cần thiết.
                                    </p>
                                </div>
                            </div>

                            {/* Các tính năng nổi bật */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                            <span className="text-white text-sm">📐</span>
                                        </div>
                                        <h3 className="font-medium text-gray-800">Phương trình</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Giải phương trình bậc nhất, bậc hai và hệ phương trình</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                            <span className="text-white text-sm">📊</span>
                                        </div>
                                        <h3 className="font-medium text-gray-800">Hình học</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Tính toán diện tích, chu vi các hình học cơ bản</p>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                                            <span className="text-white text-sm">🧮</span>
                                        </div>
                                        <h3 className="font-medium text-gray-800">Đại số</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">Các phép tính đại số và xử lý biểu thức toán học</p>
                                </div>
                            </div>

                            <div className="text-right text-sm text-gray-400">
                                Cập nhật lần cuối: {getCurrentTime()}
                            </div>
                        </>
                    ) : (
                        // Render component từ routes
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentMenu;