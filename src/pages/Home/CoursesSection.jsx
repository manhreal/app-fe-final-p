const CoursesSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Khóa Học
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Chương trình học được thiết kế phù hợp với mọi trình độ
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {['Toán Cơ Bản', 'Lập Trình Python', 'Data Science', 'AI & Machine Learning', 'Web Development', 'Toán Cao Cấp'].map((course, index) => (
                    <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6 flex items-center justify-center text-white font-bold text-lg sm:text-xl
            ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'}`}>
                            {index + 1}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{course}</h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Mô tả khóa học sẽ được cập nhật sau...</p>
                        <button className="w-full bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                            Tìm Hiểu Thêm
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default CoursesSection;