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

const GeometricSum = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [a1, setA1] = useState(2);
    const [r, setR] = useState(2);
    const [n, setN] = useState(4);
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
        if (!Number.isFinite(a1) || !Number.isFinite(r) || !Number.isFinite(n)) return false;
        if (n <= 0 || !Number.isInteger(n)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionGeometricSum({ a1, r, n }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$S_n = a_1 \cdot \frac{r^n - 1}{r - 1} \quad (r \neq 1)$$`}
                description={
                    <>
                        Tổng n số hạng đầu của cấp số nhân với số hạng đầu a₁ và công bội r.<br />
                        <strong>Trường hợp đặc biệt:</strong> Nếu r = 1 thì S_n = n × a₁
                    </>
                }
                example="$S_4 = 2 \cdot \frac{2^4 - 1}{2 - 1} = 2 \cdot \frac{16 - 1}{1} = 30$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$S_n = a_1 \cdot \frac{r^n - 1}{r - 1}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <InputField
                            label="Số hạng đầu (a₁)"
                            value={a1}
                            onChange={(value) => setA1(Number(value))}
                            type="number"
                            step="any"
                            helpText="Số thực bất kỳ"
                        />

                        <InputField
                            label="Công bội (r)"
                            value={r}
                            onChange={(value) => setR(Number(value))}
                            type="number"
                            step="any"
                            helpText="Số thực bất kỳ"
                        />

                        <InputField
                            label="Số số hạng (n)"
                            value={n}
                            onChange={(value) => setN(Math.max(1, Math.floor(Number(value))))}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {r === 1 && (
                        <div className="text-blue-600 text-sm mt-2 text-center">
                            ℹ️ Lưu ý: Khi r = 1, công thức trở thành S_n = n × a₁
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
                                {r === 1 ? (
                                    String.raw`$$S_n = n \times a_1 = ${n} \times ${a1} = ${result?.value}$$`
                                ) : (
                                    String.raw`$$S_n = a_1 \cdot \frac{r^n - 1}{r - 1} = ${a1} \cdot \frac{${r}^${n} - 1}{${r} - 1}$$`
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
                                                {r === 1
                                                    ? "Áp dụng công thức khi r = 1: $S_n = n \\times a_1$"
                                                    : "Áp dụng công thức: $S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}$"
                                                }
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {r === 1
                                                    ? `$S_{${n}} = ${n} \\times ${a1}$`
                                                    : `$S_{${n}} = ${a1} \\cdot \\frac{${r}^${n} - 1}{${r} - 1}$`
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    {r !== 1 && (
                                        <>
                                            <tr className="bg-white border-b border-gray-200">
                                                <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                                <td className={commonClasses.tableCell}>
                                                    Tính r^n
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {`$${r}^${n} = ${Math.pow(r, n)}$`}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                                <td className={commonClasses.tableCell}>
                                                    Tính tử số
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {`$r^n - 1 = ${Math.pow(r, n)} - 1 = ${Math.pow(r, n) - 1}$`}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-200">
                                                <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                                <td className={commonClasses.tableCell}>
                                                    Tính mẫu số
                                                </td>
                                                <td className={commonClasses.tableCell}>
                                                    <span className="tex2jax_process text-xs sm:text-sm">
                                                        {`$r - 1 = ${r} - 1 = ${r - 1}$`}
                                                    </span>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>{r === 1 ? '2' : '5'}</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.value}
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
                                            {`$S_{${n}} = ${result.value}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result.value}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Tổng của {n} số hạng đầu tiên trong cấp số nhân
                                        với a₁ = {a1} và r = {r} là <span className="font-bold text-blue-600">{result.value}</span>
                                    </div>
                                </div>

                                {/* Geometric Sequence Display */}
                                <div className="mt-3 p-2 bg-green-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Dãy số:</strong>
                                        <div className="mt-1 tex2jax_process">
                                            {Array.from({ length: Math.min(n, 6) }, (_, i) => {
                                                const term = a1 * Math.pow(r, i);
                                                return i === 0 ? `${term}` : ` + ${term}`;
                                            }).join('')}
                                            {n > 6 ? ' + ...' : ''}
                                            {` = ${result.value}`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của cấp số nhân:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`$a_k = a_1 \\cdot r^{k-1}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {r === 1 ? `$S_n = n \\cdot a_1$` : `$S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Công bội: r = ${r}`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {Math.abs(r) < 1 && n > 10 ?
                                            `Khi |r| < 1: S_{\\infty} = \\frac{a_1}{1-r}` :
                                            `Số hạng thứ ${n}: a_{${n}} = ${a1 * Math.pow(r, n - 1)}`
                                        }
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

export default GeometricSum;