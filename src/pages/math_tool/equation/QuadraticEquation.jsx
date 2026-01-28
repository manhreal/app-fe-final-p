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

const QuadraticEquation = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a, setA] = useState(1);
    const [b, setB] = useState(-5);
    const [c, setC] = useState(6);
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
        if (a === 0) return false; // Không phải phương trình bậc hai
        if (isNaN(a) || isNaN(b) || isNaN(c)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionQuadraticEquation({ a: Number(a), b: Number(b), c: Number(c) }));
    };

    // Function to get equation display
    const getEquationDisplay = () => {
        let equation = '';

        // Hệ số a
        if (a === 1) {
            equation = 'x^2';
        } else if (a === -1) {
            equation = '-x^2';
        } else {
            equation = `${a}x^2`;
        }

        // Hệ số b
        if (b > 0) {
            if (b === 1) {
                equation += ' + x';
            } else {
                equation += ` + ${b}x`;
            }
        } else if (b < 0) {
            if (b === -1) {
                equation += ' - x';
            } else {
                equation += ` - ${Math.abs(b)}x`;
            }
        }

        // Hệ số c
        if (c > 0) {
            equation += ` + ${c}`;
        } else if (c < 0) {
            equation += ` - ${Math.abs(c)}`;
        }

        equation += ' = 0';
        return equation;
    };

    // Function to get discriminant
    const getDiscriminant = () => {
        return b * b - 4 * a * c;
    };

    const getRootTypeText = (type) => {
        switch (type) {
            case 'two_roots':
                return 'Hai nghiệm phân biệt';
            case 'one_root':
                return 'Nghiệm kép';
            case 'no_root':
                return 'Vô nghiệm';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$ax^2 + bx + c = 0 \quad (a \neq 0)$$`}
                description={
                    <>
                        Phương trình bậc hai một ẩn có dạng $ax^2 + bx + c = 0$ với{' '}
                        <strong>$a \neq 0$</strong>
                    </>
                }
                example="$\Delta = b^2 - 4ac$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        $${getEquationDisplay().replace(/\^2/g, '^{2}')}$$
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số a"
                            value={a}
                            onChange={(value) => setA(value === '' ? 0 : Number(value))}
                            step="any"
                            helpText="a ≠ 0"
                        />

                        <InputField
                            label="Hệ số b"
                            value={b}
                            onChange={(value) => setB(value === '' ? 0 : Number(value))}
                            step="any"
                            helpText="Số thực bất kỳ"
                        />

                        <InputField
                            label="Hệ số c"
                            value={c}
                            onChange={(value) => setC(value === '' ? 0 : Number(value))}
                            step="any"
                            helpText="Số thực bất kỳ"
                        />
                    </div>

                    {a === 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Hệ số a phải khác 0 để có phương trình bậc hai
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
                    {/* Equation Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phương trình:</strong><br />
                            <div className="mt-2">
                                $${getEquationDisplay().replace(/\^2/g, '^{2}')}$$
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
                                                Tính biệt thức: $\Delta = b^2 - 4ac$
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                $\Delta = {b}^2 - 4 \times {a} \times {c} = {getDiscriminant()}$
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết luận về nghiệm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="text-xs sm:text-sm">
                                                {getRootTypeText(result?.type)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Nghiệm của phương trình
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.type === 'two_roots' && (
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    $x_1 = {result.x1}$, $x_2 = {result.x2}$
                                                </span>
                                            )}
                                            {result?.type === 'one_root' && (
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    $x = {result.x1}$
                                                </span>
                                            )}
                                            {result?.type === 'no_root' && (
                                                <span className="text-xs sm:text-sm text-red-600">
                                                    Vô nghiệm
                                                </span>
                                            )}
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

                            {/* Equation Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        $${getEquationDisplay().replace(/\^2/g, '^{2}')}$$
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                {result?.type === 'two_roots' && (
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        $x_1 = {result.x1}$, $x_2 = {result.x2}$
                                    </div>
                                )}
                                {result?.type === 'one_root' && (
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        $x = {result.x1}$
                                    </div>
                                )}
                                {result?.type === 'no_root' && (
                                    <div className="text-lg sm:text-2xl font-bold text-red-600">
                                        Vô nghiệm
                                    </div>
                                )}
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong>
                                    {result?.type === 'two_roots' && (
                                        <span> Phương trình có <span className="font-bold text-blue-600">hai nghiệm phân biệt</span> là x₁ = {result.x1} và x₂ = {result.x2}</span>
                                    )}
                                    {result?.type === 'one_root' && (
                                        <span> Phương trình có <span className="font-bold text-blue-600">nghiệm kép</span> x = {result.x1}</span>
                                    )}
                                    {result?.type === 'no_root' && (
                                        <span>
                                            Phương trình <span className="font-bold text-red-600">vô nghiệm</span> (Δ &lt; 0)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Quy tắc giải phương trình bậc hai:
                            </h5>
                            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {"$\\Delta > 0$: Hai nghiệm phân biệt"}
                                </div>
                                <div className="tex2jax_process">
                                    {"$\\Delta = 0$: Nghiệm kép $x = -\\frac{b}{2a}$"}
                                </div>
                                <div className="tex2jax_process">
                                    {"$\\Delta < 0$: Vô nghiệm (trên tập số thực)"}
                                </div>
                                <div className="tex2jax_process">
                                    {"Nghiệm: $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$"}
                                </div>
                            </div>

                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default QuadraticEquation;