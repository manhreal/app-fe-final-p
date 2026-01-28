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

const Monotonic = () => {
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
        dispatch(mathActions.actionMonotonic({ expression: expression.trim() }));
    };

    // Convert Python expression to LaTeX for display
    const convertToLatex = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '')
            .replace(/\b(\d+)\s*([a-z])/gi, '$1$2')
            .replace(/\b([a-z])\s*(\d+)/gi, '$1^{$2}');
    };

    // Format interval display
    const formatInterval = (interval) => {
        let start = interval.start;
        let end = interval.end;

        if (start === '-oo') start = '-\\infty';
        if (end === 'oo') end = '+\\infty';

        return `(${start}; ${end})`;
    };

    // Get behavior icon and text
    const getBehaviorDisplay = (behavior) => {
        if (behavior === 'increasing') {
            return { icon: '📈', text: 'Tăng', color: 'text-green-600' };
        } else if (behavior === 'decreasing') {
            return { icon: '📉', text: 'Giảm', color: 'text-red-600' };
        }
        return { icon: '➡️', text: 'Không đổi', color: 'text-gray-600' };
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$f'(x) > 0 \Rightarrow f \text{ tăng}, \quad f'(x) < 0 \Rightarrow f \text{ giảm}$$`}
                description={
                    <>
                        Xét chiều biến thiên của hàm số bằng cách tìm{' '}
                        <strong>đạo hàm và xác định dấu của đạo hàm</strong> trên các khoảng
                    </>
                }
                example="Với $f(x) = x^3 - 3x$: $f'(x) = 3x^2 - 3 = 3(x^2 - 1) = 3(x-1)(x+1)$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {"$$\\text{Xét chiều biến thiên của } f(x)$$"}
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
                        {expression && (
                            <div className={`${commonClasses.mathDisplay} mt-2`}>
                                <div className="tex2jax_process text-sm">
                                    $f(x) = {convertToLatex(expression)}$
                                </div>
                            </div>
                        )}
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
                    {/* Function and Derivative Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hàm số:</strong><br />
                            <div className="mt-2">
                                $f(x) = {convertToLatex(result.expression)}$
                            </div>
                            <div className="mt-2">
                                <strong>Đạo hàm:</strong> $f'(x) = {convertToLatex(result.derivative)}$
                            </div>
                        </div>
                    </div>

                    {/* Critical Points */}
                    {result.critical_points && result.critical_points.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="mr-2">🎯</span>
                                Điểm tới hạn:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.critical_points.map((point, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                        x = {point}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết xét chiều biến thiên:
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
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $f'(x) = {convertToLatex(result.derivative)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tìm điểm tới hạn (f'(x) = 0)
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            {result.critical_points && result.critical_points.length > 0 ?
                                                result.critical_points.join(', ') :
                                                'Không có điểm tới hạn'
                                            }
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Xét dấu f'(x) trên các khoảng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            Xem bảng biến thiên
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Monotonicity Table */}
                    {result.monotonicity && result.monotonicity.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                Bảng biến thiên:
                            </h4>

                            <div className="overflow-x-auto -mx-3 sm:mx-0">
                                <div className="px-3 sm:px-0">
                                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[500px]">
                                        <thead className="bg-green-500 text-white">
                                            <tr>
                                                <th className={`${commonClasses.tableHeader} w-1/3`}>Khoảng</th>
                                                <th className={`${commonClasses.tableHeader} w-1/3`}>Dấu f'(x)</th>
                                                <th className={`${commonClasses.tableHeader} w-1/3`}>Chiều biến thiên</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.monotonicity.map((item, index) => {
                                                const behaviorInfo = getBehaviorDisplay(item.behavior);
                                                return (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                        <td className={`${commonClasses.tableCell} font-medium`}>
                                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                                ${formatInterval(item.interval)}$
                                                            </span>
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} text-center`}>
                                                            <span className={`font-bold ${item.behavior === 'increasing' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {item.behavior === 'increasing' ? '+' : '-'}
                                                            </span>
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} text-center`}>
                                                            <span className={`flex items-center justify-center gap-1 ${behaviorInfo.color}`}>
                                                                <span>{behaviorInfo.icon}</span>
                                                                <span className="font-medium">{behaviorInfo.text}</span>
                                                            </span>
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
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết luận về chiều biến thiên:</strong>

                            {/* Function Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        $f(x) = {convertToLatex(result.expression)}$
                                    </div>
                                </div>
                            </div>

                            {/* Summary of monotonicity */}
                            <div className="mt-4 space-y-2">
                                {result.monotonicity && result.monotonicity.map((item, index) => {
                                    const behaviorInfo = getBehaviorDisplay(item.behavior);
                                    return (
                                        <div key={index} className={`p-2 rounded border ${item.behavior === 'increasing' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="text-xs sm:text-sm">
                                                <span className={`font-medium ${behaviorInfo.color}`}>
                                                    {behaviorInfo.icon} Hàm số {behaviorInfo.text.toLowerCase()}
                                                </span>
                                                <span className="mx-2">trên</span>
                                                <span className="tex2jax_process font-medium">
                                                    ${formatInterval(item.interval)}$
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Critical Points Summary */}
                            {result.critical_points && result.critical_points.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Điểm tới hạn:</strong> Hàm số có thể đạt cực trị tại{' '}
                                        <span className="font-bold text-blue-600">
                                            x = {result.critical_points.join(', x = ')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Lưu ý về chiều biến thiên:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>• f'(x) &gt; 0: hàm số đồng biến (tăng)</div>
                                <div>• f'(x) &lt; 0: hàm số nghịch biến (giảm)</div>
                                <div>• f'(x) = 0: điểm tới hạn (có thể cực trị)</div>
                                <div>• Điểm tới hạn chia miền xác định</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Monotonic;