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

const BinomialTheorem = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(1);
    const [b, setB] = useState(2);
    const [n, setN] = useState(3);
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
        if (n < 0) return false;
        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isInteger(n)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionBinomialTheorem({ a, b, n }));
    };

    // Format term for display
    const formatTerm = (termStr) => {
        return termStr
            .replace(/·/g, ' \\cdot ')
            .replace(/\^(\d+)/g, '^{$1}')
            .replace(/(\d+\.?\d*)/g, '$1');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$(a + b)^n = \sum_{k = 0}^{n} \binom{n}{k} a^{n - k} b^k$$`}
                description={
                    <>
                        Trong đó:{' '}
                        <span className="tex2jax_process">
                            {String.raw`$\binom{n}{k} = \frac{n!}{k!(n - k)!}$`}
                        </span>
                        {' '}là hệ số nhị thức
                    </>
                }
                example="$(x + y)^3 = x^3 + 3x^2y + 3xy^2 + y^3$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$(a + b)^n$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số a"
                            value={a}
                            onChange={(value) => setA(Number(value))}
                            step="0.1"
                            helpText="Số thực bất kỳ"
                        />

                        <InputField
                            label="Hệ số b"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            step="0.1"
                            helpText="Số thực bất kỳ"
                        />

                        <InputField
                            label="Số mũ n"
                            value={n}
                            onChange={(value) => setN(Math.max(0, Math.floor(Number(value))))}
                            min="0"
                            step="1"
                            helpText="Số nguyên không âm"
                        />
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
                    {/* Original Formula */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức gốc:</strong><br />
                            <div className="mt-2">
                                {result?.formula && (
                                    <div className="mt-2">
                                        $${result.formula.replace(/\^(\d+)/g, '^{$1}')}$$
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết từng hạng tử:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[500px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>k</th>
                                        <th className={commonClasses.tableHeader}>
                                            <div className="flex flex-col">
                                                <span>Hệ số</span>
                                                <span className="tex2jax_process text-xs">{String.raw`$\binom{n}{k}$`}</span>
                                            </div>
                                        </th>
                                        <th className={commonClasses.tableHeader}>Hạng tử</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.expansion?.map((item, idx) => (
                                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                            <td className={`${commonClasses.tableCell} font-medium`}>{item.k}</td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {String.raw`$\binom{${result.inputValues?.n || item.k + (result.expansion?.length - 1 - item.k)}}{${item.k}} = ${item.coefficient}$`}
                                                </span>
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <div className="overflow-x-auto">
                                                    <span className="tex2jax_process text-xs sm:text-sm whitespace-nowrap">
                                                        ${formatTerm(item.term)}$
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`${commonClasses.tableCell} font-bold text-blue-600 break-all`}>
                                                {item.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {result.total !== undefined && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Original Formula */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        {result?.formula && (
                                            <div className="mt-2">
                                                $${result.formula.replace(/\^(\d+)/g, '^{$1}')}$$
                                            </div>
                                        )}

                                    </div>
                                </div>

                                {/* Expansion */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-xs sm:text-lg font-semibold text-blue-600">
                                        <div className="mt-1">
                                            {result.expansion?.map((item, idx) => (
                                                <span key={idx} className="inline-block">
                                                    {idx === 0 ? '' : ' + '}
                                                    <span className="whitespace-nowrap">
                                                        ${formatTerm(item.term)}$
                                                    </span>
                                                    {/* Break line after every 2 terms on mobile */}
                                                    <span className="sm:hidden">
                                                        {idx > 0 && idx % 2 === 0 ? <br /> : ''}
                                                    </span>
                                                    {/* Break line after every 4 terms on tablet */}
                                                    <span className="hidden sm:inline lg:hidden">
                                                        {idx > 0 && idx % 4 === 0 ? <br /> : ''}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Final Value */}
                                <div className="mt-3 p-2 bg-white rounded border">
                                    <div className="text-xs sm:text-sm font-semibold">
                                        = {result.total}
                                    </div>
                                </div>
                            </div>

                            {result.verification !== undefined && (
                                <p className="text-center mt-3 text-green-800 text-xs sm:text-sm lg:text-base">
                                    <span className="mr-1">✅</span>
                                    <strong>Kiểm tra:</strong> <span className="break-all">{result.verification}</span> (chính xác!)
                                </p>
                            )}
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default BinomialTheorem;