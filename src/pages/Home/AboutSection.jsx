import { Calculator, Code, BookOpen } from 'lucide-react';


const AboutSection = () => (
    <div className="min-h-screen bg-white flex items-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Về Chúng Tôi
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Nền tảng giáo dục hàng đầu kết hợp công nghệ và toán học
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 sm:p-8 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <Calculator className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Toán Học</h3>
                    <p className="text-blue-100 text-sm sm:text-base">Học toán một cách trực quan và thú vị</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 sm:p-8 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg">
                    <Code className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Lập Trình</h3>
                    <p className="text-green-100 text-sm sm:text-base">Phát triển tư duy logic và kỹ năng coding</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 sm:p-8 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg md:col-span-2 lg:col-span-1">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Học Tập</h3>
                    <p className="text-purple-100 text-sm sm:text-base">Phương pháp học hiện đại và hiệu quả</p>
                </div>
            </div>
        </div>
    </div>
);

export default AboutSection;