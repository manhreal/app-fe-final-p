import { Code, Users, BookOpen } from 'lucide-react';


const ContactSection = () => (
    <div className="min-h-screen bg-gray-900 flex items-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
                Liên Hệ
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
                Hãy liên hệ với chúng tôi để bắt đầu hành trình học tập của bạn
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div className="bg-gray-800 p-6 sm:p-8 rounded-xl">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Cộng Đồng</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Tham gia cộng đồng học tập</p>
                </div>
                <div className="bg-gray-800 p-6 sm:p-8 rounded-xl">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Tài Liệu</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Truy cập tài liệu học tập</p>
                </div>
                <div className="bg-gray-800 p-6 sm:p-8 rounded-xl sm:col-span-2 lg:col-span-1">
                    <Code className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Hỗ Trợ</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Nhận hỗ trợ 24/7</p>
                </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 text-base sm:text-lg">
                Bắt Đầu Ngay
            </button>
        </div>
    </div>
);

export default ContactSection;