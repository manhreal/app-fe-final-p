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

const InequalityQuadratic = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(1);
    const [b, setB] = useState(-3);
    const [c, setC] = useState(2);
    const [operator, setOperator] = useState('<');
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
        if (a === 0) return false; // Không phải phương trình bậc hai
        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionInequalityQuadratic({ a, b, c, operator }));
    };

    const operatorOptions = [
        { value: '<', label: '<', display: '<' },
        { value: '<=', label: '≤', display: '\\leq' },
        { value: '>', label: '>', display: '>' },
        { value: '>=', label: '≥', display: '\\geq' }
    ];

    // Parse solution interval
    const parseSolution = (solutionStr) => {
        if (!solutionStr) return null;

        // Parse interval notation like "Interval.open(1.00000000000000, 2.00000000000000)"
        const intervalMatch = solutionStr.match(/Interval\.(open|closed)\(([^,]+),\s*([^)]+)\)/);
        if (intervalMatch) {
            const [, type, start, end] = intervalMatch;
            const startNum = parseFloat(start);
            const endNum = parseFloat(end);
            return {
                type: type,
                start: startNum,
                end: endNum,
                startFormatted: Math.abs(startNum) < 0.001 ? '0' : startNum.toFixed(3),
                endFormatted: Math.abs(endNum) < 0.001 ? '0' : endNum.toFixed(3)
            };
        }

        return null;
    };

    const formatSolutionDisplay = (solution) => {
        if (!solution) return null;

        const interval = parseSolution(solution);
        if (!interval) {
            return solution; // Fallback to original string
        }

        const { type, startFormatted, endFormatted } = interval;
        const openBracket = type === 'open' ? '(' : '[';
        const closeBracket = type === 'open' ? ')' : ']';

        return `${openBracket}${startFormatted}; ${endFormatted}${closeBracket}`;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$ax^2 + bx + c \quad \underset{<, \leq, >, \geq}{\square} \quad 0$$`}
                description={
                    <>
                        Bất phương trình bậc hai một ẩn có dạng{' '}
                        <strong>ax² + bx + c {operator} 0</strong> với a ≠ 0.
                        <br />
                        Để giải, ta tìm nghiệm của phương trình ax² + bx + c = 0 và xét dấu tam thức.
                    </>
                }
                example={`Ví dụ: $x^2 - 3x + 2 < 0$ có nghiệm $x \\in (1; 2)$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$${a}x^2 + ${b >= 0 ? '+' : ''}${b}x + ${c >= 0 ? '+' : ''}${c} ${operatorOptions.find(op => op.value === operator)?.display || operator} 0$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số a (a ≠ 0)"
                            value={a}
                            onChange={(value) => setA(Number(value))}
                            step="any"
                            helpText="Hệ số của x² (khác 0)"
                        />

                        <InputField
                            label="Hệ số b"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            step="any"
                            helpText="Hệ số của x"
                        />

                        <InputField
                            label="Hệ số c"
                            value={c}
                            onChange={(value) => setC(Number(value))}
                            step="any"
                            helpText="Hệ số tự do"
                        />
                    </div>

                    {/* Operator Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Dấu bất phương trình
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {operatorOptions.map((op) => (
                                <button
                                    key={op.value}
                                    type="button"
                                    onClick={() => setOperator(op.value)}
                                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${operator === op.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="tex2jax_process font-medium text-lg">
                                        ${op.display}$
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {a === 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: a phải khác 0 để có bất phương trình bậc hai
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
                    {/* Original Inequality Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Bất phương trình cần giải:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$${a}x^2 + ${b >= 0 ? '+' : ''}${b}x + ${c >= 0 ? '+' : ''}${c} ${operatorOptions.find(op => op.value === operator)?.display || operator} 0$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết giải:
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
                                            Xác định bất phương trình bậc hai
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$$${a}x^2 + ${b >= 0 ? '+' : ''}${b}x + ${c >= 0 ? '+' : ''}${c} ${operatorOptions.find(op => op.value === operator)?.display || operator} 0$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính delta (Δ = b² - 4ac)
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$$\Delta = ${b}^2 - 4 \cdot ${a} \cdot ${c} = ${b * b - 4 * a * c}$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Giải và xét dấu tam thức
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {formatSolutionDisplay(result?.solution)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.solution && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Tập nghiệm:</strong>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {String.raw`$$x \in ${formatSolutionDisplay(result.solution)}$$`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Tập nghiệm của bất phương trình{' '}
                                        <span className="tex2jax_process">{String.raw`$${a}x^2 + ${b >= 0 ? '+' : ''}${b}x + ${c >= 0 ? '+' : ''}${c} ${operatorOptions.find(op => op.value === operator)?.display || operator} 0$`}</span>{' '}
                                        là <span className="font-bold text-blue-600">{formatSolutionDisplay(result.solution)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Lưu ý về ký hiệu:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>
                                        <strong>(a; b)</strong>: khoảng mở
                                    </div>
                                    <div>
                                        <strong>[a; b]</strong>: đoạn đóng
                                    </div>
                                    <div>
                                        <strong>(a; b]</strong>: nửa khoảng
                                    </div>
                                    <div>
                                        <strong>[a; b)</strong>: nửa khoảng
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

export default InequalityQuadratic;