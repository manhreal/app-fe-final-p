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

const TriangleAngle = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(5);
    const [b, setB] = useState(6);
    const [c, setC] = useState(7);
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
        if (a <= 0 || b <= 0 || c <= 0) return false;
        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return false;
        // Kiểm tra bất đẳng thức tam giác
        if (a + b <= c || a + c <= b || b + c <= a) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionTriangleAngle({ a, b, c }));
    };

    const isValidTriangle = () => {
        return a + b > c && a + c > b && b + c > a;
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$\cos A = \frac{b^2 + c^2 - a^2}{2bc}$$`}
                description={
                    <>
                        Định lý Cosin cho phép tính các góc của tam giác khi biết{' '}
                        <strong>độ dài 3 cạnh</strong>
                    </>
                }
                example={String.raw`Với $a=5$, $b=6$, $c=7$ thì $\cos A = \frac{6^2 + 7^2 - 5^2}{2 \times 6 \times 7} = \frac{60}{84}$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\cos A = \frac{b^2 + c^2 - a^2}{2bc}$$`}
                        <div className="mt-2">
                            {String.raw`$$\cos B = \frac{a^2 + c^2 - b^2}{2ac}$$`}
                        </div>
                        <div className="mt-2">
                            {String.raw`$$\cos C = \frac{a^2 + b^2 - c^2}{2ab}$$`}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Cạnh a"
                            type="number"
                            value={a}
                            onChange={(value) => setA(Number(value))}
                            min="0.01"
                            step="0.01"
                            helpText="Độ dài cạnh a (số dương)"
                        />

                        <InputField
                            label="Cạnh b"
                            type="number"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            min="0.01"
                            step="0.01"
                            helpText="Độ dài cạnh b (số dương)"
                        />

                        <InputField
                            label="Cạnh c"
                            type="number"
                            value={c}
                            onChange={(value) => setC(Number(value))}
                            min="0.01"
                            step="0.01"
                            helpText="Độ dài cạnh c (số dương)"
                        />
                    </div>

                    {(a > 0 && b > 0 && c > 0 && !isValidTriangle()) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Ba cạnh này không tạo thành tam giác hợp lệ (vi phạm bất đẳng thức tam giác)
                        </div>
                    )}

                    {(!validateInputs() && (a !== '' && b !== '' && c !== '')) && isValidTriangle() && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Tất cả các cạnh phải là số dương
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
                            <strong>Công thức áp dụng:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$\cos A = \frac{b^2 + c^2 - a^2}{2bc} = \frac{${b}^2 + ${c}^2 - ${a}^2}{2 \times ${b} \times ${c}}$$`}
                            </div>
                            <div className="mt-2">
                                {String.raw`$$\cos B = \frac{a^2 + c^2 - b^2}{2ac} = \frac{${a}^2 + ${c}^2 - ${b}^2}{2 \times ${a} \times ${c}}$$`}
                            </div>
                            <div className="mt-2">
                                {String.raw`$$\cos C = \frac{a^2 + b^2 - c^2}{2ab} = \frac{${a}^2 + ${b}^2 - ${c}^2}{2 \times ${a} \times ${b}}$$`}
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
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[500px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Góc</th>
                                        <th className={commonClasses.tableHeader}>Công thức</th>
                                        <th className={commonClasses.tableHeader}>Tính toán</th>
                                        <th className={commonClasses.tableHeader}>Kết quả (độ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>A</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\cos A = \frac{b^2 + c^2 - a^2}{2bc}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\frac{${b * b} + ${c * c} - ${a * a}}{${2 * b * c}}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.A ? result.A.toFixed(2) : ''}°
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>B</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\cos B = \frac{a^2 + c^2 - b^2}{2ac}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\frac{${a * a} + ${c * c} - ${b * b}}{${2 * a * c}}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.B ? result.B.toFixed(2) : ''}°
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>C</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\cos C = \frac{a^2 + b^2 - c^2}{2ab}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$\frac{${a * a} + ${b * b} - ${c * c}}{${2 * a * b}}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.C ? result.C.toFixed(2) : ''}°
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {(result?.A && result?.B && result?.C) && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Triangle Diagram */}
                                <div className="mt-3 p-4 bg-white rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700 mb-3">
                                        <strong>Tam giác ABC với các cạnh:</strong> a = {a}, b = {b}, c = {c}
                                    </div>

                                    {/* Angles Results */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-3 rounded border">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-700">Góc A</div>
                                            <div className="tex2jax_process text-lg sm:text-xl font-bold text-blue-600">
                                                {result.A.toFixed(2)}°
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                đối diện cạnh a
                                            </div>
                                        </div>

                                        <div className="bg-green-50 p-3 rounded border">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-700">Góc B</div>
                                            <div className="tex2jax_process text-lg sm:text-xl font-bold text-green-600">
                                                {result.B.toFixed(2)}°
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                đối diện cạnh b
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 p-3 rounded border">
                                            <div className="text-xs sm:text-sm font-semibold text-gray-700">Góc C</div>
                                            <div className="tex2jax_process text-lg sm:text-xl font-bold text-purple-600">
                                                {result.C.toFixed(2)}°
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                đối diện cạnh c
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification */}
                                <div className="mt-3 p-2 bg-green-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Kiểm tra:</strong> Tổng 3 góc = {(result.A + result.B + result.C).toFixed(2)}°
                                        {Math.abs((result.A + result.B + result.C) - 180) < 0.1 ?
                                            <span className="text-green-600 ml-1">✓ Chính xác</span> :
                                            <span className="text-red-600 ml-1">⚠ Sai số</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Định lý Cosin:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$a^2 = b^2 + c^2 - 2bc\cos A$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$b^2 = a^2 + c^2 - 2ac\cos B$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$c^2 = a^2 + b^2 - 2ab\cos C$`}
                                    </div>
                                    <div className="text-left">
                                        Tổng 3 góc = 180°
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

export default TriangleAngle;