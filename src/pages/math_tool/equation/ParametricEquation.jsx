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

const ParametricEquation = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [m, setM] = useState(2);
    const [b, setB] = useState(-6);
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
        if (isNaN(m) || isNaN(b)) return false;
        if (!isFinite(m) || !isFinite(b)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionParametric({ m, b }));
    };

    // Get equation type text
    const getEquationType = () => {
        if (!result?.type) return '';
        switch (result.type) {
            case 'unique_solution':
                return 'Phương trình có nghiệm duy nhất';
            case 'infinite_solutions':
                return 'Phương trình có vô số nghiệm';
            case 'no_solution':
                return 'Phương trình vô nghiệm';
            default:
                return '';
        }
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$mx + b = 0$$`}
                description={
                    <>
                        Phương trình bậc nhất có tham số dạng mx + b = 0, trong đó{' '}
                        <strong>m, b</strong> là các tham số
                    </>
                }
                example="$2x - 6 = 0 \Rightarrow x = 3$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$${m}x + (${b}) = 0$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Hệ số m"
                            value={m}
                            onChange={(value) => setM(Number(value))}
                            step="0.1"
                            helpText="Hệ số của x"
                        />

                        <InputField
                            label="Hằng số b"
                            value={b}
                            onChange={(value) => setB(Number(value))}
                            step="0.1"
                            helpText="Số hạng tự do"
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
                    {/* Equation Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Phương trình:</strong><br />
                            <div className="mt-2">
                                {`$$${m}x + (${b}) = 0$$`}
                            </div>
                        </div>
                    </div>

                    {/* Step by step calculation */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết giải:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Bước</th>
                                        <th className={commonClasses.tableHeader}>Phép biến đổi</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                Phương trình ban đầu
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$${m}x + (${b}) = 0$`}
                                            </span>
                                        </td>
                                    </tr>
                                    {m !== 0 && (
                                        <>
                                            <tr className="bg-white border-b border-gray-200">
                                                <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                                <td className={commonClasses.tableCell}>
                                                    Chuyển vế hằng số
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                        {`$${m}x = ${-b}$`}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                                <td className={commonClasses.tableCell}>
                                                    Chia hai vế cho hệ số của x
                                                </td>
                                                <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {`$x = \\frac{${-b}}{${m}}$`}
                                                    </span>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    <tr className="bg-green-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            <strong>Kết luận</strong>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            {getEquationType()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {result?.solution && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Nghiệm của phương trình:</strong>

                                {/* Equation Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$${m}x + (${b}) = 0$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Solution Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        {result.type === 'unique_solution' && `$x = ${result.solution}$`}
                                        {result.type === 'infinite_solutions' && '$x \\in \\mathbb{R}$'}
                                        {result.type === 'no_solution' && 'Vô nghiệm'}
                                    </div>
                                </div>

                                {/* Solution Type */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Loại nghiệm:</strong>
                                        <span className="font-bold text-blue-600 ml-1">
                                            {getEquationType()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Phân tích phương trình:
                                </h5>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                    {m !== 0 && (
                                        <div className="tex2jax_process">
                                            Với $m = {m} \\neq 0$: Phương trình có nghiệm duy nhất
                                        </div>
                                    )}
                                    {m === 0 && b === 0 && (
                                        <div className="tex2jax_process">
                                            Với $m = 0, b = 0$: Phương trình có vô số nghiệm
                                        </div>
                                    )}
                                    {m === 0 && b !== 0 && (
                                        <div className="tex2jax_process">
                                            Với $m = 0, b \\neq 0$: Phương trình vô nghiệm
                                        </div>
                                    )}
                                    <div className="tex2jax_process">
                                        Dạng tổng quát: $mx + b = 0$
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Special cases when no solution */}
                    {result && !result.solution && (
                        <div className={`${commonClasses.successBox} bg-yellow-50 border-yellow-200`}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">⚠️ Trường hợp đặc biệt:</strong>

                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {`$${m}x + (${b}) = 0$`}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 p-2 bg-yellow-100 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Kết luận:</strong>
                                        <span className="font-bold text-yellow-600 ml-1">
                                            {getEquationType()}
                                        </span>
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

export default ParametricEquation;