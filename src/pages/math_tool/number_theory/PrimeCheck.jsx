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

const PrimeCheck = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [n, setN] = useState(29);
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
        dispatch(mathActions.actionIsPrime({ n }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="🧮"
                formula={String.raw`$$\text{Số nguyên tố } p: \forall a,b \in \mathbb{Z}, p \mid ab \Rightarrow p \mid a \text{ hoặc } p \mid b$$`}
                description={
                    <>
                        Số nguyên tố là số tự nhiên lớn hơn 1 chỉ có{' '}
                        <strong>đúng hai ước số dương</strong> là 1 và chính nó
                    </>
                }
                example="29 là số nguyên tố vì chỉ chia hết cho 1 và 29"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Kiểm tra } n \text{ có phải số nguyên tố?}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
                        <InputField
                            label="Số cần kiểm tra (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(2, Math.floor(Number(value))))}
                            min="2"
                            step="1"
                            helpText="Số nguyên lớn hơn hoặc bằng 2"
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
                    <div className={`text-center mb-6 p-6 rounded-lg border-2 ${result?.isPrime
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                        }`}>
                        <div className={`text-2xl sm:text-3xl font-bold ${result?.isPrime ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {result?.isPrime ? '✅ LÀ SỐ NGUYÊN TỐ' : '❌ KHÔNG PHẢI SỐ NGUYÊN TỐ'}
                        </div>
                        <div className={`mt-2 text-sm ${result?.isPrime ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {result?.isPrime
                                ? `${n} chỉ chia hết cho 1 và ${n}`
                                : `${n} có các ước số khác ngoài 1 và ${n}`
                            }
                        </div>
                    </div>

                    {/* Step by step explanation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Giải thích chi tiết:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className={`text-white ${result?.isPrime ? 'bg-green-500' : 'bg-red-500'}`}>
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Tiêu chí</th>
                                        <th className={commonClasses.tableHeader}>Điều kiện</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Định nghĩa</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$n > 1$ và chỉ có 2 ước dương`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} ${n > 1 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {n > 1 ? '✅ Đạt' : '❌ Không đạt'}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Ước số</td>
                                        <td className={commonClasses.tableCell}>
                                            Chỉ chia hết cho 1 và chính nó
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isPrime ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {result?.isPrime ? '✅ Đúng' : '❌ Sai'}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Kết luận</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`${n} \text{ là số nguyên tố?}`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isPrime ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {result?.isPrime ? '✅ CÓ' : '❌ KHÔNG'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result Box */}
                    <div className={`${result?.isPrime ? commonClasses.successBox : 'bg-red-50 border border-red-200 rounded-lg p-4'
                        }`}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                🎯 Kết quả cuối cùng:
                            </strong>

                            {/* Mathematical notation */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {String.raw`$${n} ${result?.isPrime ? '\\in' : '\\notin'} \\mathbb{P}$`}
                                    </div>
                                    <div className="mt-1 text-gray-600 text-xs">
                                        {result?.isPrime
                                            ? `(${n} thuộc tập hợp số nguyên tố)`
                                            : `(${n} không thuộc tập hợp số nguyên tố)`
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={`${commonClasses.resultBox} ${result?.isPrime ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                                }`}>
                                <div className={`tex2jax_process text-lg sm:text-2xl font-bold ${result?.isPrime ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {result?.isPrime ? 'TRUE' : 'FALSE'}
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className={`mt-3 p-2 rounded border ${result?.isPrime ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Giải thích:</strong>
                                    {result?.isPrime
                                        ? ` Số ${n} là số nguyên tố vì nó chỉ có đúng 2 ước số dương là 1 và ${n}.`
                                        : ` Số ${n} không phải số nguyên tố vì nó có nhiều hơn 2 ước số dương.`
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
                                    {String.raw`\text{Số nguyên tố nhỏ nhất: } 2`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`\text{Chỉ có 1 số nguyên tố chẵn: } 2`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`\text{Có vô hạn số nguyên tố}`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`\text{Định lý Euclid về số nguyên tố}`}
                                </div>
                            </div>

                            {/* Show some nearby primes if current number is prime */}
                            {result?.isPrime && (
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-blue-700">
                                        <strong>🔍 Gợi ý:</strong> Một số số nguyên tố gần ${n}: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default PrimeCheck;