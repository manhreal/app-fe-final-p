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

const Derivative = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression, setExpression] = useState('x**3 + 2*x**2 - 5*x + 7');
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

    // Convert expression to LaTeX format for display
    const expressionToLatex = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, ' \\cdot ')
            .replace(/\+/g, ' + ')
            .replace(/-/g, ' - ')
            .replace(/\s+-\s+/g, ' - ')
            .replace(/^\s*-\s*/, '-')
            .replace(/sin\(/g, '\\sin(')
            .replace(/cos\(/g, '\\cos(')
            .replace(/tan\(/g, '\\tan(')
            .replace(/ln\(/g, '\\ln(')
            .replace(/log\(/g, '\\log(')
            .replace(/exp\(/g, '\\exp(')
            .replace(/sqrt\(/g, '\\sqrt{')
            .replace(/\)$/g, '}');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionDerivative({
            expression: expression.trim()
        }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\frac{d}{dx}f(x) = f'(x)$$`}
                description={
                    <>
                        Đạo hàm của hàm số f(x) theo biến x, ký hiệu là f'(x) hoặc df/dx. Đạo hàm biểu thị{' '}
                        <strong>tốc độ thay đổi tức thời</strong> của hàm số tại một điểm
                    </>
                }
                example="$\\frac{d}{dx}(x^3 + 2x^2 - 5x + 7) = 3x^2 + 4x - 5$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $f(x) = {expression ? expressionToLatex(expression) : '...'}$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Biểu thức f(x)
                            </label>
                            <input
                                type="text"
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Ví dụ: x**3 + 2*x**2 - 5*x + 7"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Sử dụng ** cho lũy thừa, * cho nhân. Ví dụ: x**2, 2*x, sin(x), cos(x), ln(x)
                            </div>
                        </div>
                    </div>

                    {!validateInputs() && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Vui lòng nhập biểu thức hợp lệ
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
                    {/* Original Function Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hàm số gốc:</strong><br />
                            <div className="mt-2">
                                $f(x) = {result?.expression ? expressionToLatex(result.expression) : expressionToLatex(expression)}$
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
                                            Hàm số ban đầu
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $f(x) = {result?.expression ? expressionToLatex(result.expression) : expressionToLatex(expression)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Áp dụng quy tắc đạo hàm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {"$\\frac{d}{dx}[" +
                                                    (result?.expression
                                                        ? expressionToLatex(result.expression)
                                                        : expressionToLatex(expression)
                                                    ) +
                                                    "]$"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả đạo hàm
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                ${result?.derivative ? expressionToLatex(result.derivative) : '...'}$
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.derivative && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {"$f'(x) = \\frac{d}{dx}f(x)$"}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${expressionToLatex(result.derivative)}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Đạo hàm của hàm số $f(x) = {result?.expression ? expressionToLatex(result.expression) : expressionToLatex(expression)}$
                                        theo biến $x$ là <span className="font-bold text-blue-600">${expressionToLatex(result.derivative)}$</span>
                                    </div>
                                </div>
                            </div>

                            {/* Derivative Rules */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Quy tắc đạo hàm cơ bản:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {"$(x^n)' = n \\cdot x^{n - 1}$"}
                                    </div>
                                    <div className="tex2jax_process">
                                        $(c)' = 0$ (c là hằng số)
                                    </div>
                                    <div className="tex2jax_process">
                                        $(\\sin x)' = \\cos x$
                                    </div>
                                    <div className="tex2jax_process">
                                        $(\\cos x)' = -\\sin x$
                                    </div>
                                    <div className="tex2jax_process">
                                        $(e^x)' = e^x$
                                    </div>
                                    <div className="tex2jax_process">
                                        {"$(\\ln x)' = \\frac{1}{x}$"}
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

export default Derivative;