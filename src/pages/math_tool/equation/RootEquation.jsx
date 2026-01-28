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

const RootEquation = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [left, setLeft] = useState('sqrt(x - 5)');
    const [right, setRight] = useState('3');
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
        if (!left.trim() || !right.trim()) return false;
        // Basic validation for root expressions
        if (!left.includes('sqrt') && !left.includes('√')) return false;
        return true;
    };

    // Convert expression to LaTeX format for display
    const convertToLatex = (expr) => {
        return expr
            .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
            .replace(/\*/g, ' \\cdot ')
            .replace(/\^/g, '^')
            .replace(/pi/g, '\\pi')
            .replace(/infinity/g, '\\infty');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionRoot({ left, right }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\sqrt{f(x)} = g(x)$$`}
                description={
                    <>
                        <span>
                            {`Phương trình chứa căn thức có dạng $\\sqrt{f(x)} = g(x)$. Để giải, ta cần:`}
                            <br />
                        </span>

                        <strong>1.</strong> Tìm điều kiện xác định: $f(x) \geq 0$ và $g(x) \geq 0$ <br />
                        <strong>2.</strong> Bình phương hai vế: $f(x) = [g(x)]^2$ <br />
                        <strong>3.</strong> Kiểm tra nghiệm thỏa mãn điều kiện
                    </>
                }
                example={String.raw`$\sqrt{x - 5} = 3 \Rightarrow x - 5 = 9 \Rightarrow x = 14$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập phương trình
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$${convertToLatex(left)} = ${convertToLatex(right)}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vế trái (chứa căn)
                            </label>
                            <input
                                type="text"
                                value={left}
                                onChange={(e) => setLeft(e.target.value)}
                                placeholder="sqrt(x - 5)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500">
                                Nhập biểu thức chứa căn, ví dụ: sqrt(x - 5), sqrt(2*x + 1)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vế phải
                            </label>
                            <input
                                type="text"
                                value={right}
                                onChange={(e) => setRight(e.target.value)}
                                placeholder="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500">
                                Nhập biểu thức vế phải, ví dụ: 3, x + 1, 2*x - 1
                            </p>
                        </div>
                    </div>

                    <div className="text-gray-600 text-sm mt-4 p-3 bg-blue-50 rounded">
                        <strong>💡 Cách nhập:</strong><br />
                        • Căn bậc hai: sqrt(x) hoặc √x<br />
                        • Phép nhân: 2*x hoặc 2x<br />
                        • Phép chia: x/2<br />
                        • Lũy thừa: x^2, x^3<br />
                        • Hằng số: pi (π), e
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
                    {/* Original Equation */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phương trình gốc:</strong><br />
                            <div className="mt-2">
                                {result?.original_equation && (
                                    <div className="mt-2">
                                        {`$$${convertToLatex(result.original_equation)}$$`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Domain Conditions */}
                    {result?.domain_conditions && result.domain_conditions.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">⚠️</span>
                                Điều kiện xác định:
                            </h4>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                {result.domain_conditions.map((condition, index) => (
                                    <div key={index} className="tex2jax_process text-sm sm:text-base mb-2">
                                        {`$$${convertToLatex(condition)}$$`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Solutions */}
                    {result?.solutions && result.solutions.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">🎯</span>
                                Nghiệm của phương trình:
                            </h4>

                            <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                                <div className="px-3 sm:px-0">
                                    <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                        <thead className="bg-green-500 text-white">
                                            <tr>
                                                <th className={commonClasses.tableHeader}>STT</th>
                                                <th className={commonClasses.tableHeader}>Nghiệm</th>
                                                <th className={commonClasses.tableHeader}>Giá trị</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.solutions.map((solution, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                    <td className={`${commonClasses.tableCell} font-medium`}>{index + 1}</td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="tex2jax_process">
                                                            {`$x_{${index + 1}}$`}
                                                        </span>
                                                    </td>
                                                    <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                                        {parseFloat(solution).toFixed(4)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Final Result Summary */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">📋 Tóm tắt kết quả:</strong>

                            {/* Equation Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    {result?.original_equation && (
                                        <div className="mt-2">
                                            {`$$${convertToLatex(result.original_equation)}$$`}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-3 p-2 bg-green-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Trạng thái:</strong>
                                    <span className={`ml-2 font-bold ${result?.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                                        {result?.status === 'ok' ? '✅ Giải thành công' : '❌ Có lỗi xảy ra'}
                                    </span>
                                </div>
                            </div>

                            {/* Number of Solutions */}
                            {result?.solutions && (
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Số nghiệm:</strong>
                                        <span className="ml-2 font-bold text-blue-600">
                                            {result.solutions.length} nghiệm
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Solutions List */}
                            {result?.solutions && result.solutions.length > 0 && (
                                <div className="mt-3 p-2 bg-purple-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Tập nghiệm:</strong>
                                        <span className="ml-2 font-bold text-purple-600">
                                            S = {`{${result.solutions.map(sol => parseFloat(sol).toFixed(4)).join('; ')}}`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Lưu ý khi giải phương trình căn thức:
                            </h5>
                            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                <div>• Luôn kiểm tra điều kiện xác định trước khi giải</div>
                                <div>• Sau khi bình phương hai vế, cần thử lại nghiệm tìm được</div>
                                <div>• Nghiệm phải thỏa mãn cả điều kiện và phương trình gốc</div>
                                <div>• Có thể xuất hiện nghiệm ngoại lai khi bình phương hai vế</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default RootEquation;