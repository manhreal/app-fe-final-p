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

const SurfaceCylinder = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [radius, setRadius] = useState(2.5);
    const [height, setHeight] = useState(10);
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
        if (radius <= 0 || height <= 0) return false;
        if (isNaN(radius) || isNaN(height)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSurfaceCylinder({ radius, height }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$S = 2\pi r^2 + 2\pi rh = 2\pi r(r + h)$$`}
                description={
                    <>
                        Diện tích bề mặt hình trụ bao gồm{' '}
                        <strong>2 đáy hình tròn</strong> và <strong>mặt xung quanh</strong>:
                        <br />• Diện tích 2 đáy: 2πr²
                        <br />• Diện tích mặt xung quanh: 2πrh
                    </>
                }
                example={`$S = 2\\pi \\times 2.5^2 + 2\\pi \\times 2.5 \\times 10 = 2\\pi(6.25 + 25) \\approx 196.3$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$S = 2\pi r^2 + 2\pi rh$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Bán kính đáy (r)"
                            value={radius}
                            onChange={(value) => setRadius(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số thực dương (r > 0)"
                            type="number"
                        />

                        <InputField
                            label="Chiều cao (h)"
                            value={height}
                            onChange={(value) => setHeight(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số thực dương (h > 0)"
                            type="number"
                        />
                    </div>

                    {(radius <= 0 || height <= 0) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Bán kính và chiều cao phải lớn hơn 0
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
                                {String.raw`$$S = 2\pi r^2 + 2\pi rh = 2\pi r(r + h)$$`}
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
                                                {`Áp dụng công thức: $S = 2\\pi r^2 + 2\\pi rh$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$S = 2\\pi r^2 + 2\\pi rh$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay r = {radius}, h = {height} vào công thức
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$S = 2\\pi \\times ${radius}^2 + 2\\pi \\times ${radius} \\times ${height}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính diện tích 2 đáy
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$2\\pi r^2 = 2\\pi \\times ${Math.pow(radius, 2)} = ${(2 * Math.PI * Math.pow(radius, 2)).toFixed(2)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính diện tích mặt xung quanh
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$2\\pi rh = 2\\pi \\times ${radius} \\times ${height} = ${(2 * Math.PI * radius * height).toFixed(2)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Tổng diện tích bề mặt
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$S = ${(2 * Math.PI * Math.pow(radius, 2)).toFixed(2)} + ${(2 * Math.PI * radius * height).toFixed(2)}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>6</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result?.value?.toFixed(2)} đơn vị diện tích
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
                                            {`$S = 2\\pi \\times ${radius}^2 + 2\\pi \\times ${radius} \\times ${height}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result.value.toFixed(4)}$
                                    </div>
                                </div>

                                {/* Unit */}
                                <div className="mt-2 text-xs sm:text-sm text-gray-600">
                                    đơn vị diện tích (đơn vị²)
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Hình trụ có bán kính <span className="font-bold text-blue-600">{radius}</span> và
                                        chiều cao <span className="font-bold text-blue-600">{height}</span> có diện tích bề mặt là{' '}
                                        <span className="font-bold text-blue-600">{result.value.toFixed(2)}</span> đơn vị diện tích
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Thông tin thêm về hình trụ:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`Diện tích 2 đáy: $2\\pi r^2 = ${(2 * Math.PI * Math.pow(radius, 2)).toFixed(2)}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Diện tích xung quanh: $2\\pi rh = ${(2 * Math.PI * radius * height).toFixed(2)}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Thể tích: $V = \\pi r^2 h = ${(Math.PI * Math.pow(radius, 2) * height).toFixed(2)}$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`Đường kính đáy: $d = 2r = ${2 * radius}$`}
                                    </div>
                                    <div className="text-center sm:col-span-2">
                                        Chu vi đáy: 2πr = {(2 * Math.PI * radius).toFixed(2)}
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

export default SurfaceCylinder;