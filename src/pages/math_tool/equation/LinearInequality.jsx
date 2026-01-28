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

const LinearInequality = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(2);
    const [b, setB] = useState(-4);
    const [operator, setOperator] = useState('>');
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
        if (a === 0) return false;
        if (isNaN(a) || isNaN(b)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionInequalityLinear({ a, b, operator }));
    };

    // Format solution for display
    const formatSolution = (solution) => {
        if (!solution) return '';

        // Parse interval notation
        if (solution.includes('Interval.open')) {
            const match = solution.match(/Interval\.open\((.*?),\s*(.*?)\)/);
            if (match) {
                const start = match[1];
                const end = match[2];
                if (end === 'oo') {
                    return `x \\in (${start}, +\\infty)`;
                } else if (start === '-oo') {
                    return `x \\in (-\\infty, ${end})`;
                } else {
                    return `x \\in (${start}, ${end})`;
                }
            }
        }

        if (solution.includes('Interval')) {
            const match = solution.match(/Interval\((.*?),\s*(.*?)\)/);
            if (match) {
                const start = match[1];
                const end = match[2];
                if (end === 'oo') {
                    return `x \\in [${start}, +\\infty)`;
                } else if (start === '-oo') {
                    return `x \\in (-\\infty, ${end}]`;
                } else {
                    return `x \\in [${start}, ${end}]`;
                }
            }
        }

        return solution;
    };

    // Get operator display
    const getOperatorDisplay = () => {
        switch (operator) {
            case '>': return '>';
            case '<': return '<';
            case '>=': return '\\geq';
            case '<=': return '\\leq';
            default: return '>';
        }
    };

    // Get solution step explanation
    const getSolutionSteps = () => {
        const steps = [];

        steps.push({
            step: 1,
            description: `Bất phương trình ban đầu: $${a}x + (${b}) ${getOperatorDisplay()} 0$`,
            value: `$${a}x + (${b}) ${getOperatorDisplay()} 0$`
        });

        if (b !== 0) {
            const moveB = -b;
            steps.push({
                step: 2,
                description: `Chuyển vế số hạng tự do`,
                value: `$${a}x ${getOperatorDisplay()} ${moveB}$`
            });
        }

        if (a !== 1) {
            const solution = -b / a;
            const newOperator = a > 0 ? getOperatorDisplay() : (
                operator === '>' ? '<' :
                    operator === '<' ? '>' :
                        operator === '>=' ? '\\leq' : '\\geq'
            );

            steps.push({
                step: steps.length + 1,
                description: `Chia hai vế cho ${a} ${a < 0 ? '(đổi chiều bất phương trình)' : ''}`,
                value: `$x ${newOperator} ${solution}$`
            });
        }

        return steps;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$ax + b \sim 0$$`}
                description={
                    <>
                        Bất phương trình bậc nhất một ẩn có dạng ax + b ~ 0, trong đó{' '}
                        <strong>a ≠ 0</strong> và ~ là một trong các dấu: {'>'}, {'<'}, ≥, ≤
                    </>
                }
                example="Ví dụ: $2x - 4 > 0 \\Rightarrow x > 2$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$${a}x + (${b}) ${getOperatorDisplay()} 0$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số a"
                            value={a}
                            onChange={(value) => setA(Number(value))}
                            step="any"
                            helpText="Hệ số của x (a ≠ 0)"
                        />

                        <InputField
                            label="Hệ số b"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            step="any"
                            helpText="Số hạng tự do"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dấu bất phương trình
                            </label>
                            <select
                                value={operator}
                                onChange={(e) => setOperator(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value=">">{'>'} (lớn hơn)</option>
                                <option value="<">{'<'} (nhỏ hơn)</option>
                                <option value=">=">{'>='} (lớn hơn hoặc bằng)</option>
                                <option value="<=">{'>='} (nhỏ hơn hoặc bằng)</option>
                            </select>
                        </div>
                    </div>

                    {a === 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Hệ số a phải khác 0
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
                    {/* Original equation */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Bất phương trình:</strong><br />
                            <div className="mt-2">
                                {`$$${a}x + (${b}) ${getOperatorDisplay()} 0$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Các bước giải:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Mô tả</th>
                                        <th className={commonClasses.tableHeader}>Biểu thức</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSolutionSteps().map((step, index) => (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                            <td className={`${commonClasses.tableCell} font-medium`}>{step.step}</td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {step.description}
                                                </span>
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                    {step.value}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.solution && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Nghiệm của bất phương trình:</strong>

                                {/* Solution Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$$${formatSolution(result.solution)}$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {`$${formatSolution(result.solution)}$`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Tập nghiệm của bất phương trình là <span className="font-bold text-blue-600">{formatSolution(result.solution)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Lưu ý khi giải bất phương trình:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    <div>
                                        • Khi nhân/chia hai vế với số âm, phải đổi chiều bất phương trình
                                    </div>
                                    <div>
                                        • Dấu ngoặc đơn ( ) nghĩa là không bao gồm điểm biên
                                    </div>
                                    <div>
                                        • Dấu ngoặc vuông [ ] nghĩa là có bao gồm điểm biên
                                    </div>
                                    <div>
                                        • ∞ (vô cực) luôn dùng ngoặc đơn
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

export default LinearInequality;