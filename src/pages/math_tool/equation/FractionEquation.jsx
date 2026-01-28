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

const FractionEquation = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [left, setLeft] = useState('(x + 1)/(x - 2)');
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
    }, [result, mathJaxReady, left, right]);

    // Input validation
    const validateInputs = () => {
        if (!left.trim() || !right.trim()) return false;
        return true;
    };

    // Convert fraction string to LaTeX format for display
    const formatToLatex = (expression) => {
        if (!expression) return '';

        // Find and replace fractions with LaTeX format
        // Pattern: (numerator)/(denominator) -> \frac{numerator}{denominator}
        let result = expression;

        // Replace fractions like (x+1)/(x-2) with \frac{x+1}{x-2}
        result = result.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');

        // Replace simple fractions like x/(x-2) with \frac{x}{x-2}
        result = result.replace(/([^/\s]+)\/\(([^)]+)\)/g, '\\frac{$1}{$2}');

        // Replace fractions like (x+1)/2 with \frac{x+1}{2}
        result = result.replace(/\(([^)]+)\)\/([^/\s]+)/g, '\\frac{$1}{$2}');

        // Replace simple fractions like x/2 with \frac{x}{2}
        result = result.replace(/([^/\s]+)\/([^/\s]+)/g, '\\frac{$1}{$2}');

        return result;
    };

    // Helper function to format solution to LaTeX
    const formatSolutionToLatex = (solution) => {
        if (!solution) return '';

        // Check if solution contains fraction (has '/')
        if (solution.includes('/')) {
            const parts = solution.split('/');
            if (parts.length === 2) {
                return `\\frac{${parts[0].trim()}}{${parts[1].trim()}}`;
            }
        }

        // Return as-is if not a fraction
        return solution;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionFraction({ left, right }));
    };

    const displayEquation = () => {
        const leftLatex = formatToLatex(left);
        const rightLatex = formatToLatex(right);
        return `${leftLatex} = ${rightLatex}`;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\frac{P(x)}{Q(x)} = R(x)$$`}
                description={
                    <>
                        Phương trình chứa phân thức là phương trình có dạng{' '}
                        <strong>phân thức đại số</strong> chứa ẩn ở mẫu số
                    </>
                }
                example={String.raw`$\frac{x+1}{x-2} = 3 \Rightarrow x+1 = 3(x-2)$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {left && right && (
                            <div>
                                $${displayEquation()}$$
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vế trái (Left Side)
                            </label>
                            <input
                                type="text"
                                value={left}
                                onChange={(e) => setLeft(e.target.value)}
                                placeholder="Ví dụ: (x + 1)/(x - 2)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500">
                                Nhập biểu thức phân thức (sử dụng / cho phép chia)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Vế phải (Right Side)
                            </label>
                            <input
                                type="text"
                                value={right}
                                onChange={(e) => setRight(e.target.value)}
                                placeholder="Ví dụ: 3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500">
                                Nhập biểu thức hoặc số
                            </p>
                        </div>
                    </div>

                    <div className="text-gray-600 text-sm mt-2 p-3 bg-blue-50 rounded">
                        <strong>💡 Hướng dẫn nhập:</strong>
                        <ul className="mt-2 space-y-1">
                            <li>• Sử dụng <code>/</code> cho phép chia: <code>(x+1)/(x-2)</code></li>
                            <li>• Sử dụng dấu ngoặc để nhóm: <code>(2x+1)/(x-3)</code></li>
                            <li>• Có thể nhập số hoặc biểu thức ở vế phải: <code>3</code> hoặc <code>2x+1</code></li>
                        </ul>
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
                    {/* Equation Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phương trình:</strong><br />
                            <div className="mt-2">
                                $${displayEquation()}$$
                            </div>
                        </div>
                    </div>

                    {/* Domain */}
                    {result?.domain && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                                <span className="mr-2">⚠️</span>
                                Điều kiện xác định:
                            </h4>
                            <div className="tex2jax_process text-sm sm:text-base text-yellow-700">
                                $${result.domain.replace(/≠/g, '\\neq')}$$
                            </div>
                        </div>
                    )}

                    {/* Solutions */}
                    {result?.solutions && result.solutions.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">✅</span>
                                Nghiệm của phương trình:
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                {result.solutions.map((solution, index) => (
                                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                        <div className="text-sm text-gray-600 mb-1">Nghiệm {index + 1}:</div>
                                        <div className="tex2jax_process text-lg font-bold text-green-600">
                                            $$x = {formatSolutionToLatex(solution)}$$
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status and Summary */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Tổng kết:</strong>

                            {/* Equation Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        $${displayEquation()}$$
                                    </div>
                                </div>
                            </div>

                            {/* Solution Summary */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-sm sm:text-base text-gray-700">
                                    <strong>Trạng thái:</strong> <span className="text-green-600 font-semibold">{result.status === 'ok' ? 'Đã giải xong' : 'Có lỗi'}</span>
                                </div>
                                {result.solutions && result.solutions.length > 0 && (
                                    <div className="text-sm sm:text-base text-gray-700 mt-2">
                                        <strong>Số nghiệm:</strong> <span className="text-blue-600 font-semibold">{result.solutions.length}</span>
                                    </div>
                                )}
                            </div>

                            {/* Solution List */}
                            {result.solutions && result.solutions.length > 0 && (
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Tập nghiệm:</strong>
                                        <div className="tex2jax_process mt-1">
                                            {`$$S = \\left\\{ ${result.solutions
                                                .map(solution => formatSolutionToLatex(solution))
                                                .join('; ')
                                                } \\right\\}$$`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Solution Steps Info */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Các bước giải phương trình phân thức:
                            </h5>
                            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                <div>1. Tìm điều kiện xác định (mẫu số ≠ 0)</div>
                                <div>2. Quy đồng mẫu số hai vế (nếu cần)</div>
                                <div>3. Khử mẫu số và giải phương trình</div>
                                <div>4. Kiểm tra nghiệm với điều kiện xác định</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default FractionEquation;