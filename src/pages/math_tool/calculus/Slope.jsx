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

const Slope = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [expression, setExpression] = useState('x**2 + 2*x + 3');
    const [x, setX] = useState(2);
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
        if (!expression || expression.trim() === '') return false;
        if (isNaN(x)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSlope({ expression: expression.trim(), x: Number(x) }));
    };

    // Convert Python expression to LaTeX for display
    const convertToLatex = (expr) => {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '')
            .replace(/\b(\d+)\s*([a-z])/gi, '$1$2')
            .replace(/\b([a-z])\s*(\d+)/gi, '$1^{$2}');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$$`}
                description={
                    <>
                        Hệ số góc của tiếp tuyến tại điểm x₀ chính là{' '}
                        <strong>đạo hàm của hàm số tại điểm đó</strong>
                    </>
                }
                example="Với $f(x) = x^2 + 2x + 3$ tại $x = 2$: $f'(2) = 2 \cdot 2 + 2 = 6$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {"$$f'(x_0) = \\text{hệ số góc tiếp tuyến tại } x_0$$"}
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Biểu thức hàm số f(x)
                            </label>
                            <input
                                type="text"
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ví dụ: x**2 + 2*x + 3"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                Sử dụng ký hiệu Python: x**2 (x²), 2*x (2x), sqrt(x) (√x), sin(x), cos(x), log(x)
                            </div>
                            {expression && (
                                <div className={`${commonClasses.mathDisplay} mt-2`}>
                                    <div className="tex2jax_process text-sm">
                                        $f(x) = {convertToLatex(expression)}$
                                    </div>
                                </div>
                            )}
                        </div>

                        <InputField
                            label="Điểm tính tiếp tuyến (x₀)"
                            value={x}
                            onChange={(value) => setX(Number(value))}
                            type="number"
                            step="any"
                            helpText="Giá trị x tại điểm cần tính hệ số góc"
                        />
                    </div>

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Function and Point Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hàm số:</strong><br />
                            <div className="mt-2">
                                $f(x) = {convertToLatex(result.expression)}$
                            </div>
                            <div className="mt-2">
                                <strong>Điểm tính toán:</strong> $(x_0, f(x_0)) = ({result.point?.x}, {result.point?.y})$
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
                                            Hàm số đã cho
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $f(x) = {convertToLatex(result.expression)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính đạo hàm f'(x)
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {"$f'(x) = \\text{đạo hàm}$"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay x = {result.point?.x} vào f'(x)
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            f'({result.point?.x}) = {result.slope}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Phương trình tiếp tuyến
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                ${result.tangent_equation?.replace(/\*/g, '').replace(/\b(\d+\.?\d*)\s*\(/g, '$1(')}$
                                            </span>
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

                            {/* Slope Result */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-2">
                                    Hệ số góc: {result.slope}
                                </div>
                            </div>

                            {/* Point and Tangent */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">📍 Điểm tiếp xúc:</h5>
                                    <div className="tex2jax_process text-sm">
                                        $({result.point?.x}, {result.point?.y})$
                                    </div>
                                </div>

                                <div className="p-3 bg-white rounded border">
                                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">📐 Phương trình tiếp tuyến:</h5>
                                    <div className="tex2jax_process text-xs break-all">
                                        ${result.tangent_equation?.replace(/\*/g, '').replace(/\b(\d+\.?\d*)\s*\(/g, '$1(')}$
                                    </div>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-4 p-3 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Tại điểm x = {result.point?.x}, đường tiếp tuyến của đồ thị hàm số có{' '}
                                    <span className="font-bold text-blue-600">hệ số góc = {result.slope}</span>
                                    {result.slope > 0 && ' (hàm số đồng biến)'}
                                    {result.slope < 0 && ' (hàm số nghịch biến)'}
                                    {result.slope === 0 && ' (tiếp tuyến nằm ngang)'}
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Lưu ý về hệ số góc:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>• Hệ số góc &gt; 0: hàm số tăng</div>
                                <div>• Hệ số góc &lt; 0: hàm số giảm</div>
                                <div>• Hệ số góc = 0: hàm số có cực trị</div>
                                <div>• |Hệ số góc| lớn: đồ thị dốc hơn</div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Slope;