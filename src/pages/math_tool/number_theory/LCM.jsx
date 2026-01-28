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

const LCM = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(6);
    const [b, setB] = useState(8);
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
        if (a <= 0 || b <= 0) return false;
        if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionLcm({ a, b }));
    };

    // Calculate GCD for display purposes
    const calculateGCD = (num1, num2) => {
        while (num2 !== 0) {
            let temp = num2;
            num2 = num1 % num2;
            num1 = temp;
        }
        return num1;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\text{lcm}(a,b) = \frac{a \times b}{\gcd(a,b)}$$`}
                description={
                    <>
                        Bội chung nhỏ nhất (LCM - Least Common Multiple) của hai số nguyên dương a và b là{' '}
                        <strong>số nguyên dương nhỏ nhất chia hết cho cả a và b</strong>
                    </>
                }
                example={`$\\text{lcm}(6,8) = \\frac{6 \\times 8}{\\gcd(6,8)} = \\frac{48}{2} = 24$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{lcm}(a,b)$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Số thứ nhất (a)"
                            value={a}
                            onChange={(value) => setA(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />

                        <InputField
                            label="Số thứ hai (b)"
                            value={b}
                            onChange={(value) => setB(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {(!validateInputs()) && (a <= 0 || b <= 0) && (
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
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$\text{lcm}(${a}, ${b}) = \frac{${a} \times ${b}}{\gcd(${a}, ${b})}$$`}
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
                                                {`Áp dụng công thức: $\\text{lcm}(a,b) = \\frac{a \\times b}{\\gcd(a,b)}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$$\text{lcm}(${a}, ${b})$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tích của hai số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$$${a} \times ${b} = ${a * b}$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính GCD của hai số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$$\gcd(${a}, ${b}) = ${calculateGCD(a, b)}$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay số vào công thức
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {String.raw`$$\frac{${a * b}}{${calculateGCD(a, b)}}$$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.lcm}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.lcm && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {String.raw`$$\text{lcm}(${a}, ${b})$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result.lcm}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Bội chung nhỏ nhất của {a} và {b} là{' '}
                                        <span className="font-bold text-blue-600">{result.lcm}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của LCM:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$$\text{lcm}(a,b) = \text{lcm}(b,a)$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\text{lcm}(a,1) = a$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\text{lcm}(a,a) = a$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\gcd(a,b) \cdot \text{lcm}(a,b) = a \cdot b$$`}
                                    </div>
                                </div>
                            </div>
                            {/* Multiples Display */}
                            <div className="mt-4 p-3 bg-green-50 rounded border">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    🔢 Kiểm chứng - Bội của các số:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                                    <div>
                                        <strong>Bội của {a}:</strong>{' '}
                                        {Array.from({ length: 5 }, (_, i) => a * (i + 1)).join(', ')}, ...
                                    </div>
                                    <div>
                                        <strong>Bội của {b}:</strong>{' '}
                                        {Array.from({ length: 5 }, (_, i) => b * (i + 1)).join(', ')}, ...
                                    </div>
                                </div>
                                <div className="mt-2 p-2 bg-white rounded">
                                    <strong className="text-blue-600">Bội chung đầu tiên:</strong>{' '}
                                    <span className="font-bold text-green-600">{result.lcm}</span>{' '}
                                    (xuất hiện trong cả hai dãy)
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default LCM;