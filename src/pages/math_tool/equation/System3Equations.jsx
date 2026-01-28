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

const System3Equations = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    // State cho hệ số các phương trình
    const [a1, setA1] = useState(1);
    const [b1, setB1] = useState(1);
    const [c1, setC1] = useState(1);
    const [d1, setD1] = useState(6);

    const [a2, setA2] = useState(2);
    const [b2, setB2] = useState(3);
    const [c2, setC2] = useState(1);
    const [d2, setD2] = useState(14);

    const [a3, setA3] = useState(1);
    const [b3, setB3] = useState(-1);
    const [c3, setC3] = useState(1);
    const [d3, setD3] = useState(2);

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
        const inputs = [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3];
        return inputs.every(input => !isNaN(input) && isFinite(input));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSystem3({
            a1, b1, c1, d1,
            a2, b2, c2, d2,
            a3, b3, c3, d3
        }));
    };

    // Format number for display
    const formatNumber = (num) => {
        if (Math.abs(num) < 1e-10) return 0;
        return Number(num).toFixed(6).replace(/\.?0+$/, '');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\begin{cases}
                    a_1x + b_1y + c_1z = d_1 \\
                    a_2x + b_2y + c_2z = d_2 \\
                    a_3x + b_3y + c_3z = d_3
                \end{cases}$$`}
                description={
                    <>
                        Hệ 3 phương trình bậc nhất 3 ẩn có thể được giải bằng{' '}
                        <strong>phương pháp ma trận</strong> hoặc <strong>phương pháp thế</strong>
                    </>
                }
                example="Ví dụ: $x + y + z = 6$, $2x + 3y + z = 14$, $x - y + z = 2$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập hệ số phương trình
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\begin{cases}
                            a_1x + b_1y + c_1z = d_1 \\\\
                            a_2x + b_2y + c_2z = d_2 \\\\
                            a_3x + b_3y + c_3z = d_3
                            \\end{cases}$$`}
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Phương trình 1 */}
                    <div className="border rounded-lg p-4 bg-blue-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            📐 Phương trình 1: a₁x + b₁y + c₁z = d₁
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <InputField
                                label="a₁"
                                value={a1}
                                onChange={(value) => setA1(Number(value))}
                                step="any"
                                helpText="Hệ số x"
                            />
                            <InputField
                                label="b₁"
                                value={b1}
                                onChange={(value) => setB1(Number(value))}
                                step="any"
                                helpText="Hệ số y"
                            />
                            <InputField
                                label="c₁"
                                value={c1}
                                onChange={(value) => setC1(Number(value))}
                                step="any"
                                helpText="Hệ số z"
                            />
                            <InputField
                                label="d₁"
                                value={d1}
                                onChange={(value) => setD1(Number(value))}
                                step="any"
                                helpText="Vế phải"
                            />
                        </div>
                    </div>

                    {/* Phương trình 2 */}
                    <div className="border rounded-lg p-4 bg-green-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            📐 Phương trình 2: a₂x + b₂y + c₂z = d₂
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <InputField
                                label="a₂"
                                value={a2}
                                onChange={(value) => setA2(Number(value))}
                                step="any"
                                helpText="Hệ số x"
                            />
                            <InputField
                                label="b₂"
                                value={b2}
                                onChange={(value) => setB2(Number(value))}
                                step="any"
                                helpText="Hệ số y"
                            />
                            <InputField
                                label="c₂"
                                value={c2}
                                onChange={(value) => setC2(Number(value))}
                                step="any"
                                helpText="Hệ số z"
                            />
                            <InputField
                                label="d₂"
                                value={d2}
                                onChange={(value) => setD2(Number(value))}
                                step="any"
                                helpText="Vế phải"
                            />
                        </div>
                    </div>

                    {/* Phương trình 3 */}
                    <div className="border rounded-lg p-4 bg-yellow-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            📐 Phương trình 3: a₃x + b₃y + c₃z = d₃
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <InputField
                                label="a₃"
                                value={a3}
                                onChange={(value) => setA3(Number(value))}
                                step="any"
                                helpText="Hệ số x"
                            />
                            <InputField
                                label="b₃"
                                value={b3}
                                onChange={(value) => setB3(Number(value))}
                                step="any"
                                helpText="Hệ số y"
                            />
                            <InputField
                                label="c₃"
                                value={c3}
                                onChange={(value) => setC3(Number(value))}
                                step="any"
                                helpText="Hệ số z"
                            />
                            <InputField
                                label="d₃"
                                value={d3}
                                onChange={(value) => setD3(Number(value))}
                                step="any"
                                helpText="Vế phải"
                            />
                        </div>
                    </div>

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && result.status === 'ok' && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* System Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Hệ phương trình:</strong><br />
                            <div className="mt-2">
                                {`$$\\begin{cases}
                                    ${a1}x + ${b1}y + ${c1}z = ${d1} \\\\
                                    ${a2}x + ${b2}y + ${c2}z = ${d2} \\\\
                                    ${a3}x + ${b3}y + ${c3}z = ${d3}
                                    \\end{cases}$$`}
                            </div>

                        </div>
                    </div>

                    {/* Solution Table */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Nghiệm của hệ phương trình:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Ẩn số</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                        <th className={commonClasses.tableHeader}>Ký hiệu toán học</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-blue-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>x</td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {formatNumber(result.x)}
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $x = {formatNumber(result.x)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-green-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>y</td>
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            {formatNumber(result.y)}
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $y = {formatNumber(result.y)}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-yellow-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>z</td>
                                        <td className={`${commonClasses.tableCell} font-bold text-yellow-600`}>
                                            {formatNumber(result.z)}
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $z = {formatNumber(result.z)}$
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
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">
                                🎯 Nghiệm của hệ phương trình:
                            </strong>

                            {/* Solution Display */}
                            <div className="mt-3 p-4 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-sm sm:text-base">
                                    {`$$\\begin{cases}
                                        x = ${formatNumber(result.x)} \\\\
                                        y = ${formatNumber(result.y)} \\\\
                                        z = ${formatNumber(result.z)}
                                        \\end{cases}$$`}
                                </div>

                            </div>

                            {/* Verification */}
                            <div className="mt-4 p-3 bg-green-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>✅ Kiểm tra:</strong>
                                    <div className="mt-2 space-y-1">
                                        <div>PT1: {a1} × {formatNumber(result.x)} + {b1} × {formatNumber(result.y)} + {c1} × {formatNumber(result.z)} = {formatNumber(a1 * result.x + b1 * result.y + c1 * result.z)} ≈ {d1}</div>
                                        <div>PT2: {a2} × {formatNumber(result.x)} + {b2} × {formatNumber(result.y)} + {c2} × {formatNumber(result.z)} = {formatNumber(a2 * result.x + b2 * result.y + c2 * result.z)} ≈ {d2}</div>
                                        <div>PT3: {a3} × {formatNumber(result.x)} + {b3} × {formatNumber(result.y)} + {c3} × {formatNumber(result.z)} = {formatNumber(a3 * result.x + b3 * result.y + c3 * result.z)} ≈ {d3}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Method Info */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Phương pháp giải:
                                </h5>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <div>• Sử dụng phương pháp ma trận (Ma trận nghịch đảo)</div>
                                    <div>• Công thức: $X = A^{-1}B$ với $A$ là ma trận hệ số, $B$ là vector vế phải</div>
                                    <div>• Độ chính xác: Số thực với độ chính xác máy tính</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}

            {result && result.status !== 'ok' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                    <strong className="font-bold">❌ Lỗi:</strong>
                    <span className="block sm:inline ml-2">
                        Hệ phương trình không có nghiệm hoặc có vô số nghiệm
                    </span>
                </div>
            )}
        </div>
    );
};

export default System3Equations;