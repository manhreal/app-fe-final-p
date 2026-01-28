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

const IntegralSimple = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression, setExpression] = useState('x**2 + 3*x + 1');
    const [a, setA] = useState(0);
    const [b, setB] = useState(2);
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
        if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
        return true;
    };

    // Convert expression to LaTeX format for display
    const formatExpressionForDisplay = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, ' \\cdot ')
            .replace(/x\^/g, 'x^')
            .replace(/\+/g, ' + ')
            .replace(/-/g, ' - ');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionIntegralSimple({
            expression,
            a: Number(a),
            b: Number(b)
        }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="∫"
                formula={String.raw`$$\int_{a}^{b} f(x) \, dx = F(b) - F(a)$$`}
                description={
                    <>
                        Tích phân xác định của hàm số f(x) từ a đến b, với F(x) là{' '}
                        <strong>nguyên hàm của f(x)</strong>
                    </>
                }
                example="$\int_{0}^{2} (x^2 + 3x + 1) \, dx = \left[\frac{x^3}{3} + \frac{3x^2}{2} + x\right]_0^2$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$\int_{a}^{b} f(x) \, dx$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <InputField
                            label="Biểu thức f(x)"
                            value={expression}
                            onChange={(value) => setExpression(value)}
                            type="text"
                            placeholder="Ví dụ: x**2 + 3*x + 1"
                            helpText="Nhập biểu thức (sử dụng ** cho lũy thừa, * cho phép nhân)"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <InputField
                                label="Cận dưới (a)"
                                value={a}
                                onChange={(value) => setA(Number(value))}
                                type="number"
                                step="0.1"
                                helpText="Giá trị số thực"
                            />

                            <InputField
                                label="Cận trên (b)"
                                value={b}
                                onChange={(value) => setB(Number(value))}
                                type="number"
                                step="0.1"
                                helpText="Giá trị số thực"
                            />
                        </div>
                    </div>

                    {/* Preview expression */}
                    {expression && (
                        <div className="bg-blue-50 p-4 rounded-lg border">
                            <div className="text-sm text-gray-700 mb-2">
                                <strong>Xem trước biểu thức:</strong>
                            </div>
                            <div className={`${commonClasses.mathDisplay}`}>
                                <div className="tex2jax_process text-sm">
                                    {"$$\\int_{" + a + "}^{" + b + "} (" + formatExpressionForDisplay(expression) + ") \\, dx$$"}
                                </div>
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
                    {/* Expression Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Biểu thức tính toán:</strong><br />
                            <div className="mt-2">
                                {"$$\\int_{" + (result?.lower || a) + "}^{" + (result?.upper || b) + "} (" +
                                    formatExpressionForDisplay(result?.expression || expression) +
                                    ") \\, dx$$"}
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
                                            Xác định biểu thức và cận
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $f(x) = {formatExpressionForDisplay(result?.expression || expression)}$
                                            </span>
                                            <br />
                                            <span className="text-xs sm:text-sm">
                                                Cận: [{result?.lower || a}, {result?.upper || b}]
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Áp dụng công thức tích phân xác định
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {"$\\int_{" + (result?.lower || a) + "}^{" + (result?.upper || b) + "} f(x) \\, dx$"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.integral ? Number(result.integral).toFixed(6) : 'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.integral !== undefined && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">∫ Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {"$$\\int_{" + result?.lower + "}^{" + result?.upper + "} (" +
                                                formatExpressionForDisplay(result?.expression) +
                                                ") \\, dx$$"}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                                        {Number(result.integral).toFixed(6)}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Diện tích dưới đường cong của hàm số{' '}
                                        <span className="tex2jax_process">$f(x) = {formatExpressionForDisplay(result?.expression)}$</span>{' '}
                                        từ <span className="font-bold text-blue-600">{result?.lower}</span> đến{' '}
                                        <span className="font-bold text-blue-600">{result?.upper}</span> là{' '}
                                        <span className="font-bold text-blue-600">{Number(result.integral).toFixed(6)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của tích phân:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        $\int_a^b f(x) dx = -\int_b^a f(x) dx$
                                    </div>
                                    <div className="tex2jax_process">
                                        $\int_a^a f(x) dx = 0$
                                    </div>
                                    <div className="tex2jax_process">
                                        $\int_a^b [f(x) + g(x)] dx = \int_a^b f(x) dx + \int_a^b g(x) dx$
                                    </div>
                                    <div className="tex2jax_process">
                                        $\int_a^c f(x) dx = \int_a^b f(x) dx + \int_b^c f(x) dx$
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

export default IntegralSimple;