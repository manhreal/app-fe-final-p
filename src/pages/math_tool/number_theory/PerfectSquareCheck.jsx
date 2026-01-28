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

const PerfectSquareCheck = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [n, setN] = useState(49);
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
        if (!Number.isInteger(n)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionIsPerfectSquare({ n }));
    };

    // Calculate square root for display
    const sqrtN = Math.sqrt(n);
    const isExactSquare = Number.isInteger(sqrtN);

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$n = k^2, \quad k \in \mathbb{N}_0$$`}
                description={
                    <>
                        Số chính phương là số tự nhiên có thể biểu diễn dưới dạng{' '}
                        <strong>bình phương của một số nguyên không âm</strong>
                    </>
                }
                example="49 là số chính phương vì $49 = 7^2$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Kiểm tra } n \text{ có phải số chính phương?}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
                        <InputField
                            label="Số cần kiểm tra (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(0, Math.floor(Number(value))))}
                            min="0"
                            step="1"
                            helpText="Số nguyên không âm"
                        />
                    </div>

                    {n < 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: n phải lớn hơn hoặc bằng 0
                        </div>
                    )}

                    {/* Preview calculation */}
                    {n >= 0 && (
                        <div className="text-center text-sm text-gray-600 mt-3">
                            <div className="tex2jax_process">
                                {String.raw`$\sqrt{${n}} ${isExactSquare ? '=' : '\\approx'} ${isExactSquare ? sqrtN : sqrtN.toFixed(3)}$`}
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
                <ResultSection title="Kết quả kiểm tra" icon="🎯">
                    {/* Main Result */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words text-center">
                            <strong>Kết quả kiểm tra:</strong><br />
                            <div className="mt-4">
                                {String.raw`$$n = ${n}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Result Status */}
                    <div className={`text-center mb-6 p-6 rounded-lg border-2 ${result?.isPerfectSquare
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                        }`}>
                        <div className={`text-2xl sm:text-3xl font-bold ${result?.isPerfectSquare ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {result?.isPerfectSquare ? '✅ LÀ SỐ CHÍNH PHƯƠNG' : '❌ KHÔNG PHẢI SỐ CHÍNH PHƯƠNG'}
                        </div>
                        <div className={`mt-2 text-sm ${result?.isPerfectSquare ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {result?.isPerfectSquare
                                ? `${n} = ${Math.sqrt(n)}²`
                                : `${n} không thể biểu diễn dưới dạng k²`
                            }
                        </div>
                        {result?.isPerfectSquare && (
                            <div className="mt-3 p-3 bg-white rounded border">
                                <div className="tex2jax_process text-base">
                                    {String.raw`$$${n} = ${Math.sqrt(n)}^2$$`}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step by step explanation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Giải thích chi tiết:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className={`text-white ${result?.isPerfectSquare ? 'bg-green-500' : 'bg-red-500'}`}>
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Phương pháp</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`Tính $\sqrt{${n}}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\sqrt{${n}} ${isExactSquare ? '=' : '\\approx'} ${isExactSquare ? sqrtN : sqrtN.toFixed(6)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Kiểm tra căn bậc hai có nguyên không
                                        </td>
                                        <td className={`${commonClasses.tableCell} ${isExactSquare ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {isExactSquare ? '✅ Số nguyên' : '❌ Số thập phân'}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`Kiểm tra ${isExactSquare ? sqrtN : '?'}^2 = ${n}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isPerfectSquare ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {result?.isPerfectSquare ? '✅ ĐÚNG' : '❌ SAI'}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`${n} \text{ là số chính phương?}`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isPerfectSquare ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {result?.isPerfectSquare ? '✅ CÓ' : '❌ KHÔNG'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result Box */}
                    <div className={`${result?.isPerfectSquare ? commonClasses.successBox : 'bg-red-50 border border-red-200 rounded-lg p-4'
                        }`}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                🎯 Kết quả cuối cùng:
                            </strong>

                            {/* Mathematical notation */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {result?.isPerfectSquare
                                            ? String.raw`$${n} = ${Math.sqrt(n)}^2 \text{ (số chính phương)}$`
                                            : String.raw`$${n} \neq k^2 \text{ với mọi } k \in \mathbb{Z}$`
                                        }
                                    </div>
                                    <div className="mt-1 text-gray-600 text-xs">
                                        {result?.isPerfectSquare
                                            ? `(${n} bằng ${Math.sqrt(n)} bình phương)`
                                            : `(${n} không thể viết dưới dạng bình phương)`
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={`${commonClasses.resultBox} ${result?.isPerfectSquare ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                                }`}>
                                <div className={`tex2jax_process text-lg sm:text-2xl font-bold ${result?.isPerfectSquare ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {result?.isPerfectSquare ? 'TRUE' : 'FALSE'}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className={`mt-3 p-2 rounded border ${result?.isPerfectSquare ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Giải thích:</strong>
                                    {result?.isPerfectSquare
                                        ? ` Số ${n} là số chính phương vì ${n} = ${Math.sqrt(n)}² với ${Math.sqrt(n)} là số nguyên.`
                                        : ` Số ${n} không phải số chính phương vì √${n} ≈ ${sqrtN.toFixed(3)} không phải số nguyên.`
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Thông tin thêm:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`0^2 = 0, 1^2 = 1, 2^2 = 4`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`3^2 = 9, 4^2 = 16, 5^2 = 25`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`6^2 = 36, 7^2 = 49, 8^2 = 64`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`9^2 = 81, 10^2 = 100`}
                                </div>
                            </div>

                            {/* Show perfect square sequence if current number is perfect square */}
                            {result?.isPerfectSquare && (
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-blue-700">
                                        <strong>🔍 Chuỗi số chính phương:</strong>
                                        <div className="tex2jax_process mt-1">
                                            {String.raw`0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225...`}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show next and previous perfect squares */}
                            <div className="mt-3 p-2 bg-yellow-50 rounded border">
                                <div className="text-xs sm:text-sm text-yellow-700">
                                    <strong>🎯 So sánh:</strong>
                                    <div className="tex2jax_process mt-1">
                                        {Math.floor(sqrtN) !== sqrtN ? (
                                            String.raw`${Math.floor(sqrtN)}^2 = ${Math.floor(sqrtN) ** 2} < ${n} < ${Math.ceil(sqrtN) ** 2} = ${Math.ceil(sqrtN)}^2`
                                        ) : (
                                            String.raw`${Math.floor(sqrtN) - 1}^2 = ${(Math.floor(sqrtN) - 1) ** 2} < ${n} = ${sqrtN}^2 < ${(Math.ceil(sqrtN) + 1) ** 2} = ${Math.ceil(sqrtN) + 1}^2`
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default PerfectSquareCheck;