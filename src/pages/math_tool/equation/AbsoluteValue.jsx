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

const AbsoluteValue = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [left, setLeft] = useState('Abs(x - 2)');
    const [right, setRight] = useState('3');
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
        if (!left.trim() || !right.trim()) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionAbs({ left: left.trim(), right: right.trim() }));
    };

    // Convert expression to LaTeX format for display
    const convertToLatex = (expr) => {
        return expr
            .replace(/Abs\((.*?)\)/g, '|$1|')
            .replace(/\*/g, ' \\cdot ')
            .replace(/\^/g, '^')
            .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}');
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$|f(x)| = g(x)$$`}
                description={
                    <>
                        Phương trình chứa giá trị tuyệt đối có dạng |f(x)| = g(x).{' '}
                        <strong>Nghiệm</strong> được tìm bằng cách xét hai trường hợp:
                        <br />• f(x) = g(x) và f(x) ≥ 0
                        <br />• f(x) = -g(x) và f(x) ≤ 0
                    </>
                }
                example={String.raw`$|x - 2| = 3 \Rightarrow x - 2 = 3$ hoặc $x - 2 = -3 \Rightarrow x = 5$ hoặc $x = -1$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập phương trình
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$${convertToLatex(left)} = ${convertToLatex(right)}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <InputField
                            label="Vế trái (chứa giá trị tuyệt đối)"
                            value={left}
                            onChange={setLeft}
                            placeholder="Abs(x - 2)"
                            helpText="Sử dụng Abs() cho giá trị tuyệt đối. Ví dụ: Abs(x - 2), Abs(2*x + 1)"
                            type="text"
                        />

                        <InputField
                            label="Vế phải"
                            value={right}
                            onChange={setRight}
                            placeholder="3"
                            helpText="Nhập biểu thức vế phải. Ví dụ: 3, x + 1, 2*x - 5"
                            type="text"
                        />
                    </div>

                    <div className="text-gray-600 text-xs mt-2 p-3 bg-blue-50 rounded border">
                        <strong>💡 Hướng dẫn nhập:</strong>
                        <br />• Giá trị tuyệt đối: Abs(biểu thức)
                        <br />• Phép nhân: * (ví dụ: 2*x)
                        <br />• Phép lũy thừa: ^ (ví dụ: x^2)
                        <br />• Căn bậc hai: sqrt() (ví dụ: sqrt(x))
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
                    {/* Original Equation */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phương trình gốc:</strong><br />
                            <div className="mt-2">
                                {`$$${convertToLatex(left)} = ${convertToLatex(right)}$$`}
                            </div>
                        </div>
                    </div>

                    {/* Solutions */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Các nghiệm của phương trình:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>STT</th>
                                        <th className={commonClasses.tableHeader}>Nghiệm</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.solutions && result.solutions.map((solution, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-b border-gray-200" : "bg-white border-b border-gray-200"}>
                                            <td className={`${commonClasses.tableCell} font-medium`}>{index + 1}</td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    {`$x = ${solution}$`}
                                                </span>
                                            </td>
                                            <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                                {solution}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result.solutions && result.solutions.length > 0 && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Tập nghiệm:</strong>

                                {/* Equation Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$$${convertToLatex(left)} = ${convertToLatex(right)}$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Solutions Set */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {`$S = \\{${result.solutions.join(', ')}\\}$`}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Phương trình có <span className="font-bold text-blue-600">{result.solutions.length}</span> nghiệm:
                                        {result.solutions.map((sol, idx) => (
                                            <span key={idx}>
                                                {idx > 0 && ', '}
                                                <span className="font-bold text-blue-600"> x = {sol}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Solution Method */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Phương pháp giải:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        Bước 1: Xét điều kiện và chia trường hợp
                                    </div>
                                    <div className="tex2jax_process">
                                        Bước 2: Giải từng trường hợp riêng biệt
                                    </div>
                                    <div className="tex2jax_process">
                                        Bước 3: Kiểm tra nghiệm và kết luận
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$|f(x)| = g(x) \\Leftrightarrow f(x) = g(x)$ hoặc $f(x) = -g(x)$`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No solutions case */}
                    {result.solutions && result.solutions.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <div className="text-yellow-800">
                                <strong>⚠️ Phương trình vô nghiệm</strong>
                                <br />
                                <span className="text-sm">Không tồn tại giá trị x thỏa mãn phương trình đã cho.</span>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default AbsoluteValue;