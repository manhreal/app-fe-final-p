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

const AreaBetween = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [f, setF] = useState('x**2');
    const [g, setG] = useState('x');
    const [a, setA] = useState(0);
    const [b, setB] = useState(1);
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
        if (!f.trim() || !g.trim()) return false;
        if (isNaN(a) || isNaN(b)) return false;
        if (a >= b) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionAreaBetween({ f, g, a: Number(a), b: Number(b) }));
    };

    // Convert Python notation to LaTeX
    const convertToLatex = (expression) => {
        return expression
            .replace(/\*\*/g, '^')
            .replace(/\*/g, ' \\cdot ')
            .replace(/sqrt\(/g, '\\sqrt{')
            .replace(/sin\(/g, '\\sin(')
            .replace(/cos\(/g, '\\cos(')
            .replace(/tan\(/g, '\\tan(')
            .replace(/log\(/g, '\\log(')
            .replace(/ln\(/g, '\\ln(')
            .replace(/exp\(/g, 'e^{');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$S = \int_{a}^{b} |f(x) - g(x)| \, dx$$`}
                description={
                    <>
                        Diện tích miền giới hạn bởi hai đồ thị hàm số f(x) và g(x) trong khoảng [a,b] được tính bằng{' '}
                        <strong>tích phân của giá trị tuyệt đối hiệu hai hàm số</strong>
                    </>
                }
                example="Với $f(x) = x^2$, $g(x) = x$, [0,1]: $S = \int_{0}^{1} |x^2 - x| dx = \frac{1}{6}$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$S = \int_{a}^{b} |f(x) - g(x)| \, dx$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <InputField
                            label="Hàm số f(x)"
                            value={f}
                            onChange={setF}
                            type="text"
                            placeholder="x**2"
                            helpText="Ví dụ: x**2, sin(x), x**3 + 2*x - 1"
                        />

                        <InputField
                            label="Hàm số g(x)"
                            value={g}
                            onChange={setG}
                            type="text"
                            placeholder="x"
                            helpText="Ví dụ: x, cos(x), 2*x + 1"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <InputField
                                label="Cận dưới (a)"
                                value={a}
                                onChange={(value) => setA(Number(value))}
                                type="number"
                                step="0.1"
                                helpText="Giá trị số thực"
                            />

                            <InputField
                                label="Cận trên (b)"
                                value={b}
                                onChange={(value) => setB(Number(value))}
                                type="number"
                                step="0.1"
                                helpText="Giá trị số thực (b > a)"
                            />
                        </div>
                    </div>

                    {a >= b && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Cận trên b phải lớn hơn cận dưới a
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
                    {/* Function Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Các hàm số:</strong><br />
                            <div className="mt-2 space-y-2">
                                <div>$f(x) = {convertToLatex(result.f)}$</div>
                                <div>$g(x) = {convertToLatex(result.g)}$</div>
                                <div>Khoảng tính toán: $[{result.lower}, {result.upper}]$</div>
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
                                            Xác định các hàm số
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $f(x) = {convertToLatex(result.f)}$, $g(x) = {convertToLatex(result.g)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tìm giao điểm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="text-xs sm:text-sm">
                                                x = {result.intersections?.join(', ') || 'Không có giao điểm trong khoảng'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Áp dụng công thức tích phân
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {"$S = \\int_{" + result.lower + "}^{" + result.upper + "} |f(x) - g(x)| dx$"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả diện tích
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result.area?.toFixed(6) || result.area}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result.area && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {"$S = \\int_{" + result.lower + "}^{" + result.upper + "} |" +
                                                convertToLatex(result.f) + " - " + convertToLatex(result.g) +
                                                "| \\, dx$"}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        $S = {result.area?.toFixed(6) || result.area}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Diện tích miền giới hạn bởi đồ thị hai hàm số{' '}
                                        <span className="font-mono bg-gray-100 px-1 rounded">{result.f}</span> và{' '}
                                        <span className="font-mono bg-gray-100 px-1 rounded">{result.g}</span>{' '}
                                        trong khoảng [{result.lower}, {result.upper}] là{' '}
                                        <span className="font-bold text-blue-600">{result.area?.toFixed(6) || result.area}</span> đơn vị diện tích
                                    </div>
                                </div>
                            </div>

                            {/* Intersection Points */}
                            {result.intersections && result.intersections.length > 0 && (
                                <div className="mt-4 text-center">
                                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                        🔍 Giao điểm của hai đồ thị:
                                    </h5>
                                    <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                                        {result.intersections.map((point, index) => (
                                            <div key={index} className="bg-gray-100 px-2 py-1 rounded">
                                                <span className="tex2jax_process">
                                                    $x = {point}$
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Lưu ý về diện tích miền:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    <div>• Diện tích luôn có giá trị không âm</div>
                                    <div>• Khi hai đồ thị cắt nhau, cần chia khoảng tích phân</div>
                                    <div>• Diện tích được tính bằng tích phân của |f(x) - g(x)|</div>
                                    <div>• Kết quả có đơn vị là đơn vị diện tích</div>
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default AreaBetween;