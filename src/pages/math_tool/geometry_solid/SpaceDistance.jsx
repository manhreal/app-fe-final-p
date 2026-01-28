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

const SpaceDistance = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [x1, setX1] = useState(1);
    const [y1, setY1] = useState(2);
    const [z1, setZ1] = useState(3);
    const [x2, setX2] = useState(4);
    const [y2, setY2] = useState(6);
    const [z2, setZ2] = useState(9);
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
        const inputs = [x1, y1, z1, x2, y2, z2];
        return inputs.every(input => {
            const num = Number(input);
            return !isNaN(num) && isFinite(num);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionSpaceDistance({
            x1: Number(x1),
            y1: Number(y1),
            z1: Number(z1),
            x2: Number(x2),
            y2: Number(y2),
            z2: Number(z2)
        }));
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📐"
                formula={String.raw`$$d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`}
                description={
                    <>
                        Khoảng cách giữa hai điểm A(x₁,y₁,z₁) và B(x₂,y₂,z₂) trong không gian 3D được tính theo{' '}
                        <strong>công thức khoảng cách Euclidean</strong>
                    </>
                }
                example={String.raw`$d = \sqrt{(4-1)^2 + (6-2)^2 + (9-3)^2} = \sqrt{9 + 16 + 36} = \sqrt{61} ≈ 7.81$`}
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">📍</span>
                    Nhập tọa độ điểm
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$d_{AB} = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Point A */}
                    <div className="bg-blue-50 p-4 rounded-lg border">
                        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                            <span className="mr-2">🔵</span>
                            Điểm A
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField
                                label="Tọa độ x₁"
                                value={x1}
                                onChange={(value) => setX1(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ x của điểm A"
                            />
                            <InputField
                                label="Tọa độ y₁"
                                value={y1}
                                onChange={(value) => setY1(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ y của điểm A"
                            />
                            <InputField
                                label="Tọa độ z₁"
                                value={z1}
                                onChange={(value) => setZ1(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ z của điểm A"
                            />
                        </div>
                    </div>

                    {/* Point B */}
                    <div className="bg-green-50 p-4 rounded-lg border">
                        <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                            <span className="mr-2">🟢</span>
                            Điểm B
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <InputField
                                label="Tọa độ x₂"
                                value={x2}
                                onChange={(value) => setX2(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ x của điểm B"
                            />
                            <InputField
                                label="Tọa độ y₂"
                                value={y2}
                                onChange={(value) => setY2(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ y của điểm B"
                            />
                            <InputField
                                label="Tọa độ z₂"
                                value={z2}
                                onChange={(value) => setZ2(value)}
                                type="number"
                                step="any"
                                helpText="Tọa độ z của điểm B"
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
                <ResultSection title="Kết quả chi tiết" icon="📊">
                    {/* Formula Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg break-words">
                            <strong>Công thức áp dụng:</strong><br />
                            <div className="mt-2">
                                {String.raw`$$d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`}
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
                            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 sm:min-w-[500px]">
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
                                            Xác định tọa độ hai điểm
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="tex2jax_process text-xs sm:text-sm">
                                                {`A(${x1}, ${y1}, ${z1}), B(${x2}, ${y2}, ${z2})`}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>2</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính hiệu tọa độ
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`Δx = ${x2} - (${x1}) = ${x2 - x1}`}<br />
                                                {`Δy = ${y2} - (${y1}) = ${y2 - y1}`}<br />
                                                {`Δz = ${z2} - (${z1}) = ${z2 - z1}`}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>3</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính bình phương các hiệu
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`(Δx)² = (${x2 - x1})² = ${Math.pow(x2 - x1, 2)}`}<br />
                                                {`(Δy)² = (${y2 - y1})² = ${Math.pow(y2 - y1, 2)}`}<br />
                                                {`(Δz)² = (${z2 - z1})² = ${Math.pow(z2 - z1, 2)}`}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>4</td>
                                        <td className={commonClasses.tableCell}>
                                            Tính tổng các bình phương
                                        </td>
                                        <td className={commonClasses.tableCell}>
                                            <div className="tex2jax_process text-xs sm:text-sm break-all">
                                                {`${Math.pow(x2 - x1, 2)} + ${Math.pow(y2 - y1, 2)} + ${Math.pow(z2 - z1, 2)} = ${Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)}`}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <td className={`${commonClasses.tableCell} font-medium`}>5</td>
                                        <td className={commonClasses.tableCell}>
                                            Lấy căn bậc hai
                                        </td>
                                        <td className={`${commonClasses.tableCell} font-bold text-blue-600`}>
                                            <div className="tex2jax_process">
                                                {String.raw`$$\sqrt{${Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)}} = ${result.value}$$`}
                                            </div>
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
                                        {String.raw`$$d_{AB} = \sqrt{(${x2}-${x1})^2 + (${y2}-${y1})^2 + (${z2}-${z1})^2}$$`}
                                    </div>
                                </div>
                            </div>

                            {/* Result Value */}
                            <div className={commonClasses.resultBox}>
                                <div className="tex2jax_process text-lg sm:text-2xl font-bold text-blue-600">
                                    {result.value}
                                </div>
                            </div>

                            {/* Meaning */}
                            <div className="mt-3 p-2 bg-blue-50 rounded border">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>Ý nghĩa:</strong> Khoảng cách giữa điểm A({x1}, {y1}, {z1}) và điểm B({x2}, {y2}, {z2})
                                    trong không gian 3D là <span className="font-bold text-blue-600">{result.value}</span> đơn vị
                                </div>
                            </div>
                        </div>

                        {/* Additional Properties */}
                        <div className="mt-4 text-center">
                            <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                💡 Tính chất khoảng cách:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                    d(A,B) = d(B,A) (tính đối xứng)
                                </div>
                                <div>
                                    d(A,A) = 0 (khoảng cách từ điểm đến chính nó)
                                </div>
                                <div>
                                    d(A,B) ≥ 0 (luôn không âm)
                                </div>
                                <div>
                                    d(A,C) ≤ d(A,B) + d(B,C) (bất đẳng thức tam giác)
                                </div>
                            </div>
                        </div>

                        {/* Coordinate Display */}
                        <div className="mt-4 bg-gray-50 p-3 rounded border">
                            <div className="text-xs sm:text-sm text-gray-700 text-center">
                                <strong>Vector AB:</strong> ({x2 - x1}, {y2 - y1}, {z2 - z1})<br />
                                <strong>Độ dài vector:</strong> |AB| = {result.value}
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default SpaceDistance;