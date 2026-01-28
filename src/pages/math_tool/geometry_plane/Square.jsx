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

const Square = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [side, setSide] = useState(5);
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
        if (side <= 0) return false;
        if (!Number.isFinite(side)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSquare({ side }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$\text{Diện tích: } S = a^2 \quad \text{Chu vi: } P = 4a$$`}
                description={
                    <>
                        Hình vuông là tứ giác đều có 4 cạnh bằng nhau và 4 góc vuông.{' '}
                        <strong>Diện tích</strong> bằng bình phương cạnh, <strong>chu vi</strong> bằng 4 lần độ dài cạnh.
                    </>
                }
                example="Với $a = 5$: $S = 5^2 = 25$, $P = 4 \times 5 = 20$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$\\text{Cho hình vuông có cạnh } a$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <InputField
                            label="Độ dài cạnh (a)"
                            value={side}
                            onChange={(value) => setSide(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương (đơn vị: đơn vị độ dài)"
                        />
                    </div>

                    {side <= 0 && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Độ dài cạnh phải lớn hơn 0
                        </div>
                    )}

                    <SubmitButton
                        loading={loading}
                        disabled={!validateInputs()}
                    />
                </form>
            </div>

            <ErrorMessage error={error} />

            {result && result.value && (
                <ResultSection title="Kết quả chi tiết" icon="📈">
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$S = a^2 = ${side}^2$$`}
                            </div>
                            <div className="mt-2">
                                {String.raw`$$P = 4a = 4 \times ${side}$$`}
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
                                        <th className={commonClasses.tableHeader}>Công thức</th>
                                        <th className={commonClasses.tableHeader}>Kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>1</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính diện tích
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$S = a^2$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result.value.area}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính chu vi
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$P = 4a$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            {result.value.perimeter}
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay số vào công thức diện tích
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {String.raw`$S = ${side}^2 = ${result.value.area}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result.value.area}
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay số vào công thức chu vi
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {String.raw`$P = 4 \times ${side} = ${result.value.perimeter}$`}
                                            </span>
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-green-600`}>
                                            {result.value.perimeter}
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

                            {/* Formula Display */}
                            <div className="mt-3 p-2 bg-white rounded border overflow-x-auto">
                                <div className="tex2jax_process text-xs sm:text-sm">
                                    <div className="mt-2">
                                        {String.raw`Với cạnh $a = ${side}$:`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Values */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* Area Result */}
                                <div className={commonClasses.resultBox}>
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Diện tích</div>
                                    <div className="tex2jax_process text-lg sm:text-xl font-bold text-blue-600">
                                        {String.raw`$S = ${result.value.area}$`}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">đơn vị diện tích</div>
                                </div>

                                {/* Perimeter Result */}
                                <div className={commonClasses.resultBox}>
                                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Chu vi</div>
                                    <div className="tex2jax_process text-lg sm:text-xl font-bold text-green-600">
                                        {String.raw`$P = ${result.value.perimeter}$`}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">đơn vị độ dài</div>
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Hình vuông có cạnh <span className="font-bold text-blue-600">{side}</span> đơn vị
                                    có diện tích <span className="font-bold text-blue-600">{result.value.area}</span> đơn vị vuông
                                    và chu vi <span className="font-bold text-green-600">{result.value.perimeter}</span> đơn vị độ dài
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất của hình vuông:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`Đường chéo: $d = a\sqrt{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Bán kính đường tròn ngoại tiếp: $R = \frac{a\sqrt{2}}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Bán kính đường tròn nội tiếp: $r = \frac{a}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Tỉ lệ chu vi/diện tích: $\frac{P}{S} = \frac{4}{a}$`}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Square;