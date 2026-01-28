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

const PointMid = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [x1, setX1] = useState(2);
    const [y1, setY1] = useState(3);
    const [x2, setX2] = useState(4);
    const [y2, setY2] = useState(7);
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
        if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return false;
        if (x1 === '' || y1 === '' || x2 === '' || y2 === '') return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionPointMid({ x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2) }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$M\left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)$$`}
                description={
                    <>
                        Trung điểm của đoạn thẳng nối hai điểm A(x₁, y₁) và B(x₂, y₂) có tọa độ được tính theo công thức trên
                    </>
                }
                example={`$A(2, 3), B(4, 7) \\Rightarrow M\\left(\\frac{2+4}{2}, \\frac{3+7}{2}\\right) = M(3, 5)$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {`$$M\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700 text-center">
                                📍 Điểm A (x₁, y₁)
                            </h4>
                            <InputField
                                label="Hoành độ x₁"
                                value={x1}
                                onChange={(value) => setX1(value)}
                                type="number"
                                step="any"
                                helpText="Số thực"
                            />
                            <InputField
                                label="Tung độ y₁"
                                value={y1}
                                onChange={(value) => setY1(value)}
                                type="number"
                                step="any"
                                helpText="Số thực"
                            />
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700 text-center">
                                📍 Điểm B (x₂, y₂)
                            </h4>
                            <InputField
                                label="Hoành độ x₂"
                                value={x2}
                                onChange={(value) => setX2(value)}
                                type="number"
                                step="any"
                                helpText="Số thực"
                            />
                            <InputField
                                label="Tung độ y₂"
                                value={y2}
                                onChange={(value) => setY2(value)}
                                type="number"
                                step="any"
                                helpText="Số thực"
                            />
                        </div>
                    </div>

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
                                {`$$M\\left(\\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2}\\right)$$`}
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
                                                {`Áp dụng công thức: $M\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {`$A(${x1}, ${y1}), B(${x2}, ${y2})$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính hoành độ trung điểm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$x_M = \\frac{${x1} + ${x2}}{2} = \\frac{${Number(x1) + Number(x2)}}{2} = ${result.value.x}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tung độ trung điểm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$y_M = \\frac{${y1} + ${y2}}{2} = \\frac{${Number(y1) + Number(y2)}}{2} = ${result.value.y}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Kết quả cuối cùng
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            M({result.value.x}, {result.value.y})
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
                                        {`$M\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                    {`$M(${result.value.x}, ${result.value.y})$`}
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Trung điểm M của đoạn thẳng AB có tọa độ là{' '}
                                    <span className="font-bold text-blue-600">({result.value.x}, {result.value.y})</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất của trung điểm:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="tex2jax_process">
                                    {`$|AM| = |MB| = \\frac{|AB|}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {`$\\overrightarrow{AM} = \\overrightarrow{MB}$`}
                                </div>
                                <div className="tex2jax_process">
                                    {`$\\overrightarrow{OM} = \\frac{\\overrightarrow{OA} + \\overrightarrow{OB}}{2}$`}
                                </div>
                                <div className="tex2jax_process">
                                    M là điểm chia đoạn AB theo tỉ số 1:1
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default PointMid;