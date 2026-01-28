import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        if (email) {
            alert('Đăng ký thành công!');
            setEmail('');
        }
    };

    return (
        <footer className="bg-slate-800 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <img src="/public/logo_header.png" alt="MathPro Logo" className="w-8 h-8" />
                        <h3 className="text-2xl font-bold text-blue-400">MathTech</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Nền tảng học toán THPT hàng đầu, giúp học sinh nắm vững kiến thức và đạt điểm cao trong các kỳ thi.
                    </p>

                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-blue-400" />
                            <span>(+84) 123456789</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span>contact@mathtech.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>Greenwich VN, Hà Nội</span>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <a href="#">
                            <img
                                src="/footer/facebook.png"
                                alt="Facebook"
                                className="w-6 h-6 rounded-full object-contain"
                            />
                        </a>
                        <a href="#">
                            <img
                                src="/footer/zalo.png"
                                alt="Zalo"
                                className="w-6 h-6 rounded-full object-contain"
                            />
                        </a>
                        <a href="#">
                            <img
                                src="/footer/tiktok.png"
                                alt="TikTok"
                                className="w-6 h-6 rounded-full object-contain"
                            />
                        </a>
                    </div>
                </div>

                {/* Useful Links */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-300 border-b border-blue-600 pb-2">
                        CÔNG CỤ GIẢI TOÁN
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Phương trình & Hệ PT</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Giải tích & Hàm số</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Dãy số & Cấp số</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Số học</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Tổ hợp & Xác suất</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Hình học phẳng</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Hình học không gian</a></li>                    </ul>
                </div>

                {/* Recent Courses */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-300 border-b border-blue-600 pb-2">
                        KHÓA HỌC MỚI NHẤT
                    </h4>
                    <div className="space-y-4">
                        <div className="flex space-x-3">
                            <img src="/img/course1.jpg" alt="Khóa học 1" className="w-12 h-12 rounded object-cover" />
                            <div>
                                <h5 className="text-sm font-medium text-white">Làm chủ Hàm số và Đạo hàm</h5>
                                <p className="text-xs text-gray-400 mt-1">Nắm vững kiến thức cơ bản và nâng cao về hàm số</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <img src="/img/course2.jpg" alt="Khóa học 2" className="w-12 h-12 rounded object-cover" />
                            <div>
                                <h5 className="text-sm font-medium text-white">Hình học không gian 12</h5>
                                <p className="text-xs text-gray-400 mt-1">Phương pháp giải nhanh các bài toán hình học không gian</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <img src="/img/course3.jpg" alt="Khóa học 3" className="w-12 h-12 rounded object-cover" />
                            <div>
                                <h5 className="text-sm font-medium text-white">Tích phân và Ứng dụng</h5>
                                <p className="text-xs text-gray-400 mt-1">Từ cơ bản đến nâng cao với nhiều dạng bài tập</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribe */}
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-300 border-b border-blue-600 pb-2">
                        ĐĂNG KÝ NHẬN TIN
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Đăng ký để nhận những thông tin mới nhất về các khóa học, tài liệu và tips học tập hiệu quả.
                    </p>

                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:border-blue-400 text-white placeholder-gray-400"
                        />
                        <button
                            onClick={handleSubscribe}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
                        >
                            ĐĂNG KÝ NGAY
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <img src="/img/math-illustration.png" alt="Math Illustration" className="w-full h-20 object-cover rounded opacity-80" />
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700 mt-8 pt-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-gray-400">
                        Bản quyền © {new Date().getFullYear()}{" "}
                        <a href="#" className="text-blue-400 hover:text-blue-300">MathTech</a>.
                        Thiết kế & phát triển bởi{" "}
                        <a href="#" className="text-blue-400 hover:text-blue-300">Duc-Manh Nguyen</a>.
                    </p>

                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Trang chủ</a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Trợ giúp</a>
                        <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Sơ đồ trang</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;