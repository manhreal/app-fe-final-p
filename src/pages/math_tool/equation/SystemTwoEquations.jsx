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

const SystemTwoEquations = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a1, setA1] = useState(1);
    const [b1, setB1] = useState(1);
    const [c1, setC1] = useState(5);
    const [a2, setA2] = useState(1);
    const [b2, setB2] = useState(-1);
    const [c2, setC2] = useState(1);
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
        if (!Number.isFinite(a1) || !Number.isFinite(b1) || !Number.isFinite(c1)) return false;
        if (!Number.isFinite(a2) || !Number.isFinite(b2) || !Number.isFinite(c2)) return false;
        // Check if the system has a unique solution (determinant != 0)
        const determinant = a1 * b2 - a2 * b1;
        return determinant !== 0;
    };

    const getDeterminant = () => {
        return a1 * b2 - a2 * b1;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSystem2({ a1, b1, c1, a2, b2, c2 }));
    };

    const formatNumber = (value) => {
        return Number(value) === 0 ? 0 : Number(value);
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}$$`}
                description={
                    <>
                        Hệ phương trình bậc nhất 2 ẩn có nghiệm duy nhất khi{' '}
                        <strong>định thức $D = a_1b_2 - a_2b_1 \neq 0$</strong>
                    </>
                }
                example="$x = \frac{D_x}{D}$, $y = \frac{D_y}{D}$ với $D_x = c_1b_2 - c_2b_1$, $D_y = a_1c_2 - a_2c_1$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\begin{cases}
                            a_1x + b_1y = c_1 \\\\
                            a_2x + b_2y = c_2
                            \\end{cases}$$`}
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Equation */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">1️⃣</span>
                            Phương trình thứ nhất: $a_1x + b_1y = c_1$
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField
                                label="Hệ số a₁"
                                value={a1}
                                onChange={(value) => setA1(formatNumber(value))}
                                step="0.1"
                                helpText="Hệ số của x"
                            />
                            <InputField
                                label="Hệ số b₁"
                                value={b1}
                                onChange={(value) => setB1(formatNumber(value))}
                                step="0.1"
                                helpText="Hệ số của y"
                            />
                            <InputField
                                label="Hằng số c₁"
                                value={c1}
                                onChange={(value) => setC1(formatNumber(value))}
                                step="0.1"
                                helpText="Số hạng tự do"
                            />
                        </div>
                    </div>

                    {/* Second Equation */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">2️⃣</span>
                            Phương trình thứ hai: $a_2x + b_2y = c_2$
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField
                                label="Hệ số a₂"
                                value={a2}
                                onChange={(value) => setA2(formatNumber(value))}
                                step="0.1"
                                helpText="Hệ số của x"
                            />
                            <InputField
                                label="Hệ số b₂"
                                value={b2}
                                onChange={(value) => setB2(formatNumber(value))}
                                step="0.1"
                                helpText="Hệ số của y"
                            />
                            <InputField
                                label="Hằng số c₂"
                                value={c2}
                                onChange={(value) => setC2(formatNumber(value))}
                                step="0.1"
                                helpText="Số hạng tự do"
                            />
                        </div>
                    </div>

                    {/* System Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">👁️</span>
                            Hệ phương trình hiện tại:
                        </h4>
                        <div className={`${commonClasses.mathDisplay}`}>
                            <div className="tex2jax_process text-sm sm:text-base">
                                {`$$\\begin{cases}
                                    ${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1} \\\\
                                    ${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}
                                    \\end{cases}$$`}
                            </div>

                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Định thức D = {a1} × {b2} - {a2} × {b1} = {getDeterminant()}
                        </div>
                    </div>

                    {getDeterminant() === 0 && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                            ⚠️ Lưu ý: Định thức D = 0, hệ phương trình không có nghiệm duy nhất
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
                    {/* System Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hệ phương trình:</strong><br />
                            <div className="mt-2">
                                {`$$\\begin{cases}
                                    ${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1} \\\\
                                    ${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}
                                    \\end{cases}$$`}
                            </div>

                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết giải hệ phương trình:
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
                                                Tính định thức $D = a_1b_2 - a_2b_1$
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $D = {a1} \times {b2} - {a2} \times {b1} = {getDeterminant()}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                Tính $D_x = c_1b_2 - c_2b_1$
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $D_x = {c1} \times {b2} - {c2} \times {b1} = {c1 * b2 - c2 * b1}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                Tính $D_y = a_1c_2 - a_2c_1$
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $D_y = {a1} \times {c2} - {a2} \times {c1} = {a1 * c2 - a2 * c1}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Tính $x = \\frac{D_x}{D}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $x = {result?.x || 0}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`Tính $y = \\frac{D_y}{D}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $y = {result?.y || 0}$
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {(result?.x !== undefined && result?.y !== undefined) && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Nghiệm của hệ phương trình:</strong>

                                {/* Solution Display */}
                                <div className="mt-3 p-4 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-base sm:text-lg">
                                        {`$$\\begin{cases}
                                            x = ${result?.x} \\\\
                                            y = ${result?.y}
                                            \\end{cases}$$`}
                                    </div>

                                </div>

                                {/* Result Values */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className={`${commonClasses.resultBox} bg-blue-50`}>
                                        <div className="text-sm text-gray-600 mb-1">Giá trị x:</div>
                                        <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                            ${result?.x}$
                                        </div>
                                    </div>
                                    <div className={`${commonClasses.resultBox} bg-green-50`}>
                                        <div className="text-sm text-gray-600 mb-1">Giá trị y:</div>
                                        <div className="tex2jax_process text-lg sm:text-2xl font-bold text-green-600">
                                            ${result?.y}$
                                        </div>
                                    </div>
                                </div>

                                {/* Verification */}
                                <div className="mt-4 p-3 bg-yellow-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Kiểm tra nghiệm:</strong>
                                        <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
                                            <div className="tex2jax_process">
                                                Phương trình 1: ${a1} \times {result?.x} + {b1} \times {result?.y} = {a1 * result?.x + b1 * result?.y}$ (= ${c1}$)
                                            </div>
                                            <div className="tex2jax_process">
                                                Phương trình 2: ${a2} \times {result?.x} + {b2} \times {result?.y} = {a2 * result?.x + b2 * result?.y}$ (= ${c2}$)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Phương pháp giải hệ phương trình:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>Phương pháp Cramer</div>
                                    <div>Phương pháp thế</div>
                                    <div>Phương pháp cộng đại số</div>
                                    <div>Phương pháp ma trận</div>
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default SystemTwoEquations;