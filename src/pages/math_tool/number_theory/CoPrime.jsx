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

const CoPrime = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(8);
    const [b, setB] = useState(15);
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
        if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
        if (a <= 0 || b <= 0) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionCoPrime({ a, b }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\gcd(a,b) = 1 \Leftrightarrow a \text{ và } b \text{ nguyên tố cùng nhau}$$`}
                description={
                    <>
                        Hai số nguyên dương a và b được gọi là{' '}
                        <strong>nguyên tố cùng nhau</strong> nếu ước chung lớn nhất của chúng bằng 1
                    </>
                }
                example={`$\\gcd(8,15) = 1$ nên 8 và 15 nguyên tố cùng nhau`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\gcd(${a},${b}) = ?$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Số nguyên a"
                            value={a}
                            onChange={(value) => setA(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />

                        <InputField
                            label="Số nguyên b"
                            value={b}
                            onChange={(value) => setB(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {(a <= 0 || b <= 0) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: a và b phải là số nguyên dương
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
                            <strong>Kiểm tra:</strong><br />
                            <div className="mt-2">
                                {`$$\\gcd(${a},${b}) = ?$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết kiểm tra:
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
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Tính $\\gcd(${a},${b})$ bằng thuật toán Euclid`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$\\gcd(${a},${b})$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Kiểm tra điều kiện nguyên tố cùng nhau
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {result?.isCoprime ? '$\\gcd = 1$' : '$\\gcd \\neq 1$'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết luận
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isCoprime ? 'text-green-600' : 'text-red-600'}`}>
                                            {result?.isCoprime ? 'Nguyên tố cùng nhau' : 'Không nguyên tố cùng nhau'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.isCoprime !== undefined && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                    🎯 Kết quả cuối cùng:
                                </strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$$\\gcd(${a},${b}) ${result?.isCoprime ? '= 1' : '\\neq 1'}$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className={`tex2jax_process text-lg sm:text-2xl font-bold ${result?.isCoprime ? 'text-green-600' : 'text-red-600'}`}>
                                        {result?.isCoprime ? '✅ Nguyên tố cùng nhau' : '❌ Không nguyên tố cùng nhau'}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className={`mt-3 p-2 rounded border ${result?.isCoprime ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong>
                                        {result?.isCoprime ? (
                                            <span> Hai số <span className="font-bold text-green-600">{a}</span> và <span className="font-bold text-green-600">{b}</span> không có ước chung nào khác 1</span>
                                        ) : (
                                            <span> Hai số <span className="font-bold text-red-600">{a}</span> và <span className="font-bold text-red-600">{b}</span> có ước chung lớn hơn 1</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của số nguyên tố cùng nhau:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`$\\gcd(a,b) = 1 \\Leftrightarrow \\gcd(b,a) = 1$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$\\gcd(1,n) = 1$ với mọi $n \\geq 1$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Nếu $p$ là số nguyên tố và $\\gcd(p,a) \\neq p$ thì $\\gcd(p,a) = 1$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$\\gcd(a,b) = \\gcd(a,b \\bmod a)$`}
                                    </div>
                                </div>
                            </div>

                            {/* Examples */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    📝 Ví dụ:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`$\\gcd(8,15) = 1$ ✅`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$\\gcd(12,18) = 6 \\neq 1$ ❌`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$\\gcd(7,13) = 1$ ✅`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$\\gcd(6,9) = 3 \\neq 1$ ❌`}
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

export default CoPrime;