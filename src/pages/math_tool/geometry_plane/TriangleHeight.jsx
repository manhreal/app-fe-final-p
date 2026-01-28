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

const TriangleHeight = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [base, setBase] = useState(10);
    const [area, setArea] = useState(25);
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
        if (base <= 0 || area <= 0) return false;
        if (!Number.isFinite(base) || !Number.isFinite(area)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionTriangleHeight({ base, area }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$h = \frac{2S}{a}$$`}
                description={
                    <>
                        Đường cao tam giác được tính bằng công thức dựa trên{' '}
                        <strong>diện tích</strong> và <strong>độ dài cạnh đáy</strong>
                    </>
                }
                example="Với $S = 25$ và $a = 10$ thì $h = \frac{2 \times 25}{10} = 5$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$h = \frac{2S}{a}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Độ dài cạnh đáy (a)"
                            type="number"
                            value={base}
                            onChange={(value) => setBase(Number(value))}
                            min="0.01"
                            step="0.01"
                            helpText="Số dương (đơn vị: cm, m, ...)"
                        />

                        <InputField
                            label="Diện tích tam giác (S)"
                            type="number"
                            value={area}
                            onChange={(value) => setArea(Number(value))}
                            min="0.01"
                            step="0.01"
                            helpText="Số dương (đơn vị: cm², m², ...)"
                        />
                    </div>

                    {(!validateInputs() && (base !== '' && area !== '')) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Cả cạnh đáy và diện tích phải là số dương
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
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$h = \frac{2S}{a} = \frac{2 \times ${area}}{${base}}$$`}
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
                                                {String.raw`Áp dụng công thức: $h = \frac{2S}{a}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$h = \frac{2S}{a}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay số vào công thức
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {String.raw`$h = \frac{2 \times ${area}}{${base}}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính toán
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$h = \frac{${2 * area}}{${base}}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
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
                                            {String.raw`$h = \frac{2S}{a} = \frac{2 \times ${area}}{${base}}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result?.value}$
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Đường cao tam giác có độ dài là <span className="font-bold text-blue-600">{result?.value}</span> (cùng đơn vị với cạnh đáy)
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Kiến thức liên quan:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`$S = \frac{1}{2} \times a \times h$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$h = \frac{2S}{a}$`}
                                    </div>
                                    <div className="text-left">
                                        Đường cao vuông góc với cạnh đáy
                                    </div>
                                    <div className="text-left">
                                        Mỗi tam giác có 3 đường cao
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

export default TriangleHeight;