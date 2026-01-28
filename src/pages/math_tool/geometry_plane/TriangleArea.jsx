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

const TriangleArea = () => {
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
        if (a <= 0 || b <= 0 || c <= 0) return false;
        // Kiểm tra bất đẳng thức tam giác
        if (a + b <= c || a + c <= b || b + c <= a) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionTriangleArea({ a, b, c }));
    };

    // Tính nửa chu vi để hiển thị
    const semiPerimeter = (a + b + c) / 2;

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$S = \sqrt{s(s-a)(s-b)(s-c)}$$`}
                description={
                    <>
                        Công thức Heron tính diện tích tam giác khi biết độ dài 3 cạnh, trong đó{' '}
                        <strong>s là nửa chu vi</strong>: $s = \frac{a + b + c}{2}$
                    </>
                }
                example={`$S = \\sqrt{6 \\times (6-3) \\times (6-4) \\times (6-5)} = \\sqrt{6 \\times 3 \\times 2 \\times 1} = 6$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">📏</span>
                    Nhập độ dài 3 cạnh
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$S = \\sqrt{s(s-a)(s-b)(s-c)}$$`}
                        <div className="mt-2 text-sm">
                            {`với $s = \\frac{a+b+c}{2}$`}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Cạnh a"
                            value={a}
                            onChange={(value) => setA(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            type="number"
                            helpText="Số dương"
                        />

                        <InputField
                            label="Cạnh b"
                            value={b}
                            onChange={(value) => setB(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            type="number"
                            helpText="Số dương"
                        />

                        <InputField
                            label="Cạnh c"
                            value={c}
                            onChange={(value) => setC(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            type="number"
                            helpText="Số dương"
                        />
                    </div>

                    {!validateInputs() && a > 0 && b > 0 && c > 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Ba cạnh phải thỏa mãn bất đẳng thức tam giác (tổng 2 cạnh &gt; cạnh thứ 3)
                        </div>
                    )}

                    {validateInputs() && (
                        <div className="text-green-600 text-sm mt-2 text-center">
                            ✅ Nửa chu vi: s = {semiPerimeter.toFixed(2)}
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
                            <strong>Công thức Heron:</strong><br />
                            <div className="mt-2">
                                {`$$S = \\sqrt{s(s-a)(s-b)(s-c)}$$`}
                            </div>
                            <div className="mt-2 text-sm">
                                {`với $s = \\frac{${a}+${b}+${c}}{2} = ${semiPerimeter}$`}
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
                                                {`Tính nửa chu vi: $s = \\frac{a+b+c}{2}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$s = \\frac{${a}+${b}+${c}}{2} = ${semiPerimeter}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Tính $(s-a)$, $(s-b)$, $(s-c)$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$(${semiPerimeter}-${a}) \\times (${semiPerimeter}-${b}) \\times (${semiPerimeter}-${c})$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Áp dụng công thức Heron
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$S = \\sqrt{${semiPerimeter} \\times ${(semiPerimeter - a).toFixed(1)} \\times ${(semiPerimeter - b).toFixed(1)} \\times ${(semiPerimeter - c).toFixed(1)}}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.value} (đơn vị²)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.value && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$S = \\sqrt{${semiPerimeter}(${semiPerimeter}-${a})(${semiPerimeter}-${b})(${semiPerimeter}-${c})}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        $S = {result?.value}$ đơn vị²
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Diện tích tam giác có 3 cạnh {a}, {b}, {c} là{' '}
                                        <span className="font-bold text-blue-600">{result?.value}</span> đơn vị diện tích
                                    </div>
                                </div>
                            </div>

                            {/* Triangle Type Classification */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    📝 Phân loại tam giác:
                                </h5>
                                <div className="text-xs text-gray-600">
                                    {(() => {
                                        const sides = [a, b, c].sort((x, y) => x - y);
                                        const [min, mid, max] = sides;

                                        if (a === b && b === c) {
                                            return "🔺 Tam giác đều (3 cạnh bằng nhau)";
                                        } else if (a === b || b === c || a === c) {
                                            return "🔺 Tam giác cân (2 cạnh bằng nhau)";
                                        } else if (Math.abs(min * min + mid * mid - max * max) < 0.01) {
                                            return "🔺 Tam giác vuông";
                                        } else if (min * min + mid * mid > max * max) {
                                            return "🔺 Tam giác nhọn";
                                        } else {
                                            return "🔺 Tam giác tù";
                                        }
                                    })()}
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Thông tin thêm:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        Chu vi: $P = {a + b + c}$
                                    </div>
                                    <div className="tex2jax_process">
                                        Nửa chu vi: $s = {semiPerimeter}$
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Bán kính đường tròn ngoại tiếp: $R = \\frac{abc}{4S} = ${((a * b * c) / (4 * result?.value)).toFixed(2)}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Bán kính đường tròn nội tiếp: $r = \\frac{S}{s} = ${(result?.value / semiPerimeter).toFixed(2)}$`}
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

export default TriangleArea;