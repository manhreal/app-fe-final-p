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

const PrimeFactors = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [n, setN] = useState(90);
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
        if (n < 2) return false;
        if (!Number.isInteger(n)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionPrimeFactors({ n }));
    };

    // Helper function to group factors and create LaTeX representation
    const formatFactorsAsLatex = (factors) => {
        if (!factors || factors.length === 0) return '';

        // Count occurrences of each factor
        const factorCounts = {};
        factors.forEach(factor => {
            factorCounts[factor] = (factorCounts[factor] || 0) + 1;
        });

        // Create LaTeX string
        const factorParts = Object.entries(factorCounts)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([factor, count]) => {
                return count === 1 ? factor : `${factor}^{${count}}`;
            });

        return factorParts.join(' \\times ');
    };

    // Helper function to create step-by-step division process
    const generateDivisionSteps = (originalN, factors) => {
        if (!factors || factors.length === 0) return [];

        const steps = [];
        let currentN = originalN;

        for (let i = 0; i < factors.length; i++) {
            const factor = factors[i];
            const nextN = currentN / factor;
            steps.push({
                step: i + 1,
                operation: `${currentN} \\div ${factor} = ${nextN}`,
                description: `Chia cho ${factor}`,
                result: nextN
            });
            currentN = nextN;
        }

        return steps;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="🔢"
                formula={String.raw`$$n = p_1^{a_1} \times p_2^{a_2} \times \ldots \times p_k^{a_k}$$`}
                description={
                    <>
                        Phân tích thừa số nguyên tố là việc biểu diễn một số nguyên dương thành{' '}
                        <strong>tích của các số nguyên tố</strong>
                    </>
                }
                example="$90 = 2 \\times 3^2 \\times 5$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$n = p_1^{a_1} \times p_2^{a_2} \times \ldots \times p_k^{a_k}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <InputField
                            label="Số cần phân tích (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(2, Math.floor(Number(value))))}
                            min="2"
                            step="1"
                            helpText="Số nguyên dương lớn hơn hoặc bằng 2"
                        />
                    </div>

                    {n < 2 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: n phải lớn hơn hoặc bằng 2
                        </div>
                    )}

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && result.factors && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phân tích:</strong><br />
                            <div className="mt-2">
                                {`$$${n} = ${formatFactorsAsLatex(result.factors)}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết quá trình phân tích:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Phép chia</th>
                                        <th className={commonClasses.tableHeader}>Thừa số</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateDivisionSteps(n, result.factors).map((step, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                                            <td className={`${commonClasses.tableCell} font-medium`}>{step.step}</td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    ${step.operation}$
                                                </span>
                                            </td>
                                            <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                                {result.factors[index]}
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                {step.result}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                            {/* Formula Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {`$$${n} = ${formatFactorsAsLatex(result.factors)}$$`}
                                    </div>
                                </div>
                            </div>

                            {/* Factors List */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                                    Các thừa số nguyên tố:
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {result.factors.map((factor, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {factor}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Số {n} được phân tích thành tích của{' '}
                                    <span className="font-bold text-blue-600">{result.factors.length}</span> thừa số nguyên tố:
                                    {' '}{result.factors.join(' × ')}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Thông tin bổ sung:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    <strong>Số thừa số:</strong> {result.factors.length}
                                </div>
                                <div>
                                    <strong>Các thừa số khác nhau:</strong>{' '}
                                    {[...new Set(result.factors)].length}
                                </div>
                                <div>
                                    <strong>Thừa số nhỏ nhất:</strong> {Math.min(...result.factors)}
                                </div>
                                <div>
                                    <strong>Thừa số lớn nhất:</strong> {Math.max(...result.factors)}
                                </div>
                            </div>
                        </div>

                        {/* Mathematical Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                🔬 Tính chất toán học:
                            </h5>
                            <div className="text-xs text-gray-600 space-y-1">
                                <div>• Mỗi số nguyên dương đều có phân tích thừa số nguyên tố duy nhất</div>
                                <div>• Phân tích thừa số giúp tìm ƯCLN và BCNN</div>
                                <div>• Số nguyên tố chỉ có một thừa số nguyên tố là chính nó</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default PrimeFactors;