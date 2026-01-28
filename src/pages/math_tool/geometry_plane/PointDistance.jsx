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

const PointDistance = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [x1, setX1] = useState(1);
    const [y1, setY1] = useState(2);
    const [x2, setX2] = useState(4);
    const [y2, setY2] = useState(6);
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
        if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionPointDistance({ x1, y1, x2, y2 }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$`}
                description={
                    <>
                        Khoảng cách giữa hai điểm A(x₁, y₁) và B(x₂, y₂) được tính bằng{' '}
                        <strong>công thức khoảng cách Euclid trong mặt phẳng tọa độ</strong>
                    </>
                }
                example={`$d = \\sqrt{(4 - 1)^2 + (6 - 2)^2} = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Point A */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">📍</span>
                            Điểm A (x₁, y₁):
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <InputField
                                label="Hoành độ x₁"
                                value={x1}
                                onChange={(value) => setX1(Number(value))}
                                step="0.1"
                                helpText="Tọa độ x của điểm A"
                            />

                            <InputField
                                label="Tung độ y₁"
                                value={y1}
                                onChange={(value) => setY1(Number(value))}
                                step="0.1"
                                helpText="Tọa độ y của điểm A"
                            />
                        </div>
                    </div>

                    {/* Point B */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <span className="mr-2">📍</span>
                            Điểm B (x₂, y₂):
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <InputField
                                label="Hoành độ x₂"
                                value={x2}
                                onChange={(value) => setX2(Number(value))}
                                step="0.1"
                                helpText="Tọa độ x của điểm B"
                            />

                            <InputField
                                label="Tung độ y₂"
                                value={y2}
                                onChange={(value) => setY2(Number(value))}
                                step="0.1"
                                helpText="Tọa độ y của điểm B"
                            />
                        </div>
                    </div>

                    {/* Current points display */}
                    <div className="mt-4 p-3 bg-gray-50 rounded border text-center">
                        <div className="tex2jax_process text-sm text-gray-700">
                            <strong>Điểm hiện tại:</strong>
                            {` A(${x1}, ${y1})`} và {` B(${x2}, ${y2})`}
                        </div>
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
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$`}
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
                                                {`Áp dụng công thức: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$`}
                                            </span>
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm">
                                                {String.raw`$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Thay tọa độ các điểm vào
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính hiệu các tọa độ
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$d = \\sqrt{${x2 - x1}^2 + ${y2 - y1}^2}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính bình phương
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$d = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tổng trong căn
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <span className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`$d = \\sqrt{${(x2 - x1) ** 2 + (y2 - y1) ** 2}}$`}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>6</td>
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
                                            {`$d_{AB} = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2}$`}
                                        </div>
                                    </div>
                                </div>

                                {/* Result Value */}
                                <div className={commonClasses.resultBox}>
                                    <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                        ${result?.value}$ đơn vị độ dài
                                    </div>
                                </div>

                                {/* Meaning */}
                                <div className="mt-3 p-2 bg-blue-50 rounded border">
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        <strong>Ý nghĩa:</strong> Khoảng cách từ điểm A({x1}, {y1}) đến điểm B({x2}, {y2})
                                        là <span className="font-bold text-blue-600">{result?.value}</span> đơn vị độ dài
                                    </div>
                                </div>
                            </div>

                            {/* Additional Properties */}
                            <div className="mt-4 text-center">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    💡 Tính chất khoảng cách:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="tex2jax_process">
                                        {`$d(A,B) = d(B,A)$ (tính đối xứng)`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$d(A,B) \\geq 0$ (không âm)`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$d(A,B) = 0 \\Leftrightarrow A \\equiv B$`}
                                    </div>
                                    <div className="tex2jax_process">
                                        {`$d(A,C) \\leq d(A,B) + d(B,C)$ (bất đẳng thức tam giác)`}
                                    </div>
                                </div>
                            </div>

                            {/* Point coordinates summary */}
                            <div className="mt-4 p-3 bg-yellow-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700 text-center">
                                    <strong>📍 Tóm tắt:</strong>
                                    <div className="mt-1">
                                        Điểm A({x1}, {y1}) ↔ Điểm B({x2}, {y2})
                                    </div>
                                    <div className="tex2jax_process mt-1">
                                        {`Khoảng cách: $d = ${result?.value}$`}
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

export default PointDistance;