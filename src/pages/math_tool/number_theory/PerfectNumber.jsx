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

const PerfectNumber = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [n, setN] = useState(28);
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
        dispatch(mathActions.actionIsPerfect({ n }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\text{Số hoàn hảo} = \sum_{\substack{d|n \\ d<n}} d$$`}
                description={
                    <>
                        Số hoàn hảo là số nguyên dương bằng tổng các ước số thực sự của nó.{' '}
                        <strong>Ví dụ:</strong> 6 = 1 + 2 + 3 (các ước của 6 nhỏ hơn 6)
                    </>
                }
                example="$6 = 1 + 2 + 3$, $28 = 1 + 2 + 4 + 7 + 14$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Kiểm tra số } n \text{ có phải số hoàn hảo?}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
                        <InputField
                            label="Số cần kiểm tra (n)"
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

            {result && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Result Status */}
                    <div className={`mb-6 p-4 rounded-lg border-2 text-center ${result?.isPerfectNumber
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                        <div className={`text-xl sm:text-2xl font-bold ${result?.isPerfectNumber
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                            {result?.isPerfectNumber ? '✅ Là số hoàn hảo!' : '❌ Không phải số hoàn hảo'}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Số {n} {result?.isPerfectNumber ? 'là' : 'không phải là'} số hoàn hảo
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết phân tích:
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
                                            Tìm tất cả các ước số thực sự của {n}
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="text-xs sm:text-sm">
                                                Các ước số nhỏ hơn {n}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tổng các ước số thực sự
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="text-xs sm:text-sm">
                                                Tổng = Σ(ước số thực sự)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            So sánh tổng với số ban đầu
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold ${result?.isPerfectNumber ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {result?.isPerfectNumber ? 'Bằng nhau ✅' : 'Không bằng nhau ❌'}
                                        </td>
                                    </tr>
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
                                        {String.raw`$$\text{Kiểm tra: } ${n} \stackrel{?}{=} \sum_{\substack{d|${n} \\ d<${n}}} d$$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className={`text-lg sm:text-2xl font-bold ${result?.isPerfectNumber ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {result?.isPerfectNumber ? 'SỐ HOÀN HẢO' : 'KHÔNG PHẢI SỐ HOÀN HẢO'}
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Số <span className="font-bold text-blue-600">{n}</span>{' '}
                                    {result?.isPerfectNumber
                                        ? 'bằng tổng các ước số thực sự của nó, do đó là số hoàn hảo'
                                        : 'không bằng tổng các ước số thực sự của nó, do đó không phải là số hoàn hảo'
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Thông tin thêm về số hoàn hảo:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    Số hoàn hảo đầu tiên: 6
                                </div>
                                <div>
                                    Số hoàn hảo thứ hai: 28
                                </div>
                                <div>
                                    Số hoàn hảo thứ ba: 496
                                </div>
                                <div>
                                    Số hoàn hảo thứ tư: 8128
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                <strong>Lưu ý:</strong> Hiện tại chỉ biết được 51 số hoàn hảo và tất cả đều là số chẵn
                            </div>
                        </div>

                        {/* Examples section */}
                        {result?.isPerfectNumber && (
                            <div className="mt-4 p-3 bg-green-50 rounded border">
                                <h5 className="text-xs sm:text-sm font-semibold text-green-700 mb-2">
                                    ✨ Ví dụ minh họa:
                                </h5>
                                <div className="text-xs text-green-600 space-y-1">
                                    {n === 6 && (
                                        <div className="tex2jax_process">
                                            $6 = 1 + 2 + 3 = 6$ ✓
                                        </div>
                                    )}
                                    {n === 28 && (
                                        <div className="tex2jax_process">
                                            $28 = 1 + 2 + 4 + 7 + 14 = 28$ ✓
                                        </div>
                                    )}
                                    {n !== 6 && n !== 28 && (
                                        <div>
                                            Số {n} có tổng các ước số thực sự bằng chính nó
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default PerfectNumber;