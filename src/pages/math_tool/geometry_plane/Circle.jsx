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

const Circle = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);
    const [r, setR] = useState(7);
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
        if (r <= 0) return false;
        if (!Number.isFinite(r)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionCircle({ r }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\begin{align}
                    S &= \pi r^2 \\
                    P &= 2\pi r
                \end{align}$$`}
                description={
                    <>
                        Diện tích hình tròn bằng π nhân bình phương bán kính.{' '}
                        Chu vi (Perimeter) hình tròn bằng 2π nhân bán kính.
                    </>
                }
                example={`$S = \\pi \\times 7^2 = 49\\pi \\approx 153.94$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$\begin{cases}
                            S = \pi r^2 \\
                            P = 2\pi r
                        \end{cases}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-md mx-auto">
                        <InputField
                            label="Bán kính (r)"
                            value={r}
                            onChange={(value) => setR(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương (r > 0)"
                        />
                    </div>

                    {r <= 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Bán kính phải lớn hơn 0
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
                                {String.raw`$$\begin{align}
                                    S &= \pi r^2 = \pi \times ${r}^2 \\
                                    P &= 2\pi r = 2\pi \times ${r}
                                \end{align}$$`}
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
                                                {String.raw`Tính diện tích: $S = \pi r^2$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$S = \pi \times ${r}^2 = ${r * r}\pi$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`Tính chu vi: $P = 2\pi r$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {String.raw`$P = 2\pi \times ${r} = ${2 * r}\pi$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả số thập phân
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            <div className="text-xs sm:text-sm">
                                                S ≈ {result?.value?.area?.toFixed(2)}<br />
                                                P ≈ {result?.value?.perimeter?.toFixed(2)}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Result */}
                    {(result?.area && result?.perimeter) && (
                        <div className={commonClasses.successBox}>
                            <div className="text-center">
                                <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                                {/* Formula Display */}
                                <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                    <div className="tex2jax_process text-xs sm:text-sm">
                                        <div className="mt-2">
                                            {String.raw`$$\begin{cases}
                                                S = \pi r^2 \\
                                                P = 2\pi r
                                            \end{cases}$$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Values */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className={commonClasses.resultBox}>
                                        <div className="text-sm text-gray-600 mb-1">Diện tích (Area)</div>
                                        <div className="tex2jax_process text-lg sm:text-xl font-bold text-blue-600">
                                            {String.raw`$S = ${result.area.toFixed(2)}$`}
                                        </div>
                                    </div>
                                    <div className={commonClasses.resultBox}>
                                        <div className="text-sm text-gray-600 mb-1">Chu vi (Perimeter)</div>
                                        <div className="tex2jax_process text-lg sm:text-xl font-bold text-green-600">
                                            {String.raw`$P = ${result.perimeter.toFixed(2)}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Hình tròn có bán kính <span className="font-bold text-blue-600">{r}</span> có
                                        diện tích là <span className="font-bold text-blue-600">{result.area.toFixed(2)}</span> đơn vị vuông
                                        và chu vi là <span className="font-bold text-green-600">{result.perimeter.toFixed(2)}</span> đơn vị độ dài
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất của hình tròn:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {String.raw`Đường kính: $d = 2r = ${2 * r}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$\pi \approx 3.14159...$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`Tỉ số: $\frac{P}{d} = \pi$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {String.raw`$S = \frac{P \times r}{2}$`}
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

export default Circle;