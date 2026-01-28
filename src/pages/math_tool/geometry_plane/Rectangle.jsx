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

const Rectangle = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);
    const [length, setLength] = useState(8);
    const [width, setWidth] = useState(4);
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
        if (length <= 0 || width <= 0) return false;
        if (!Number.isFinite(length) || !Number.isFinite(width)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionRectangle({ length, width }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$S = a \times b \text{ và } P = 2 \times (a + b)$$`}
                description={
                    <>
                        Hình chữ nhật có hai công thức cơ bản:{' '}
                        <strong>Diện tích = chiều dài × chiều rộng</strong> và{' '}
                        <strong>Chu vi = 2 × (chiều dài + chiều rộng)</strong>
                    </>
                }
                example={`$S = 8 \\times 4 = 32$ và $P = 2 \\times (8 + 4) = 24$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\text{Diện tích: } S = a \times b$$`}
                        <br />
                        {String.raw`$$\text{Chu vi: } P = 2 \times (a + b)$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Chiều dài (a)"
                            value={length}
                            onChange={(value) => setLength(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương"
                            type="number"
                        />

                        <InputField
                            label="Chiều rộng (b)"
                            value={width}
                            onChange={(value) => setWidth(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương"
                            type="number"
                        />
                    </div>

                    {(length <= 0 || width <= 0) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Chiều dài và chiều rộng phải lớn hơn 0
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
                                {String.raw`$$S = ${length} \times ${width} = ${result?.value?.area}$$`}
                                <br />
                                {String.raw`$$P = 2 \times (${length} + ${width}) = ${result?.value?.perimeter}$$`}
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
                                                {String.raw`Tính diện tích: $S = a \times b$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$S = ${length} \times ${width} = ${result?.value?.area}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`Tính chu vi: $P = 2 \times (a + b)$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$P = 2 \times (${length} + ${width}) = ${result?.value?.perimeter}$`}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Results */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                            {/* Results Display */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* Area Result */}
                                <div className="p-3 bg-white rounded border">
                                    <div className="tex2jax_process text-xs sm:text-sm mb-2">
                                        <strong>Diện tích:</strong>
                                        <div className="mt-2">
                                            {String.raw`$S = a \times b$`}
                                        </div>
                                    </div>
                                    <div className={`${commonClasses.resultBox} mt-2`}>
                                        <div className="tex2jax_process text-lg sm:text-xl font-bold text-green-600">
                                            {String.raw`$${result?.value?.area}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Perimeter Result */}
                                <div className="p-3 bg-white rounded border">
                                    <div className="tex2jax_process text-xs sm:text-sm mb-2">
                                        <strong>Chu vi:</strong>
                                        <div className="mt-2">
                                            {String.raw`$P = 2(a + b)$`}
                                        </div>
                                    </div>
                                    <div className={`${commonClasses.resultBox} mt-2`}>
                                        <div className="tex2jax_process text-lg sm:text-xl font-bold text-blue-600">
                                            {String.raw`$${result?.value?.perimeter}$`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-4 p-3 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Hình chữ nhật có chiều dài {length} và chiều rộng {width}
                                    <br />
                                    • <span className="font-bold text-green-600">Diện tích: {result?.value?.area}</span> đơn vị diện tích
                                    <br />
                                    • <span className="font-bold text-blue-600">Chu vi: {result?.value?.perimeter}</span> đơn vị dài
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất hình chữ nhật:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`Đường chéo: $d = \sqrt{a^2 + b^2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Tỉ lệ: $\frac{a}{b} = \frac{${length}}{${width}} = ${(length / width).toFixed(2)}$`}
                                </div>
                                <div>
                                    4 góc vuông, đối diện song song
                                </div>
                                <div>
                                    2 đường chéo bằng nhau
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Rectangle;