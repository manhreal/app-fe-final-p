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

const RecursiveTerm = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a1, setA1] = useState(1);
    const [rule, setRule] = useState("a * 2 + 1");
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
        if (!rule || rule.trim() === '') return false;
        if (n <= 0) return false;
        if (!Number.isInteger(n)) return false;
        // Check if rule contains 'a' variable
        if (!rule.includes('a')) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionRecursiveTerm({ a1: Number(a1), rule: rule.trim(), n }));
    };

    // Format rule for LaTeX display
    const formatRuleForLatex = (ruleStr) => {
        return ruleStr
            .replace(/\*/g, ' \\cdot ')
            .replace(/a/g, 'a_n')
            .replace(/\+/g, ' + ')
            .replace(/-/g, ' - ');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$a_{n+1} = f(a_n), \quad a_1 = \text{giá trị ban đầu}$$`}
                description={
                    <>
                        Dãy số đệ quy là dãy số mà mỗi số hạng được xác định dựa trên{' '}
                        <strong>một hoặc nhiều số hạng trước đó</strong> theo một quy luật cố định
                    </>
                }
                example={`Ví dụ: $a_1 = 1$, quy luật $a_{n+1} = a_n \\cdot 2 + 1$ thì $a_4 = 15$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$a_{n+1} = f(a_n)$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <InputField
                            label="Số hạng đầu tiên (a₁)"
                            value={a1}
                            onChange={(value) => setA1(Number(value))}
                            type="number"
                            step="any"
                            helpText="Số thực"
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Quy luật đệ quy
                            </label>
                            <input
                                type="text"
                                value={rule}
                                onChange={(e) => setRule(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ví dụ: a * 2 + 1"
                                required
                            />
                            <div className="text-xs text-gray-500">
                                Sử dụng 'a' để biểu thị số hạng trước đó. Ví dụ: a * 2 + 1, a^2 - 3, a + 5
                            </div>
                        </div>

                        <InputField
                            label="Vị trí số hạng cần tìm (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {!validateInputs() && rule && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Quy luật phải chứa biến 'a' và n phải là số nguyên dương
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
                            <strong>Quy luật đệ quy:</strong><br />
                            <div className="mt-2">
                                {`$$a_1 = ${a1}$$`}
                                <br />
                                {`$$a_{n+1} = ${formatRuleForLatex(rule)}$$`}
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
                                        <th className={commonClasses.tableHeader}>Số hạng</th>
                                        <th className={commonClasses.tableHeader}>Công thức</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$a_1$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            Giá trị ban đầu
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold`}>
                                            {a1}
                                        </td>
                                    </tr>
                                    {Array.from({ length: n - 1 }, (_, i) => i + 2).map((step) => (
                                        <tr key={step} className={`${step % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                                            <td className={`${commonClasses.tableCell} font-medium`}>{step}</td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {`$a_{${step}}$`}
                                                </span>
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {`$${formatRuleForLatex(rule).replace('a_n', `a_{${step - 1}}`)}$`}
                                                </span>
                                            </td>
                                            <td className={`${commonClasses.tableCell} ${step === n ? 'font-bold text-blue-600' : ''}`}>
                                                {step === n ? result?.value : '...'}
                                            </td>
                                        </tr>
                                    ))}
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
                                            {`$a_{${n}} = ?$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {`$a_{${n}} = ${result.value}$`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Số hạng thứ {n} của dãy đệ quy với số hạng đầu <span className="font-bold text-blue-600">{a1}</span> và quy luật "{rule}" là <span className="font-bold text-blue-600">{result.value}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Về dãy số đệ quy:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    <div>
                                        • Mỗi số hạng phụ thuộc vào số hạng trước đó
                                    </div>
                                    <div>
                                        • Cần biết số hạng đầu và quy luật để tính toàn bộ dãy
                                    </div>
                                    <div>
                                        • Ví dụ nổi tiếng: Dãy Fibonacci với quy luật {`$a_{n+1} = a_n + a_{n-1}$`}
                                    </div>
                                    <div>
                                        • Có thể mô hình hóa nhiều hiện tượng tự nhiên và kinh tế
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

export default RecursiveTerm;