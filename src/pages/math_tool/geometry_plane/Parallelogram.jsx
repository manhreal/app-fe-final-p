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

const Parallelogram = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [base, setBase] = useState(10);
    const [height, setHeight] = useState(6);
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
        if (base <= 0 || height <= 0) return false;
        if (!Number.isFinite(base) || !Number.isFinite(height)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionParallelogram({ base, height }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$S = a \times h$$`}
                description={
                    <>
                        Hình bình hành là tứ giác có các cặp cạnh đối song song và bằng nhau.{' '}
                        <strong>Diện tích</strong> hình bình hành bằng tích của đáy và chiều cao.
                    </>
                }
                example="Với $a = 10$, $h = 6$: $S = 10 \\times 6 = 60$"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$S = a \times h$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Độ dài đáy (a)"
                            value={base}
                            onChange={(value) => setBase(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương (đơn vị độ dài)"
                        />

                        <InputField
                            label="Chiều cao (h)"
                            value={height}
                            onChange={(value) => setHeight(Math.max(0, Number(value)))}
                            min="0"
                            step="0.1"
                            helpText="Số dương (đơn vị độ dài)"
                        />
                    </div>

                    {(base <= 0 || height <= 0) && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            ⚠️ Lưu ý: Độ dài đáy và chiều cao phải lớn hơn 0
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
                                {String.raw`$$S = a \times h = ${base} \times ${height}$$`}
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
                                                {String.raw`Áp dụng công thức: $S = a \times h$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$S = a \times h$`}
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
                                                {String.raw`$S = ${base} \times ${height}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            {result.value}
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
                                        {String.raw`Với đáy $a = ${base}$ và chiều cao $h = ${height}$:`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className="text-xs sm:text-sm text-gray-600 mb-1">Diện tích</div>
                                <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                    {String.raw`$S = ${result.value}$`}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">đơn vị diện tích</div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Hình bình hành có đáy <span className="font-bold text-blue-600">{base}</span> đơn vị
                                    và chiều cao <span className="font-bold text-blue-600">{height}</span> đơn vị
                                    có diện tích <span className="font-bold text-blue-600">{result.value}</span> đơn vị vuông
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất của hình bình hành:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {String.raw`Các cạnh đối song song và bằng nhau`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Các góc đối bằng nhau`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Hai đường chéo cắt nhau tại trung điểm`}
                                </div>
                                <div className="tex2jax_process">
                                    {String.raw`Diện tích = đáy × chiều cao`}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default Parallelogram;