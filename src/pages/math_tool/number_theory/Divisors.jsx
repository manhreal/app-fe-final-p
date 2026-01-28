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

const Divisors = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [n, setN] = useState(12);
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
        if (n < 1) return false;
        if (!Number.isInteger(n)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionDivisors({ n }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$d | n \Leftrightarrow \exists k \in \mathbb{Z}: n = k \cdot d$$`}
                description={
                    <>
                        Ước số của n là số nguyên dương d sao cho n chia hết cho d.{' '}
                        <strong>Ví dụ:</strong> Các ước của 12 là {`1, 2, 3, 4, 6, 12`}
                    </>
                }
                example="$12 \div 1 = 12$, $12 \div 2 = 6$, $12 \div 3 = 4$, ..."
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Tìm tất cả ước của số } n$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
                        <InputField
                            label="Số cần tìm ước (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {n < 1 && (
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

            {result && result.divisors && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Divisors List */}
                    <div className="mb-6">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="mr-2">📋</span>
                            Danh sách tất cả ước của {n}:
                        </h4>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex flex-wrap gap-2 justify-center">
                                {result.divisors.map((divisor) => (
                                    <div
                                        key={divisor}
                                        className="bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-300 font-semibold text-blue-700"
                                    >
                                        {divisor}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-center text-sm text-gray-600">
                                Tổng cộng: <span className="font-bold text-blue-600">{result.divisors.length}</span> ước số
                            </div>
                        </div>
                    </div>

                    {/* Mathematical Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                            <strong>Biểu diễn toán học:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$D(${n}) = \{${result.divisors.join(', ')}\}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step analysis */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết phân tích:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Ước số</th>
                                        <th className={commonClasses.tableHeader}>Phép chia</th>
                                        <th className={commonClasses.tableHeader}>Thương</th>
                                        <th className={commonClasses.tableHeader}>Kiểm tra</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.divisors.map((divisor, index) => (
                                        <tr key={divisor} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className={`${commonClasses.tableCell} font-medium text-blue-600`}>
                                                {divisor}
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {String.raw`$${n} \div ${divisor}$`}
                                                </span>
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                {Math.floor(n / divisor)}
                                            </td>
                                            <td className={`${commonClasses.tableCell} text-green-600 font-medium`}>
                                                ✓ Chia hết
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="mb-6">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="mr-2">📊</span>
                            Thống kê:
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {result.divisors.length}
                                </div>
                                <div className="text-sm text-gray-600">Số lượng ước</div>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {result.divisors[0]}
                                </div>
                                <div className="text-sm text-gray-600">Ước nhỏ nhất</div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {result.divisors[result.divisors.length - 1]}
                                </div>
                                <div className="text-sm text-gray-600">Ước lớn nhất</div>
                            </div>
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
                                        {String.raw`$$\text{Tập hợp các ước của } ${n}: D(${n}) = \{${result.divisors.join(', ')}\}$$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                                    {result.divisors.length} ước số
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Số <span className="font-bold text-blue-600">{n}</span> có{' '}
                                    <span className="font-bold text-blue-600">{result.divisors.length}</span> ước số là:{' '}
                                    <span className="font-bold text-blue-600">{result.divisors.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Properties Analysis */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất của ước số:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`$1 | n$ (luôn đúng)`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`$n | n$ (luôn đúng)`}
                                </div>
                                <div>
                                    Ước nhỏ nhất: 1
                                </div>
                                <div>
                                    Ước lớn nhất: {n}
                                </div>
                            </div>
                        </div>

                        {/* Special Cases */}
                        <div className="mt-4 text-center">
                            <div className="text-xs text-gray-500 space-y-1">
                                {result.divisors.length === 2 && (
                                    <div className="text-green-600 font-semibold">
                                        🌟 Số {n} là số nguyên tố (chỉ có 2 ước: 1 và chính nó)
                                    </div>
                                )}
                                {result.divisors.length === 1 && (
                                    <div className="text-blue-600 font-semibold">
                                        🌟 Số {n} = 1 (chỉ có 1 ước duy nhất)
                                    </div>
                                )}
                                {result.divisors.length > 2 && (
                                    <div>
                                        Số {n} là hợp số (có nhiều hơn 2 ước)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Proper Divisors */}
                        {result.divisors.length > 1 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded border">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    📝 Ước thực sự (không bao gồm chính nó):
                                </h5>
                                <div className="text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$$\{${result.divisors.slice(0, -1).join(', ')}\}$$`}
                                    </div>
                                    <div className="mt-1">
                                        Tổng các ước thực sự: {result.divisors.slice(0, -1).reduce((sum, div) => sum + div, 0)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Divisors;