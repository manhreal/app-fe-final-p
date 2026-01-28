import { ChevronDown} from 'lucide-react';

const HeroSection = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Công Nghệ &
                <span className="text-blue-600 block sm:inline"> Toán Học</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto px-4">
                Khám phá thế giới số học và công nghệ với phương pháp học tập hiện đại
            </p>
            <div className="animate-bounce mt-8 sm:mt-12">
                <ChevronDown className="w-8 h-8 mx-auto text-blue-600" />
            </div>
        </div>
    </div>
);

export default HeroSection;