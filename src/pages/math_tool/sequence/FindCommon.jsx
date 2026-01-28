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

const FindCommon = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [sequenceInput, setSequenceInput] = useState("5, 10, 20, 40");
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

    // Parse sequence input to array
    const parseSequence = (input) => {
        try {
            const numbers = input.split(',').map(s => {
                const num = parseFloat(s.trim());
                if (isNaN(num)) throw new Error('Invalid number');
                return num;
            });
            return numbers;
        } catch {
            return null;
        }
    };

    // Input validation
    const validateInputs = () => {
        const sequence = parseSequence(sequenceInput);
        if (!sequence || sequence.length < 2) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        const sequence = parseSequence(sequenceInput);
        dispatch(mathActions.actionFindCommon({ sequence }));
    };

    // Get sequence for display
    const getSequenceArray = () => {
        return parseSequence(sequenceInput) || [];
    };

    // Format sequence for LaTeX
    const formatSequenceForLatex = (seq) => {
        return seq.join(', ');
    };

    // Get type display name
    const getTypeDisplayName = (type) => {
        switch (type) {
            case 'arithmetic':
                return 'Cấp số cộng (CSC)';
            case 'geometric':
                return 'Cấp số nhân (CSN)';
            default:
                return 'Không xác định';
        }
    };

    // Get formula based on type
    const getFormulaByType = (type) => {
        if (type === 'arithmetic') {
            return 'a_n = a_1 + (n-1) \\cdot d';
        } else if (type === 'geometric') {
            return 'a_n = a_1 \\cdot r^{n-1}';
        }
        return '';
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\text{CSC: } a_n = a_1 + (n-1)d \quad \text{CSN: } a_n = a_1 \cdot r^{n-1}$$`}
                description={
                    <>
                        Phát hiện tự động loại dãy số và tìm{' '}
                        <strong>công sai (d)</strong> của Cấp số cộng hoặc{' '}
                        <strong>công bội (r)</strong> của Cấp số nhân
                    </>
                }
                example="Ví dụ: [5, 10, 20, 40] → CSN với công bội r = 2"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\text{Dãy số: } [a_1, a_2, a_3, \\ldots]$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Dãy số cần phân tích
                        </label>
                        <input
                            type="text"
                            value={sequenceInput}
                            onChange={(e) => setSequenceInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ví dụ: 5, 10, 20, 40 hoặc 2, 5, 8, 11"
                            required
                        />
                        <div className="text-xs text-gray-500">
                            Nhập các số cách nhau bởi dấu phẩy. Cần ít nhất 2 số để phân tích.
                        </div>
                    </div>

                    {/* Preview sequence */}
                    {getSequenceArray().length > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded border">
                            <div className="text-xs sm:text-sm text-gray-700">
                                <strong>Dãy số đã nhập:</strong> [{formatSequenceForLatex(getSequenceArray())}]
                                <span className="ml-2 text-gray-500">({getSequenceArray().length} phần tử)</span>
                            </div>
                        </div>
                    )}

                    {!validateInputs() && sequenceInput && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Vui lòng nhập ít nhất 2 số hợp lệ, cách nhau bởi dấu phẩy
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
                <ResultSection title="Kết quả phân tích" icon="📈">
                    {/* Type Detection Result */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Loại dãy số:</strong><br />
                            <div className="mt-2">
                                <span className="text-blue-600 font-bold">
                                    {getTypeDisplayName(result.type)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Details */}
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Chi tiết phân tích:
                    </h4>

                    <div className="overflow-x-auto mb-6 -mx-3 sm:mx-0 max-w-full">
                        <div className="px-3 sm:px-0">
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[400px]">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className={commonClasses.tableHeader}>Thông tin</th>
                                        <th className={commonClasses.tableHeader}>Giá trị</th>
                                        <th className={commonClasses.tableHeader}>Mô tả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Dãy số gốc</td>
                                        <td className={commonClasses.tableCell}>
                                            [{formatSequenceForLatex(getSequenceArray())}]
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            Dãy số được nhập vào
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>Loại dãy</td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {getTypeDisplayName(result.type)}
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả phát hiện tự động
                                        </td>
                                    </tr>
                                    {result.type === 'arithmetic' && result.commonDifference !== undefined && (
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <td className={`${commonClasses.tableCell} font-medium`}>Công sai (d)</td>
                                            <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                                {result.commonDifference}
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    Hiệu số giữa 2 số hạng liền kề
                                                </span>
                                            </td>
                                        </tr>
                                    )}
                                    {result.type === 'geometric' && result.commonRatio !== undefined && (
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <td className={`${commonClasses.tableCell} font-medium`}>Công bội (r)</td>
                                            <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                                {result.commonRatio}
                                            </td>
                                            <td className={commonClasses.tableCell}>
                                                <span className="tex2jax_process text-xs sm:text-sm">
                                                    Tỉ số giữa 2 số hạng liền kề
                                                </span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {(result.type === 'arithmetic' || result.type === 'geometric') && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Type Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2 font-bold text-blue-600">
                                            {getTypeDisplayName(result.type)}
                                        </div>
                                    </div>
                                </div>

                                {/* Formula and Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-xl font-bold text-blue-600">
                                        {result.type === 'arithmetic' && (
                                            <>
                                                {`$${getFormulaByType(result.type)}$`}
                                                <br />
                                                <span className="text-green-600">
                                                    {`$d = ${result.commonDifference}$`}
                                                </span>
                                            </>
                                        )}
                                        {result.type === 'geometric' && (
                                            <>
                                                {`$${getFormulaByType(result.type)}$`}
                                                <br />
                                                <span className="text-green-600">
                                                    {`$r = ${result.commonRatio}$`}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong>
                                        {result.type === 'arithmetic' && (
                                            <> Dãy số là <span className="font-bold text-blue-600">Cấp số cộng</span> với công sai <span className="font-bold text-green-600">d = {result.commonDifference}</span></>
                                        )}
                                        {result.type === 'geometric' && (
                                            <> Dãy số là <span className="font-bold text-blue-600">Cấp số nhân</span> với công bội <span className="font-bold text-green-600">r = {result.commonRatio}</span></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của {getTypeDisplayName(result.type)}:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    {result.type === 'arithmetic' && (
                                        <>
                                            <div className="tex2jax_process">
                                                {`$a_{n+1} - a_n = d$ (không đổi)`}
                                            </div>
                                            <div className="tex2jax_process">
                                                {`$a_n = a_1 + (n-1)d$`}
                                            </div>
                                            <div className="tex2jax_process">
                                                {`$S_n = \\frac{n}{2}[2a_1 + (n-1)d]$`}
                                            </div>
                                            <div>
                                                Tăng/giảm đều theo một hằng số
                                            </div>
                                        </>
                                    )}
                                    {result.type === 'geometric' && (
                                        <>
                                            <div className="tex2jax_process">
                                                {`$\\frac{a_{n+1}}{a_n} = r$ (không đổi)`}
                                            </div>
                                            <div className="tex2jax_process">
                                                {`$a_n = a_1 \\cdot r^{n-1}$`}
                                            </div>
                                            <div className="tex2jax_process">
                                                {`$S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}$ (r ≠ 1)`}
                                            </div>
                                            <div>
                                                Tăng/giảm theo tỉ lệ hằng số
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* If not arithmetic or geometric */}
                    {result.type !== 'arithmetic' && result.type !== 'geometric' && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-center text-yellow-800">
                                <span className="text-lg">⚠️</span>
                                <div className="mt-2 text-sm">
                                    <strong>Dãy số không phải là Cấp số cộng hoặc Cấp số nhân</strong>
                                    <br />
                                    Có thể là dãy số phức tạp hơn hoặc không tuân theo quy luật đơn giản.
                                </div>
                            </div>
                        </div>
                    )}
                </ResultSection>
            )}
        </div>
    );
};

export default FindCommon;