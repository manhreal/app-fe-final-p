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

const Extrema = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression, setExpression] = useState('x**3 - 3*x');
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
        if (!expression || expression.trim() === '') return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionExtrema({ expression: expression.trim() }));
    };

    // Convert Python expression to LaTeX for display
    const convertToLatex = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '')
            .replace(/\b(\d+)\s*([a-z])/gi, '$1$2')
            .replace(/\b([a-z])\s*(\d+)/gi, '$1^{$2}');
    };

    // Get extrema type display
    const getExtremaDisplay = (type) => {
        if (type === 'max') {
            return { icon: '🔺', text: 'Cực đại', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
        } else if (type === 'min') {
            return { icon: '🔻', text: 'Cực tiểu', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
        }
        return { icon: '📍', text: 'Điểm đặc biệt', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$f'(x_0) = 0 \text{ và } f''(x_0) \neq 0 \Rightarrow x_0 \text{ là điểm cực trị}$$`}
                description={
                    <>
                        Tìm cực trị của hàm số bằng cách{' '}
                        <strong>tính đạo hàm cấp 1 và cấp 2</strong>, xác định điểm tới hạn và kiểm tra điều kiện cực trị
                    </>
                }
                example="Với $f(x) = x^3 - 3x$: $f'(x) = 3x^2 - 3$, $f''(x) = 6x$. Tại $x = -1$: $f'(-1) = 0$, $f''(-1) = -6 < 0$ → cực đại"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {"$$\\text{Tìm cực trị của } f(x)$$"}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Biểu thức hàm số f(x)
                        </label>
                        <input
                            type="text"
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ví dụ: x**3 - 3*x"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Sử dụng ký hiệu Python: x**3 (x³), 3*x (3x), sqrt(x) (√x), sin(x), cos(x), log(x)
                        </div>
                    </div>

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Function Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hàm số:</strong><br />
                            <div className="mt-2">
                                $f(x) = {convertToLatex(result.expression)}$
                            </div>
                        </div>
                    </div>

                    {/* Extrema Points */}
                    {result.extrema && result.extrema.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="mr-2">🎯</span>
                                Điểm cực trị:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {result.extrema.map((point, index) => {
                                    const extremaInfo = getExtremaDisplay(point.type);
                                    return (
                                        <div key={index} className={`p-4 rounded-lg border-2 ${extremaInfo.bgColor} ${extremaInfo.borderColor}`}>
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">{extremaInfo.icon}</div>
                                                <div className={`font-bold text-sm ${extremaInfo.color}`}>{extremaInfo.text}</div>
                                                <div className="mt-2 text-sm">
                                                    <div>x = <span className="font-bold">{point.x}</span></div>
                                                    <div>y = <span className="font-bold">{point.y}</span></div>
                                                    <div className="text-xs text-gray-600 mt-1">({point.x}; {point.y})</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Inflection Points */}
                    {result.inflection_points && result.inflection_points.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="mr-2">📐</span>
                                Điểm uốn:
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {result.inflection_points.map((point, index) => (
                                    <div key={index} className="px-4 py-2 bg-purple-100 border border-purple-200 text-purple-800 rounded-lg">
                                        <div className="text-sm font-medium">
                                            📐 ({point.x}; {point.y})
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết tìm cực trị:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Mô tả</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính đạo hàm f'(x)
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="text-xs sm:text-sm">
                                                Giải f'(x) = 0
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tìm điểm tới hạn
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            {result.extrema && result.extrema.length > 0 ?
                                                result.extrema.map(p => `x = ${p.x}`).join(', ') :
                                                'Không có điểm tới hạn'
                                            }
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kiểm tra điều kiện cực trị
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            Xem bảng cực trị
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Extrema Details Table */}
                    {result.extrema && result.extrema.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                Bảng cực trị:
                            </h4>

                            <div className="overflow-x-auto -mx-3 sm:mx-0">
                                <div className="px-3 sm:px-0">
                                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[500px]">
                                        <thead className="bg-green-500 text-white">
                                            <tr>
                                                <th className={`${commonClasses.tableHeader} w-1/4`}>Điểm x</th>
                                                <th className={`${commonClasses.tableHeader} w-1/4`}>Giá trị y</th>
                                                <th className={`${commonClasses.tableHeader} w-1/4`}>Loại cực trị</th>
                                                <th className={`${commonClasses.tableHeader} w-1/4`}>Tọa độ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.extrema.map((point, index) => {
                                                const extremaInfo = getExtremaDisplay(point.type);
                                                return (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                        <td className={`${commonClasses.tableCell} font-medium text-center`}>
                                                            {point.x}
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} font-medium text-center`}>
                                                            {point.y}
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} text-center`}>
                                                            <span className={`flex items-center justify-center gap-1 ${extremaInfo.color}`}>
                                                                <span>{extremaInfo.icon}</span>
                                                                <span className="font-medium">{extremaInfo.text}</span>
                                                            </span>
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} text-center font-medium`}>
                                                            ({point.x}; {point.y})
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Result Summary */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết luận về cực trị:</strong>

                            {/* Function Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        $f(x) = {convertToLatex(result.expression)}$
                                    </div>
                                </div>
                            </div>

                            {/* Summary of extrema */}
                            {result.extrema && result.extrema.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                    {result.extrema.map((point, index) => {
                                        const extremaInfo = getExtremaDisplay(point.type);
                                        return (
                                            <div key={index} className={`p-3 rounded border ${extremaInfo.bgColor} ${extremaInfo.borderColor}`}>
                                                <div className="text-xs sm:text-sm">
                                                    <span className={`font-medium ${extremaInfo.color}`}>
                                                        {extremaInfo.icon} Hàm số đạt {extremaInfo.text.toLowerCase()}
                                                    </span>
                                                    <span className="mx-2">tại</span>
                                                    <span className="font-bold">
                                                        x = {point.x}
                                                    </span>
                                                    <span className="mx-2">với giá trị</span>
                                                    <span className="font-bold">
                                                        y = {point.y}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-4 p-3 bg-gray-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-600">
                                        🔍 Hàm số không có điểm cực trị trong miền xác định
                                    </div>
                                </div>
                            )}

                            {/* Inflection Points Summary */}
                            {result.inflection_points && result.inflection_points.length > 0 && (
                                <div className="mt-4 p-3 bg-purple-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Điểm uốn:</strong> Hàm số có điểm uốn tại{' '}
                                        <span className="font-bold text-purple-600">
                                            {result.inflection_points.map(p => `(${p.x}; ${p.y})`).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Lưu ý về cực trị:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>• f'(x₀) = 0: điều kiện cần</div>
                                <div>• f''(x₀) &lt; 0: cực đại</div>
                                <div>• f''(x₀) &gt; 0: cực tiểu</div>
                                <div>• f''(x₀) = 0: cần xét thêm</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Extrema;