import React, { useState, useEffect, useCallback } from 'react';
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

const SimpleProbability = () => {
    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(state => state.math_tool);

    const [favorable, setFavorable] = useState(3);
    const [total, setTotal] = useState(8);
    const [mathJaxReady, setMathJaxReady] = useState(false);

    // Initialize MathJax
    const initMathJax = useCallback(() => {
        initializeMathJax(setMathJaxReady);
    }, []);

    useEffect(() => {
        initMathJax();
    }, [initMathJax]);

    // Re-render MathJax when content changes
    const reRenderMathJax = useCallback(() => {
        renderMathJax(mathJaxReady);
    }, [mathJaxReady]);

    useEffect(() => {
        const timeout = setTimeout(reRenderMathJax, 100);
        return () => clearTimeout(timeout);
    }, [result, reRenderMathJax]);

    // Input validation
    const validateInputs = () => {
        if (favorable < 0 || total <= 0) return false;
        if (favorable > total) return false;
        if (!Number.isInteger(favorable) || !Number.isInteger(total)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            return;
        }
        dispatch(mathActions.actionProbability({ favorable, total }));
    };

    const handleFavorableChange = (value) => {
        const num = Math.max(0, Math.floor(Number(value)));
        setFavorable(num);
    };

    const handleTotalChange = (value) => {
        const num = Math.max(1, Math.floor(Number(value)));
        setTotal(num);
    };

    return (
        <div className={commonClasses.container}>
            {/* Theory Section */}
            <TheorySection
                title="Kiến thức cơ bản"
                icon="📚"
                formula={String.raw`$$P(A) = \frac{\text{Số kết quả thuận lợi}}{\text{Tổng số kết quả có thể}}$$`}
                description={
                    <>
                        Xác suất của một sự kiện A là tỷ lệ giữa số kết quả thuận lợi và tổng số kết quả có thể xảy ra.{' '}
                        <span className="tex2jax_process">
                            {String.raw`$0 \leq P(A) \leq 1$`}
                        </span>
                    </>
                }
                example="Xác suất tung được mặt ngửa khi tung đồng xu: P = 1/2 = 0.5 = 50%"
            />

            {/* Input Section */}
            <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
                <h3 className={commonClasses.sectionTitle}>
                    <span className="mr-2 text-lg">🔢</span>
                    Nhập dữ liệu
                </h3>

                <div className={`${commonClasses.mathDisplay} mb-6`}>
                    <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                        {String.raw`$$P = \frac{\text{Số thuận lợi}}{\text{Tổng số}}$$`}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <InputField
                            label="Số kết quả thuận lợi"
                            value={favorable}
                            onChange={handleFavorableChange}
                            min="0"
                            step="1"
                            helpText="Số nguyên không âm"
                        />

                        <InputField
                            label="Tổng số kết quả có thể"
                            value={total}
                            onChange={handleTotalChange}
                            min="1"
                            step="1"
                            helpText="Số nguyên dương"
                        />
                    </div>

                    {/* Validation Messages */}
                    {!validateInputs() && (
                        <div className="text-center text-red-600 text-xs sm:text-sm">
                            {favorable > total && "⚠️ Số thuận lợi không được lớn hơn tổng số"}
                            {(favorable < 0 || total <= 0) && "⚠️ Vui lòng nhập số hợp lệ"}
                            {(!Number.isInteger(favorable) || !Number.isInteger(total)) && "⚠️ Vui lòng nhập số nguyên"}
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
                    {/* Input Display */}
                    <div className={`${commonClasses.mathDisplay} mb-6`}>
                        <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                            <strong>Dữ liệu đầu vào:</strong><br />
                            <div className="mt-2">
                                Số kết quả thuận lợi: {result.favorable}<br />
                                Tổng số kết quả có thể: {result.total}
                            </div>
                        </div>
                    </div>

                    {/* Calculation Steps */}
                    <div className="mb-6">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="mr-2">🔍</span>
                            Các bước tính toán:
                        </h4>

                        <div className="space-y-4">
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
                                <div className="text-xs sm:text-sm lg:text-base">
                                    <strong>Bước 1:</strong> Áp dụng công thức xác suất cơ bản
                                </div>
                                <div className="tex2jax_process mt-2 text-sm sm:text-base">
                                    {String.raw`$$P = \frac{\text{Số thuận lợi}}{\text{Tổng số}} = \frac{${result.favorable}}{${result.total}}$$`}
                                </div>
                            </div>

                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border">
                                <div className="text-xs sm:text-sm lg:text-base">
                                    <strong>Bước 2:</strong> Tính toán kết quả
                                </div>
                                <div className="tex2jax_process mt-2 text-sm sm:text-base">
                                    {String.raw`$$P = \frac{${result.favorable}}{${result.total}} = ${result.probability}$$`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className={commonClasses.successBox}>
                        <div className="text-center">
                            <strong className="text-xs sm:text-sm lg:text-base text-gray-800">🎯 Kết quả cuối cùng:</strong>

                            {/* Probability as Decimal */}
                            <div className="mt-3 p-3 bg-white rounded border">
                                <div className="text-xs sm:text-sm font-semibold text-blue-600">
                                    <strong>Xác suất thập phân:</strong> {result.probability}
                                </div>
                            </div>

                            {/* Probability as Fraction */}
                            <div className="mt-3 p-3 bg-white rounded border">
                                <div className="tex2jax_process text-xs sm:text-base font-semibold text-blue-600">
                                    <strong>Xác suất phân số:</strong> {String.raw`$\frac{${result.favorable}}{${result.total}}$`} = {result.fraction}
                                </div>
                            </div>

                            {/* Probability as Percentage */}
                            <div className="mt-3 p-3 bg-white rounded border">
                                <div className="text-xs sm:text-sm font-semibold text-blue-600">
                                    <strong>Xác suất phần trăm:</strong> {result.percentage}
                                </div>
                            </div>

                            {/* Visual Representation */}
                            <div className="mt-4">
                                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                    📊 Minh họa trực quan:
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 relative overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${result.probability * 100}%` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-white mix-blend-difference">
                                        {result.percentage}
                                    </div>
                                </div>
                            </div>

                            {/* Interpretation */}
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="text-xs sm:text-sm text-gray-700">
                                    <strong>💡 Giải thích:</strong><br />
                                    {result.probability === 0 && "Sự kiện này không thể xảy ra (xác suất bằng 0)."}
                                    {result.probability === 1 && "Sự kiện này chắc chắn xảy ra (xác suất bằng 1)."}
                                    {result.probability > 0 && result.probability < 0.5 && "Sự kiện này ít có khả năng xảy ra."}
                                    {result.probability === 0.5 && "Sự kiện này có khả năng xảy ra và không xảy ra như nhau."}
                                    {result.probability > 0.5 && result.probability < 1 && "Sự kiện này có khả năng cao xảy ra."}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResultSection>
            )}
        </div>
    );
};

export default SimpleProbability;