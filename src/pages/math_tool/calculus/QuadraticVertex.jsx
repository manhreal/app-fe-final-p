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

const QuadraticVertex = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(1);
    const [b, setB] = useState(-4);
    const [c, setC] = useState(3);
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
        if (a === 0) return false; // Hệ số a không được bằng 0
        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionQuadraticVertex({ a, b, c }));
    };

    const getDirectionText = (direction) => {
        return direction === 'upward' ? 'Hướng lên (a > 0)' : 'Hướng xuống (a < 0)';
    };

    const getRootsInfoText = (rootsInfo) => {
        switch (rootsInfo) {
            case 'two_real_roots':
                return 'Có 2 nghiệm thực phân biệt';
            case 'one_real_root':
                return 'Có 1 nghiệm thực (nghiệm kép)';
            case 'no_real_roots':
                return 'Không có nghiệm thực';
            default:
                return 'Chưa xác định';
        }
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$y = ax^2 + bx + c \quad (a \neq 0)$$`}
                description={
                    <>
                        Tọa độ đỉnh parabol được tính theo công thức:{' '}
                        <strong>{"$x_{\\text{đỉnh}} = -\\frac{b}{2a}$"}</strong> và{" "}
                        <strong>{"$y_{\\text{đỉnh}} = -\\frac{\\Delta}{4a}$"}</strong>
                    </>
                }
                example="$y = x^2 - 4x + 3$ có đỉnh tại $(\frac{4}{2}, -1) = (2, -1)$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $$y = ax^2 + bx + c$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số a"
                            value={a}
                            onChange={(value) => setA(Number(value))}
                            step="0.1"
                            helpText="Hệ số của x² (a ≠ 0)"
                        />

                        <InputField
                            label="Hệ số b"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            step="0.1"
                            helpText="Hệ số của x"
                        />

                        <InputField
                            label="Hệ số c"
                            value={c}
                            onChange={(value) => setC(Number(value))}
                            step="0.1"
                            helpText="Hằng số"
                        />
                    </div>

                    {a === 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Hệ số a phải khác 0 để tạo thành phương trình bậc 2
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
                            <strong>Phương trình:</strong><br />
                            <div className="mt-2">
                                {result?.coefficients && (
                                    <div className="mt-2">
                                        $y = {result.coefficients.a}x^2 + {result.coefficients.b}x + {result.coefficients.c}$
                                    </div>
                                )}
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
                                                {"Tính hoành độ đỉnh: $x_V = -\\frac{b}{2a}$"}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {result?.vertex && (
                                                    `$x_V = -\\frac{${result.coefficients.b}}{2 \\cdot ${result.coefficients.a}} = ${result.vertex.x}$`
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {"Tính tung độ đỉnh: $y_V = -\\frac{\\Delta}{4a}$"}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {result?.vertex && result?.discriminant !== undefined && (
                                                    `$y_V = -\\frac{${result.discriminant}}{4 \\cdot ${result.coefficients.a}} = ${result.vertex.y}$`
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tọa độ đỉnh parabol
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.vertex && (
                                                `(${result.vertex.x}, ${result.vertex.y})`
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Biệt thức Δ = b² - 4ac
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            {result?.discriminant}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Hướng mở parabol
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            {result?.direction && getDirectionText(result.direction)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.vertex && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {result?.coefficients && (
                                                `$y = ${result.coefficients.a}x^2 + ${result.coefficients.b}x + ${result.coefficients.c}$`
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Vertex Coordinates */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        $V(${result.vertex.x}, ${result.vertex.y})$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Đỉnh parabol có tọa độ{' '}
                                        <span className="font-bold text-blue-600">({result.vertex.x}, {result.vertex.y})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded border">
                                    <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                        📊 Thông tin thêm:
                                    </h5>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div>
                                            <strong>Biệt thức Δ:</strong> {result.discriminant}
                                        </div>
                                        <div>
                                            <strong>Hướng mở:</strong> {getDirectionText(result.direction)}
                                        </div>
                                        <div>
                                            <strong>Nghiệm:</strong> {getRootsInfoText(result.roots_info)}
                                        </div>
                                    </div>
                                </div>

                                {result.roots && result.roots.length > 0 && (
                                    <div className="bg-white p-3 rounded border">
                                        <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                            🔍 Nghiệm phương trình:
                                        </h5>
                                        <div className="text-xs text-gray-600">
                                            {result.roots.map((root, index) => (
                                                <div key={index} className="tex2jax_process">
                                                    $x_{index + 1} = {root}$
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất parabol:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        Trục đối xứng: $x = {result.vertex.x}$
                                    </div>
                                    <div>
                                        {result.direction === 'upward'
                                            ? `Giá trị nhỏ nhất: y = ${result.vertex.y}`
                                            : `Giá trị lớn nhất: y = ${result.vertex.y}`
                                        }
                                    </div>
                                    <div className="tex2jax_process">
                                        $\Delta = b^2 - 4ac = {result.discriminant}$
                                    </div>
                                    <div>
                                        {result.discriminant > 0 ? 'Parabol cắt trục Ox tại 2 điểm' :
                                            result.discriminant === 0 ? 'Parabol tiếp xúc trục Ox' :
                                                'Parabol không cắt trục Ox'}
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

export default QuadraticVertex;