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

const Intersection = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression1, setExpression1] = useState('x**2');
    const [expression2, setExpression2] = useState('2*x + 3');
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
        if (!expression1.trim() || !expression2.trim()) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionIntersection({
            expression1: expression1.trim(),
            expression2: expression2.trim()
        }));
    };

    // Convert expression for display (simple replacements for common cases)
    const convertToMathDisplay = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, ' \\cdot ')
            .replace(/sqrt/g, '\\sqrt')
            .replace(/sin/g, '\\sin')
            .replace(/cos/g, '\\cos')
            .replace(/tan/g, '\\tan')
            .replace(/log/g, '\\log')
            .replace(/ln/g, '\\ln')
            .replace(/pi/g, '\\pi')
            .replace(/e(?!\w)/g, 'e');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📈"
                formula={String.raw`$$f(x) = g(x)$$`}
                description={
                    <>
                        Giao điểm của hai đồ thị hàm số là những điểm có tọa độ{' '}
                        <strong>(x, y)</strong> thỏa mãn cả hai phương trình đồng thời
                    </>
                }
                example="Ví dụ: $f(x) = x^2$ và $g(x) = 2x + 3$ có giao điểm khi $x^2 = 2x + 3$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$f(x) = g(x)$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <InputField
                            label="Hàm số thứ nhất f(x)"
                            type="text"
                            value={expression1}
                            onChange={setExpression1}
                            placeholder="Ví dụ: x**2, sin(x), 2*x + 3"
                            helpText="Sử dụng ** cho lũy thừa (x**2), * cho nhân (2*x)"
                        />

                        <InputField
                            label="Hàm số thứ hai g(x)"
                            type="text"
                            value={expression2}
                            onChange={setExpression2}
                            placeholder="Ví dụ: 2*x + 3, cos(x), x**3 - 1"
                            helpText="Sử dụng ** cho lũy thừa (x**3), * cho nhân (3*x)"
                        />
                    </div>

                    {/* Preview expressions */}
                    {expression1.trim() && expression2.trim() && (
                        <div className="bg-blue-50 p-3 rounded border">
                            <div className="text-sm text-gray-700 mb-2">
                                <strong>🔍 Xem trước:</strong>
                            </div>
                            <div className="tex2jax_process text-sm">
                                $f(x) = {convertToMathDisplay(expression1)}$ <br />
                                $g(x) = {convertToMathDisplay(expression2)}$
                            </div>
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
                    {/* Functions Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hai hàm số:</strong><br />
                            <div className="mt-2">
                                $f(x) = {convertToMathDisplay(result?.function1 || expression1)}$<br />
                                $g(x) = {convertToMathDisplay(result?.function2 || expression2)}$
                            </div>
                        </div>
                    </div>

                    {/* Real Intersections */}
                    {result?.real_intersections && result.real_intersections.length > 0 && (
                        <>
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">🎯</span>
                                Giao điểm thực:
                            </h4>

                            <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                                <div className="px-3 sm:px-0">
                                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                        <thead className="bg-blue-500 text-white">
                                            <tr>
                                                <th className={commonClasses.tableHeader}>STT</th>
                                                <th className={commonClasses.tableHeader}>Tọa độ x</th>
                                                <th className={commonClasses.tableHeader}>Tọa độ y</th>
                                                <th className={commonClasses.tableHeader}>Giao điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.real_intersections.map((point, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                                                    <td className={`${commonClasses.tableCell} font-medium`}>
                                                        {index + 1}
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="font-mono text-blue-600">
                                                            {point.x}
                                                        </span>
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="font-mono text-blue-600">
                                                            {point.y}
                                                        </span>
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="tex2jax_process text-xs sm:text-sm">
                                                            $({point.x}, {point.y})$
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Complex Intersections */}
                    {result?.complex_intersections && result.complex_intersections.length > 0 && (
                        <>
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">🔢</span>
                                Giao điểm phức:
                            </h4>

                            <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                                <div className="px-3 sm:px-0">
                                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                        <thead className="bg-purple-500 text-white">
                                            <tr>
                                                <th className={commonClasses.tableHeader}>STT</th>
                                                <th className={commonClasses.tableHeader}>Tọa độ x</th>
                                                <th className={commonClasses.tableHeader}>Tọa độ y</th>
                                                <th className={commonClasses.tableHeader}>Giao điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.complex_intersections.map((point, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                                                    <td className={`${commonClasses.tableCell} font-medium`}>
                                                        {index + 1}
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="font-mono text-purple-600">
                                                            {typeof point.x === 'object' ?
                                                                `${point.x.real} + ${point.x.imag}i` :
                                                                point.x}
                                                        </span>
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="font-mono text-purple-600">
                                                            {typeof point.y === 'object' ?
                                                                `${point.y.real} + ${point.y.imag}i` :
                                                                point.y}
                                                        </span>
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="text-xs sm:text-sm">
                                                            ({typeof point.x === 'object' ?
                                                                `${point.x.real} + ${point.x.imag}i` :
                                                                point.x}, {typeof point.y === 'object' ?
                                                                    `${point.y.real} + ${point.y.imag}i` :
                                                                    point.y})
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* No intersections found */}
                    {result && (!result.real_intersections || result.real_intersections.length === 0) &&
                        (!result.complex_intersections || result.complex_intersections.length === 0) && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <div className="text-yellow-800">
                                    <span className="text-2xl mr-2">⚠️</span>
                                    <strong>Không tìm thấy giao điểm</strong>
                                </div>
                                <div className="text-sm text-yellow-700 mt-2">
                                    Hai đồ thị hàm số không có giao điểm trong phạm vi tính toán
                                </div>
                            </div>
                        )}

                    {/* Summary */}
                    {result && (result.real_intersections?.length > 0 || result.complex_intersections?.length > 0) && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                    📊 Tổng kết:
                                </strong>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 bg-blue-50 rounded border">
                                        <div className="text-sm font-semibold text-blue-700">
                                            🎯 Giao điểm thực
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {result.real_intersections?.length || 0}
                                        </div>
                                    </div>

                                    <div className="p-3 bg-purple-50 rounded border">
                                        <div className="text-sm font-semibold text-purple-700">
                                            🔢 Giao điểm phức
                                        </div>
                                        <div className="text-lg font-bold text-purple-600">
                                            {result.complex_intersections?.length || 0}
                                        </div>
                                    </div>
                                </div>

                                {/* Functions comparison */}
                                <div className="mt-4 p-3 bg-gray-50 rounded border">
                                    <div className="tex2jax_process text-xs sm:text-sm text-gray-700">
                                        <strong>Phương trình giao điểm:</strong><br />
                                        ${convertToMathDisplay(result?.function1 || expression1)} = {convertToMathDisplay(result?.function2 || expression2)}$
                                    </div>
                                </div>
                            </div>

                            {/* Additional Tips */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Lưu ý:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    <div>• Giao điểm thực có thể vẽ được trên mặt phẳng tọa độ</div>
                                    <div>• Giao điểm phức chỉ tồn tại trong không gian số phức</div>
                                    <div>• Kiểm tra lại bằng cách thay tọa độ vào cả hai hàm số</div>
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default Intersection;