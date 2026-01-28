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

const CheckArithmetic = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [sequenceInput, setSequenceInput] = useState("2, 5, 8, 11, 14");
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

    // Parse sequence from input string
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
        if (!sequence) return false;
        if (sequence.length < 3) return false; // Cần ít nhất 3 số để kiểm tra
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sequence = parseSequence(sequenceInput);
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionCheckArithmetic({ sequence }));
    };

    const sequence = parseSequence(sequenceInput) || [];

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$a_{n+1} - a_n = d \text{ (hằng số)}$$`}
                description={
                    <>
                        Cấp số cộng là dãy số mà hiệu của hai số hạng liên tiếp bằng một hằng số d (công sai).<br />
                        <strong>Công thức tổng quát:</strong> a_n = a_1 + (n-1)d
                    </>
                }
                example="Dãy [2, 5, 8, 11, 14] là cấp số cộng với d = 3"
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
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dãy số (cách nhau bằng dấu phẩy)
                            </label>
                            <input
                                type="text"
                                value={sequenceInput}
                                onChange={(e) => setSequenceInput(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ví dụ: 2, 5, 8, 11, 14"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Nhập ít nhất 3 số, cách nhau bằng dấu phẩy hoặc dấu cách
                            </p>
                        </div>
                    </div>

                    {/* Preview sequence */}
                    {sequence.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm text-gray-700">
                                <strong>Dãy số đã nhập:</strong>
                                <div className="mt-2 tex2jax_process">
                                    {`$[${sequence.join(', ')}]$`}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Số phần tử: {sequence.length}
                                </div>
                            </div>
                        </div>
                    )}

                    {sequence.length > 0 && sequence.length < 3 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Cần ít nhất 3 số để kiểm tra cấp số cộng
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
                    {/* Main Result */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="text-center">
                            <div className={`p-4 rounded-lg ${result.isArithmetic ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                                <div className={`text-lg font-bold ${result.isArithmetic ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.isArithmetic ? '✅ Đây là cấp số cộng!' : '❌ Không phải cấp số cộng!'}
                                </div>
                                {result.isArithmetic && (
                                    <div className="mt-2 tex2jax_process text-sm">
                                        {`Công sai: $d = ${result.commonDiff}$`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết kiểm tra:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Vị trí</th>
                                        <th className={commonClasses.tableHeader}>Số hạng</th>
                                        <th className={commonClasses.tableHeader}>Hiệu số</th>
                                        <th className={commonClasses.tableHeader}>Kiểm tra</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sequence.map((num, index) => {
                                        if (index === 0) {
                                            return (
                                                <tr key={index} className="bg-gray-50 border-b border-gray-200">
                                                    <td className={`${commonClasses.tableCell} font-medium`}>
                                                        a₁
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        {num}
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        -
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        Số hạng đầu
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        const diff = num - sequence[index - 1];
                                        const isConsistent = result.isArithmetic || Math.abs(diff - (result.commonDiff || diff)) < 1e-10;

                                        return (
                                            <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                                <td className={`${commonClasses.tableCell} font-medium`}>
                                                    a₍{index + 1}₎
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    {num}
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {`$${num} - ${sequence[index - 1]} = ${diff}$`}
                                                    </span>
                                                </td>
                                                <td className={`${commonClasses.tableCell} font-medium ${isConsistent ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isConsistent ? '✓' : '✗'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả chi tiết:</strong>

                            {/* Sequence Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {`Dãy số: $[${sequence.join(', ')}]$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Status */}
                            <div className={`mt-3 p-3 rounded border ${result.isArithmetic ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className={`text-sm sm:text-base font-bold ${result.isArithmetic ? 'text-green-600' : 'text-red-600'}`}>
                                    {result.isArithmetic ? 'CẤP SỐ CỘNG' : 'KHÔNG PHẢI CẤP SỐ CỘNG'}
                                </div>
                                {result.isArithmetic && (
                                    <div className="mt-2 tex2jax_process text-sm">
                                        {`Công sai: $d = ${result.commonDiff}$`}
                                    </div>
                                )}
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    {result.isArithmetic ? (
                                        <>
                                            <strong>Ý nghĩa:</strong> Dãy số này là cấp số cộng với công sai d = {result.commonDiff}.<br />
                                            Công thức số hạng tổng quát: <span className="tex2jax_process">{`$a_n = ${sequence[0]} + (n-1) \\times ${result.commonDiff}$`}</span>
                                        </>
                                    ) : (
                                        <>
                                            <strong>Ý nghĩa:</strong> Dãy số này không phải là cấp số cộng vì các hiệu số liên tiếp không bằng nhau.
                                        </>
                                    )}

                                </div>
                            </div>

                            {result.isArithmetic && (
                                <div className="mt-3 p-2 bg-yellow-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Dự đoán số hạng tiếp theo:</strong>
                                        <div className="mt-1 tex2jax_process">
                                            {`$a_{${sequence.length + 1}} = ${sequence[sequence.length - 1]} + ${result.commonDiff} = ${sequence[sequence.length - 1] + result.commonDiff}$`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất của cấp số cộng:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`$a_n = a_1 + (n-1)d$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`$S_n = \frac{n(a_1 + a_n)}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`$a_n = \frac{a_{n-1} + a_{n+1}}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`$S_n = \frac{n(2a_1 + (n-1)d)}{2}$`}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default CheckArithmetic;