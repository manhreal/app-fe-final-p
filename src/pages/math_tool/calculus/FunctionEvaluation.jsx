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

const FunctionEvaluation = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression, setExpression] = useState('2*x**2 + 3*x - 5');
    const [x, setX] = useState(2);
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
        if (isNaN(x) || x === '') return false;
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
            .replace(/^\s*-\s*/, '-');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionEvaluate({ expression: expression.trim(), x: parseFloat(x) }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$f(x) = \text{biểu thức chứa } x$$`}
                description={
                    <>
                        Tính giá trị của hàm số tại một điểm cụ thể x. Hàm số có thể chứa các phép toán cơ bản như{' '}
                        <strong>cộng, trừ, nhân, chia, lũy thừa</strong>
                    </>
                }
                example="$f(x) = 2x^2 + 3x - 5$ tại $x = 2$ có giá trị $f(2) = 2 \cdot 2^2 + 3 \cdot 2 - 5 = 9$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$f(x) = {expression ? expressionToLatex(expression) : '...'}$$
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
                                placeholder="Ví dụ: 2*x**2 + 3*x - 5"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Sử dụng ** cho lũy thừa, * cho nhân. Ví dụ: x**2, 2*x, sin(x), cos(x)
                            </div>
                        </div>

                        <InputField
                            label="Giá trị x"
                            value={x}
                            onChange={(value) => setX(parseFloat(value) || 0)}
                            step="any"
                            helpText="Số thực bất kỳ"
                        />
                    </div>

                    {!validateInputs() && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Vui lòng nhập biểu thức hợp lệ và giá trị x
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
                    {/* Function Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hàm số:</strong><br />
                            <div className="mt-2">
                                $$f(x) = {result?.expression ? expressionToLatex(result.expression) : expressionToLatex(expression)}$$
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
                                            Thay x = {result?.x || x} vào hàm số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                $f({result?.x || x}) = {(result?.expression || expression).replace(/x/g, `(${result?.x || x})`)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.value}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.value !== undefined && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            $f({result?.x || x}) = {result?.value}$
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result?.value}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Giá trị của hàm số $f(x) = {result?.expression ? expressionToLatex(result.expression) : expressionToLatex(expression)}$
                                        tại điểm $x = {result?.x || x}$ là <span className="font-bold text-blue-600">{result?.value}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Tips */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Mẹo sử dụng:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>
                                        Lũy thừa: x**2, x**3
                                    </div>
                                    <div>
                                        Nhân: 2*x, x*y
                                    </div>
                                    <div>
                                        Hàm lượng giác: sin(x), cos(x)
                                    </div>
                                    <div>
                                        Logarit: log(x), ln(x)
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

export default FunctionEvaluation;