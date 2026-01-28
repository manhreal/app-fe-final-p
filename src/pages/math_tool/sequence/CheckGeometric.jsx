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
    SubmitButton,
    ErrorMessage,
    ResultSection
} from '../../../template_ui/commonStyles';

const CheckGeometric = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [sequenceInput, setSequenceInput] = useState('3, 6, 12, 24, 48');
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

    // Parse sequence from string input
    const parseSequence = (input) => {
        try {
            const numbers = input
                .split(/[,;\s]+/)
                .filter(str => str.trim() !== '')
                .map(str => {
                    const num = parseFloat(str.trim());
                    if (isNaN(num)) throw new Error(`"${str.trim()}" không phải là số hợp lệ`);
                    return num;
                });
            return numbers;
        } catch (error) {
            return { numbers: null, error: error.message };
        }
    };

    // Input validation
    const validateInputs = () => {
        const sequence = parseSequence(sequenceInput);
        if (sequence.length < 2) return false;
        return sequence.every(num => typeof num === 'number' && !isNaN(num));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        const sequence = parseSequence(sequenceInput);
        dispatch(mathActions.actionCheckGeometric({ sequence }));
    };

    const getSequenceArray = () => parseSequence(sequenceInput);

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$a_n = a_1 \cdot q^{n-1}$$`}
                description={
                    <>
                        Cấp số nhân là dãy số trong đó tỉ số giữa hai số hạng liên tiếp là một{' '}
                        <strong>hằng số q (công bội)</strong>
                    </>
                }
                example={String.raw`$\frac{a_{n+1}}{a_n} = q$ (với mọi $n \geq 1$)`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$a_1, a_2, a_3, ..., a_n$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dãy số cần kiểm tra
                            </label>
                            <textarea
                                value={sequenceInput}
                                onChange={(e) => setSequenceInput(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="3"
                                placeholder="Nhập các số cách nhau bởi dấu phẩy (VD: 3, 6, 12, 24, 48)"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Nhập ít nhất 2 số, cách nhau bởi dấu phẩy
                            </div>
                        </div>

                        {/* Preview sequence */}
                        {getSequenceArray().length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-sm text-gray-700">
                                    <strong>Dãy đã nhập:</strong> [{getSequenceArray().join(', ')}]
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Số lượng phần tử: {getSequenceArray().length}
                                </div>
                            </div>
                        )}
                    </div>

                    {getSequenceArray().length < 2 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Cần ít nhất 2 số để kiểm tra
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
                <ResultSection title="Kết quả kiểm tra" icon="📈">
                    {/* Sequence Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Dãy đã kiểm tra:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$${getSequenceArray().join(', ')}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Result Summary */}
                    <div className={`p-4 rounded-lg border-2 mb-6 ${result.isGeometric
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="text-center">
                            <div className={`text-lg font-bold ${result.isGeometric ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {result.isGeometric ? '✅ Là cấp số nhân' : '❌ Không là cấp số nhân'}
                            </div>
                            {result.isGeometric && result.commonRatio !== undefined && (
                                <div className="mt-2">
                                    <span className="text-sm text-gray-700">Công bội: </span>
                                    <span className="tex2jax_process text-lg font-bold text-blue-600">
                                        $q = {result.commonRatio}$
                                    </span>
                                </div>
                            )}
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
                                        <th className={commonClasses.tableHeader}>Tỉ số</th>
                                        <th className={commonClasses.tableHeader}>Công thức</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getSequenceArray().slice(1).map((value, index) => {
                                        const ratio = value / getSequenceArray()[index];
                                        return (
                                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                                <td className={`${commonClasses.tableCell} font-medium`}>
                                                    {String.raw`$\frac{a_{${index + 2}}}{a_{${index + 1}}}$`}
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {String.raw`$\frac{${value}}{${getSequenceArray()[index]}}$`}
                                                    </span>
                                                </td>
                                                <td className={`${commonClasses.tableCell} ${result.isGeometric ? 'text-green-600' : 'text-red-600'
                                                    } font-bold`}>
                                                    {ratio.toFixed(3)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Conclusion */}
                    {result.isGeometric ? (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                    🎯 Kết luận:
                                </strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {String.raw`Công thức tổng quát: $a_n = ${getSequenceArray()[0]} \cdot ${result.commonRatio}^{n-1}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Common Ratio */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {String.raw`$q = ${result.commonRatio}$`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Dãy này là cấp số nhân với công bội{' '}
                                        <span className="font-bold text-blue-600">q = {result.commonRatio}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của cấp số nhân:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$a_n = a_1 \cdot q^{n-1}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$\frac{a_{n+1}}{a_n} = q$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$S_n = a_1 \cdot \frac{q^n - 1}{q - 1}$ (q ≠ 1)`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$a_n^2 = a_{n-1} \cdot a_{n+1}$`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-red-800">
                                    ❌ Kết luận:
                                </strong>
                                <div className="mt-3 p-2 bg-white rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        Dãy này <strong>không phải</strong> là cấp số nhân vì tỉ số giữa các số hạng liên tiếp không bằng nhau.
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="mt-4">
                                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                        💡 Ghi nhớ:
                                    </h5>
                                    <div className="text-xs text-gray-600">
                                        Để là cấp số nhân, tất cả các tỉ số {String.raw`$\frac{a_{n+1}}{a_n}$`} phải bằng nhau
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

export default CheckGeometric;