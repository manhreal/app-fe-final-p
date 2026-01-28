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

const GCD = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(60);
    const [b, setB] = useState(48);
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
        dispatch(mathActions.actionGcd({ a, b }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\gcd(a,b) = \max\{d : d \mid a \text{ và } d \mid b\}$$`}
                description={
                    <>
                        Ước chung lớn nhất (GCD - Greatest Common Divisor) của hai số nguyên dương a và b là{' '}
                        <strong>số nguyên dương lớn nhất chia hết cho cả a và b</strong>
                    </>
                }
                example={`$\\gcd(60,48) = 12$ vì 12 là số lớn nhất chia hết cho cả 60 và 48`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\gcd(a,b)$$`}
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
                                {String.raw`$$\gcd(${a}, ${b})$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết tính toán (Thuật toán Euclid):
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Phép chia</th>
                                        <th className={commonClasses.tableHeader}>Phần dư</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Simulate Euclidean algorithm steps for display */}
                                    {(() => {
                                        const steps = [];
                                        let tempA = Math.max(a, b);
                                        let tempB = Math.min(a, b);
                                        let stepCount = 1;

                                        while (tempB !== 0) {
                                            const quotient = Math.floor(tempA / tempB);
                                            const remainder = tempA % tempB;

                                            steps.push(
                                                <tr key={stepCount} className={stepCount % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                                                    <td className={`${commonClasses.tableCell} font-medium`}>{stepCount}</td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="tex2jax_process text-xs sm:text-sm">
                                                            {`$${tempA} = ${tempB} \\times ${quotient} + ${remainder}$`}
                                                        </span>
                                                    </td>
                                                    <td className={commonClasses.tableCell}>
                                                        <span className="font-bold">{remainder}</span>
                                                    </td>
                                                </tr>
                                            );

                                            tempA = tempB;
                                            tempB = remainder;
                                            stepCount++;

                                            if (stepCount > 10) break; // Safety check
                                        }

                                        return steps;
                                    })()}
                                    <tr className="bg-green-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Kết quả</td>
                                        <td className={commonClasses.tableCell}>
                                            Phần dư cuối cùng khác 0
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.gcd}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.gcd && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {String.raw`$$\gcd(${a}, ${b})$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result.gcd}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Ước chung lớn nhất của {a} và {b} là{' '}
                                        <span className="font-bold text-blue-600">{result.gcd}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của GCD:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$$\gcd(a,b) = \gcd(b,a)$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\gcd(a,0) = a$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\gcd(a,b) \cdot \text{lcm}(a,b) = a \cdot b$$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$$\gcd(ka,kb) = k \cdot \gcd(a,b)$$`}
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

export default GCD;