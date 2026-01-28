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

const AngleCosSin = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(3);
    const [b, setB] = useState(4);
    const [c, setC] = useState(5);
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
        const numA = Number(a);
        const numB = Number(b);
        const numC = Number(c);

        if (isNaN(numA) || isNaN(numB) || isNaN(numC)) return false;
        if (numA <= 0 || numB <= 0 || numC <= 0) return false;
        if (a === '' || b === '' || c === '') return false;

        // Kiểm tra bất đẳng thức tam giác
        if (numA + numB <= numC || numA + numC <= numB || numB + numC <= numA) return false;

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionAngleCosSin({ a: Number(a), b: Number(b), c: Number(c) }));
    };

    // Kiểm tra tam giác hợp lệ
    const isValidTriangle = () => {
        const numA = Number(a);
        const numB = Number(b);
        const numC = Number(c);
        return numA + numB > numC && numA + numC > numB && numB + numC > numA;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\cos C = \frac{a^2 + b^2 - c^2}{2ab}$$`}
                description={
                    <>
                        Định lý Cosin cho phép tính góc C đối diện với cạnh c trong tam giác ABC khi biết độ dài ba cạnh a, b, c
                    </>
                }
                example={`$a = 3, b = 4, c = 5 \\Rightarrow \\cos C = \\frac{3^2 + 4^2 - 5^2}{2 \\cdot 3 \\cdot 4} = 0$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$$`}
                    </div>
                </div>

                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-xs sm:text-sm text-amber-800">
                        <span className="mr-2">⚠️</span>
                        <strong>Lưu ý:</strong> Ba cạnh phải thỏa mãn bất đẳng thức tam giác: {"a + b > c, a + c > b, b + c > a"}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Cạnh a"
                            value={a}
                            onChange={(value) => setA(value)}
                            type="number"
                            min="0"
                            step="any"
                            helpText="Số dương"
                        />

                        <InputField
                            label="Cạnh b"
                            value={b}
                            onChange={(value) => setB(value)}
                            type="number"
                            min="0"
                            step="any"
                            helpText="Số dương"
                        />

                        <InputField
                            label="Cạnh c"
                            value={c}
                            onChange={(value) => setC(value)}
                            type="number"
                            min="0"
                            step="any"
                            helpText="Số dương (cạnh đối diện với góc C)"
                        />
                    </div>

                    {!isValidTriangle() && a && b && c && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Ba cạnh này không tạo thành tam giác hợp lệ
                        </div>
                    )}

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && result.value && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {`$$\\cos C = \\frac{${a}^2 + ${b}^2 - ${c}^2}{2 \\cdot ${a} \\cdot ${b}}$$`}
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
                                                {`Áp dụng định lý Cosin: $\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$a = ${a}, b = ${b}, c = ${c}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tử số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$${a}^2 + ${b}^2 - ${c}^2 = ${Math.pow(Number(a), 2)} + ${Math.pow(Number(b), 2)} - ${Math.pow(Number(c), 2)} = ${Math.pow(Number(a), 2) + Math.pow(Number(b), 2) - Math.pow(Number(c), 2)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính mẫu số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$2 \\cdot ${a} \\cdot ${b} = ${2 * Number(a) * Number(b)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính cos C
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$\\cos C = \\frac{${Math.pow(Number(a), 2) + Math.pow(Number(b), 2) - Math.pow(Number(c), 2)}}{${2 * Number(a) * Number(b)}} = ${((Math.pow(Number(a), 2) + Math.pow(Number(b), 2) - Math.pow(Number(c), 2)) / (2 * Number(a) * Number(b))).toFixed(6)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính góc C (độ)
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {Number(result.value).toFixed(6)}°
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
                                        {`$C = \\arccos\\left(\\frac{a^2 + b^2 - c^2}{2ab}\\right)$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                    {`$C = ${Number(result.value).toFixed(6)}°$`}
                                </div>
                            </div>

                            {/* Additional formats */}
                            <div className="mt-3 p-2 bg-green-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Các dạng khác:</strong><br />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                        <div>Radian: {(Number(result.value) * Math.PI / 180).toFixed(6)} rad</div>
                                        <div>Phút: {(Number(result.value) * 60).toFixed(2)}'</div>
                                    </div>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Góc C (đối diện với cạnh c) trong tam giác có độ lớn là{' '}
                                    <span className="font-bold text-blue-600">{Number(result.value).toFixed(6)}°</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Định lý liên quan:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {`$c^2 = a^2 + b^2 - 2ab\\cos C$`}
                                </div>
                                <div className="tex2jax_process">
                                    {`$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {`$A + B + C = 180°$`}
                                </div>
                                <div className="tex2jax_process">
                                    {`$S = \\frac{1}{2}ab\\sin C$`}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default AngleCosSin;