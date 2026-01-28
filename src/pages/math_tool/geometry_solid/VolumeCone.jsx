import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mathActions } from '../../../redux/math_tool/actions';
import {
    commonClasses,
    initializeMathJax,
    renderMathJax
} from '../../../template_ui/commonMathUtils';
import {
    TheorySection,
    InputField,
    SubmitButton,
    ErrorMessage,
    ResultSection
} from '../../../template_ui/commonStyles';

const VolumeCone = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [radius, setRadius] = useState(4);
    const [height, setHeight] = useState(9);
    const [mathJaxReady, setMathJaxReady] = useState(false);

    // Initialize MathJax on component mount
    useEffect(() => {
        initializeMathJax(setMathJaxReady);
    }, []);

    // Re-render MathJax when content changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            renderMathJax(mathJaxReady);
        }, 100);
        return () => clearTimeout(timeout);
    }, [result, mathJaxReady]);

    // Input validation
    const validateInputs = () => {
        if (radius <= 0 || height <= 0) return false;
        if (isNaN(radius) || isNaN(height)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionVolumeCone({ radius, height }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$V = \frac{1}{3}\pi r^2 h$$`}
                description={
                    <>
                        Thể tích hình nón bằng{' '}
                        <strong>một phần ba tích của diện tích đáy và chiều cao</strong>
                    </>
                }
                example={`$V = \\frac{1}{3}\\pi \\times 4^2 \\times 9 = \\frac{1}{3}\\pi \\times 16 \\times 9 = 48\\pi \\approx 150.8$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$V = \frac{1}{3}\pi r^2 h$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Bán kính đáy (r)"
                            value={radius}
                            onChange={(value) => setRadius(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            type="number"
                            helpText="Số dương (đơn vị: cm, m...)"
                        />

                        <InputField
                            label="Chiều cao (h)"
                            value={height}
                            onChange={(value) => setHeight(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            type="number"
                            helpText="Số dương (đơn vị: cm, m...)"
                        />
                    </div>

                    {(radius <= 0 || height <= 0) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Bán kính và chiều cao phải lớn hơn 0
                        </div>
                    )}

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {`$$V = \\frac{1}{3}\\pi \\times ${radius}^2 \\times ${height}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết tính toán:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Mô tả</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Áp dụng công thức: $V = \\frac{1}{3}\\pi r^2 h$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$V = \\frac{1}{3}\\pi r^2 h$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay số vào công thức
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$V = \\frac{1}{3}\\pi \\times ${radius}^2 \\times ${height}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính bình phương bán kính
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$V = \\frac{1}{3}\\pi \\times ${radius * radius} \\times ${height}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tích số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$V = \\frac{${radius * radius * height}}{3}\\pi = ${(radius * radius * height / 3).toFixed(2)}\\pi$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.value && result.value.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.value && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\times ${radius}^2 \\times ${height}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {`$V = ${result.value.toFixed(2)}$ (đơn vị khối)`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Thể tích hình nón có bán kính đáy <span className="font-bold text-blue-600">{radius}</span> và chiều cao <span className="font-bold text-blue-600">{height}</span> là <span className="font-bold text-blue-600">{result.value.toFixed(2)}</span> đơn vị khối
                                    </div>
                                </div>

                                {/* Exact Value */}
                                <div className="mt-3 p-2 bg-green-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Giá trị chính xác:</strong>
                                        <span className="tex2jax_process ml-1">
                                            {`$V = \\frac{${radius * radius * height}}{3}\\pi = ${(radius * radius * height / 3).toFixed(2)}\\pi \\approx ${result.value.toFixed(6)}$`}
                                        </span>
                                    </div>
                                </div>

                                {/* Comparison with Cylinder */}
                                <div className="mt-3 p-2 bg-yellow-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>So sánh:</strong> Thể tích hình nón bằng
                                        <span className="tex2jax_process ml-1">
                                            $\\frac{1}{3}$
                                        </span>
                                        thể tích hình trụ cùng đáy và chiều cao
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Công thức liên quan:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        Diện tích đáy: $S = \\pi r^2$
                                    </div>
                                    <div className="tex2jax_process">
                                        {"$l = \\\\sqrt{r^2 + h^2}$"}
                                    </div>
                                    <div className="tex2jax_process">
                                        {"$S_{xq} = \\\\pi r l$"}
                                    </div>
                                    <div className="tex2jax_process">
                                        {"$S_{tp} = \\\\pi r(r + l)$"}
                                    </div>
                                </div>

                                {/* Show slant height calculation */}
                                <div className="mt-3 p-2 bg-purple-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Đường sinh với dữ liệu hiện tại:</strong>
                                        <span className="tex2jax_process ml-1">
                                            {`$l = \\sqrt{${radius}^2 + ${height}^2} = \\sqrt{${radius * radius + height * height}} \\approx ${Math.sqrt(radius * radius + height * height).toFixed(2)}$`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default VolumeCone;