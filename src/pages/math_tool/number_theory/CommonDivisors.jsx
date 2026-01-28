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

const CommonDivisors = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(18);
    const [b, setB] = useState(24);
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
        if (a < 1 || b < 1) return false;
        if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionCommonDivisors({ a, b }));
    };

    // Helper function to find divisors of a number for demonstration
    const findDivisors = (num) => {
        const divisors = [];
        for (let i = 1; i <= num; i++) {
            if (num % i === 0) {
                divisors.push(i);
            }
        }
        return divisors;
    };

    // Helper function to find GCD using Euclidean algorithm steps
    const getGCDSteps = (a, b) => {
        const steps = [];
        let x = Math.max(a, b);
        let y = Math.min(a, b);
        let stepNum = 1;

        while (y !== 0) {
            const quotient = Math.floor(x / y);
            const remainder = x % y;

            steps.push({
                step: stepNum,
                operation: `${x} = ${y} \\times ${quotient} + ${remainder}`,
                description: `Chia ${x} cho ${y}`,
                remainder: remainder
            });

            x = y;
            y = remainder;
            stepNum++;
        }

        return { steps, gcd: x };
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="🔄"
                formula={String.raw`$$\gcd(a,b) = \max\{d : d \mid a \text{ và } d \mid b\}$$`}
                description={
                    <>
                        Ước chung của hai số là các số tự nhiên{' '}
                        <strong>chia hết cho cả hai số đó</strong>.
                        Ước chung lớn nhất được gọi là ƯCLN.
                    </>
                }
                example="$\gcd(18, 24) = 6$, ước chung: $\{1, 2, 3, 6\}$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Tìm ước chung của } a \text{ và } b$$`}
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

                    {(a < 1 || b < 1) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: a và b phải là các số nguyên dương
                        </div>
                    )}

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && result.commonDivisors && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Result Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Các ước chung của {a} và {b}:</strong><br />
                            <div className="mt-2">
                                {`$$\\{${result.commonDivisors.join(', ')}\\}$$`}
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
                                        <th className={commonClasses.tableHeader}>Số</th>
                                        <th className={commonClasses.tableHeader}>Các ước của số này</th>
                                        <th className={commonClasses.tableHeader}>Số ước</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium text-blue-600`}>{a}</td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="flex flex-wrap gap-1">
                                                {findDivisors(a).map((divisor, index) => (
                                                    <span key={index} className={`px-2 py-1 rounded text-xs ${result.commonDivisors.includes(divisor)
                                                            ? 'bg-green-100 text-green-800 font-bold'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {divisor}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-medium`}>
                                            {findDivisors(a).length}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium text-blue-600`}>{b}</td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="flex flex-wrap gap-1">
                                                {findDivisors(b).map((divisor, index) => (
                                                    <span key={index} className={`px-2 py-1 rounded text-xs ${result.commonDivisors.includes(divisor)
                                                            ? 'bg-green-100 text-green-800 font-bold'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {divisor}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-medium`}>
                                            {findDivisors(b).length}
                                        </td>
                                    </tr>
                                    <tr className="bg-green-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            Ước chung
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="flex flex-wrap gap-1">
                                                {result.commonDivisors.map((divisor, index) => (
                                                    <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-bold">
                                                        {divisor}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            {result.commonDivisors.length}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* GCD Calculation */}
                    {(() => {
                        const gcdInfo = getGCDSteps(a, b);
                        return (
                            <div className="mb-6">
                                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <span className="mr-2">🧮</span>
                                    Tính ƯCLN bằng thuật toán Euclid:
                                </h4>

                                <div className="overflow-x-auto -mx-3 sm:mx-0 max-w-full">
                                    <div className="px-3 sm:px-0">
                                        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                            <thead className="bg-green-500 text-white">
                                                <tr>
                                                    <th className={commonClasses.tableHeader}>Bước</th>
                                                    <th className={commonClasses.tableHeader}>Phép chia</th>
                                                    <th className={commonClasses.tableHeader}>Số dư</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gcdInfo.steps.map((step, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                                                        <td className={`${commonClasses.tableCell} font-medium`}>{step.step}</td>
                                                        <td className={commonClasses.tableCell}>
                                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                                ${step.operation}$
                                                            </span>
                                                        </td>
                                                        <td className={`${commonClasses.tableCell} ${step.remainder === 0 ? 'font-bold text-red-600' : ''}`}>
                                                            {step.remainder}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Final Result */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                            {/* Common Divisors Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {`$$\\text{Ước chung}(${a}, ${b}) = \\{${result.commonDivisors.join(', ')}\\}$$`}
                                    </div>
                                </div>
                            </div>

                            {/* Divisors List */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-lg sm:text-xl font-bold text-blue-600 mb-3">
                                    Các ước chung:
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mb-3">
                                    {result.commonDivisors.map((divisor, index) => (
                                        <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${divisor === Math.max(...result.commonDivisors)
                                                ? 'bg-red-100 text-red-800 border-2 border-red-300'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {divisor}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200">
                                        ƯCLN = {Math.max(...result.commonDivisors)}
                                    </span>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Có <span className="font-bold text-blue-600">{result.commonDivisors.length}</span> ước chung của {a} và {b}.
                                    Ước chung lớn nhất (ƯCLN) là <span className="font-bold text-red-600">{Math.max(...result.commonDivisors)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Thông tin bổ sung:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    <strong>Số ước chung:</strong> {result.commonDivisors.length}
                                </div>
                                <div>
                                    <strong>ƯCLN:</strong> {Math.max(...result.commonDivisors)}
                                </div>
                                <div>
                                    <strong>Ước chung nhỏ nhất:</strong> {Math.min(...result.commonDivisors)}
                                </div>
                                <div>
                                    <strong>Tỉ số a/ƯCLN:</strong> {a / Math.max(...result.commonDivisors)}
                                </div>
                            </div>
                        </div>

                        {/* Mathematical Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                🔬 Tính chất toán học:
                            </h5>
                            <div className="text-xs text-gray-600 space-y-1">
                                <div className="tex2jax_process">
                                    • $\gcd(a,b) = \gcd(b, a \bmod b)$ (Thuật toán Euclid)
                                </div>
                                <div className="tex2jax_process">
                                    {`• $\\gcd(a,b) \\times \\text{lcm}(a,b) = a \\times b$`}
                                </div>
                                <div>• Mọi ước chung đều là ước của ƯCLN</div>
                                <div>• 1 luôn là ước chung của mọi cặp số nguyên dương</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default CommonDivisors;