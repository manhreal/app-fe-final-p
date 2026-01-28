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

const ArithmeticSum = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a1, setA1] = useState(1);
    const [d, setD] = useState(3);
    const [n, setN] = useState(4);
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
        if (n <= 0) return false;
        if (!Number.isInteger(n)) return false;
        if (isNaN(a1) || isNaN(d)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionArithmeticSum({ a1, d, n }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$S_n = \frac{n}{2}[2a_1 + (n-1)d]$$`}
                description={
                    <>
                        Tổng n số hạng đầu tiên của cấp số cộng với{' '}
                        <strong>số hạng đầu a₁ và công sai d</strong>
                    </>
                }
                example={`$S_4 = \\frac{4}{2}[2 \\cdot 1 + (4-1) \\cdot 3] = 2[2 + 9] = 22$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$S_n = \\frac{n}{2}[2a_1 + (n-1)d]$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Số hạng đầu (a₁)"
                            value={a1}
                            onChange={(value) => setA1(Number(value))}
                            step="any"
                            helpText="Số thực"
                        />

                        <InputField
                            label="Công sai (d)"
                            value={d}
                            onChange={(value) => setD(Number(value))}
                            step="any"
                            helpText="Số thực"
                        />

                        <InputField
                            label="Số số hạng (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {n <= 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: n phải là số nguyên dương
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
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {`$$S_{${n}} = \\frac{${n}}{2}[2 \\cdot ${a1} + (${n}-1) \\cdot ${d}]$$`}
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
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Áp dụng công thức: $S_n = \\frac{n}{2}[2a_1 + (n-1)d]$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$S_{${n}} = \\frac{${n}}{2}[2 \\cdot ${a1} + (${n}-1) \\cdot ${d}]$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính trong ngoặc vuông
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$2 \\cdot ${a1} + (${n}-1) \\cdot ${d} = ${2 * a1} + ${(n - 1) * d} = ${2 * a1 + (n - 1) * d}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tổng cuối cùng
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$S_{${n}} = \\frac{${n}}{2} \\cdot ${2 * a1 + (n - 1) * d} = ${n / 2} \\cdot ${2 * a1 + (n - 1) * d}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
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
                    {result?.value && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$S_{${n}} = \\frac{${n}}{2}[2 \\cdot ${a1} + (${n}-1) \\cdot ${d}]$`}
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
                                        <strong>Ý nghĩa:</strong> Tổng của {n} số hạng đầu tiên trong cấp số cộng
                                        (với a₁ = {a1}, d = {d}) là <span className="font-bold text-blue-600">{result?.value}</span>
                                    </div>
                                </div>

                                {/* Sequence Display */}
                                <div className="mt-3 p-2 bg-green-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Dãy số:</strong>
                                        <div className="mt-1 tex2jax_process">
                                            {Array.from({ length: Math.min(n, 8) }, (_, i) => a1 + i * d).join(', ')}
                                            {n > 8 && ', ...'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Công thức khác của cấp số cộng:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`$a_n = a_1 + (n-1)d$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$S_n = \\frac{n(a_1 + a_n)}{2}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$a_n = \\frac{a_{n-1} + a_{n+1}}{2}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$S_n - S_{n-1} = a_n$`}
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

export default ArithmeticSum;