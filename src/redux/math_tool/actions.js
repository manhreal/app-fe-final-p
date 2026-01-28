import { fetchApi } from "../../app/lib/api";
import { MathTypes } from './types';

// Common actions
export const actionSetLoading = (isLoading) => ({
    type: MathTypes.SET_LOADING,
    payload: isLoading
});

export const actionSetError = (error) => ({
    type: MathTypes.SET_ERROR,
    payload: error
});

export const actionSaveResult = (result) => ({
    type: MathTypes.SAVE_RESULT,
    payload: result
});

export const actionClearResult = () => ({
    type: MathTypes.CLEAR_RESULT
});

// Hàm gọi API chung
export const callMathApi = (endpoint, payload) => async (dispatch) => {
    try {
        dispatch(actionClearResult());
        dispatch(actionSetLoading(true));

        const response = await fetchApi(endpoint, 'post', payload);

        dispatch(actionSetLoading(false));

        if (response.code !== 200) {
            dispatch(actionSetError(response.message));
            return null;
        }

        dispatch(actionSaveResult(response.data));
        return response.data;
    } catch (error) {
        dispatch(actionSetLoading(false));
        dispatch(actionSetError(error?.message || 'Có lỗi xảy ra'));
        return null;
    }
};

// Danh sách endpoint cho toàn bộ module
const apiList = {
    // --- Tổ hợp - Xác suất ---
    factorial: '/python-combinatoric/factorial', // giai thừa
    permutation: '/python-combinatoric/permutation', // hoán vị
    arrangement: '/python-combinatoric/arrangement', // chỉnh hợp
    combination: '/python-combinatoric/combination', // tổ hợp
    binomialTheorem: '/python-combinatoric/binomial-theorem', // triển khai nhị thức NewTon
    probability: '/python-combinatoric/probability', // xác xuất đơn giản

    // --- Hàm số ---
    evaluate: '/python-calculus/evaluate', // giá trị hàm số tại x
    derivative: '/python-calculus/derivative', // đạo hàm cơ bản
    slope: '/python-calculus/slope', // hệ số góc tiếp tuyến tại x
    monotonic: '/python-calculus/monotonic', // chiều biến thiên của hàm số
    extrema: '/python-calculus/extrema', // cực trị của hàm số
    intersection: '/python-calculus/intersection', // giao điểm 2 đồ thị
    quadraticVertex: '/python-calculus/quadratic-vertex', // tọa độ đỉnh Parabol
    integralSimple: '/python-calculus/integral-simple', // tích phân cơ bản
    areaBetween: '/python-calculus/area-between', // diện tích miền giới hạn bởi đồ thị

    // --- Phương trình ---
    linear: '/python-equation/linear-one', // pt bậc nhất 1 ẩn
    quadraticEquation: '/python-equation/quadratic-equation', // pt bậc hai 1 ẩn
    quadratic: '/python-equation/quadratic',
    system2: '/python-equation/system-2', // hệ 2 pt bậc nhất 2 ẩn
    system3: '/python-equation/system-3', // hpt tuyến tính 3 ẩn
    inequalityLinear: '/python-equation/inequality-linear', // bpt bậc nhất 1 ẩn
    inequalityQuadratic: '/python-equation/inequality-quadratic', // bpt bậc hai 1 ẩn
    parametric: '/python-equation/parametric', // pt có tham số
    abs: '/python-equation/abs', // pt có giá trị tuyệt đối
    root: '/python-equation/root', // pt chứa căn thức 
    fraction: '/python-equation/fraction', // pt chứa phân thức

    // --- Hình học phẳng ---
    triangleArea: '/python-geometry-plane/triangle-area', // Tính diện tích tam giác
    triangleHeight: '/python-geometry-plane/triangle-height', // Tính đường cao tam giác
    triangleAngle: '/python-geometry-plane/triangle-angle', // Tính góc tam giác bằng định lý Cos
    circle: '/python-geometry-plane/circle', // Tính diện tích và chu vi hình tròn
    rectangle: '/python-geometry-plane/rectangle', // Tính diện tích và chu vi hình chữ nhật
    square: '/python-geometry-plane/square', // Tính diện tích và chu vi hình vuông
    parallelogram: '/python-geometry-plane/parallelogram', // Tính diện tích và chu vi hình bình hành
    trapezoid: '/python-geometry-plane/trapezoid', // Tính diện tích hình thang
    pointDistance: '/python-geometry-plane/point-distance', // Tính khoảng cách giữa 2 điểm
    pointMid: '/python-geometry-plane/point-mid', // Tính trung điểm của đoạn thẳng
    angleCosSin: '/python-geometry-plane/angle-cos-sin', // Tính góc bằng định lý Cos hoặc Sin

    // --- Số học ---
    gcd: '/python-number-theory/gcd', // ước chung lớn nhất
    lcm: '/python-number-theory/lcm', // bội chung nhỏ nhất
    isPrime: '/python-number-theory/is-prime', // Kiểm tra số nguyên tố
    isPerfectSquare: '/python-number-theory/is-perfect-square', // kiểm tra số chính phương
    isPerfect: '/python-number-theory/is-perfect', // số hoàn hảo
    divisors: '/python-number-theory/divisors', // liệt kê các ước của n
    primeFactors: '/python-number-theory/prime-factors', // phân tích thừa số nguyên tố
    commonDivisors: '/python-number-theory/common-divisors', // các ước chung của 2 số
    coPrime: '/python-number-theory/co-prime', // kiểm tra 2 số nguyên tố cùng nhau

    // --- Dãy số ---
    arithmeticTerm: '/python-sequence/arithmetic-term', // tính số hạng thứ n của  csc
    arithmeticSum: '/python-sequence/arithmetic-sum', // tính tổng n số đầu của csc
    geometricTerm: '/python-sequence/geometric-term', // tính số hạng thứ n của cấp số nhân
    geometricSum: '/python-sequence/geometric-sum', // tính tổng n số đầu của cấp số nhân
    checkArithmetic: '/python-sequence/check-arithmetic', // kiểm tra dãy có phải cấp số cộng
    checkGeometric: '/python-sequence/check-geometric', // Kiểm tra dãy có phải cấp số nhân
    recursiveTerm: '/python-sequence/recursive-term', // Tính số hạng thứ n theo quy luật đệ quy đơn giản
    findCommon: '/python-sequence/find-common', // Tự động phát hiện loại dãy (CSC/CSN) và trả về công sai/công bội

    // --- Hình học không gian ---
    volumePrism: '/python-solid-geometry/volume-prism', // Tính thể tích khối lăng trụ
    volumePyramid: '/python-solid-geometry/volume-pyramid', // Tính thể tích khối chóp
    volumeCylinder: '/python-solid-geometry/volume-cylinder', // Tính thể tích hình trụ
    volumeCone: '/python-solid-geometry/volume-cone', // Tính thể tích hình nón
    volumeSphere: '/python-solid-geometry/volume-sphere', // Tính thể tích hình cầu
    surfaceCylinder: '/python-solid-geometry/surface-cylinder', // Tính diện tích hình trụ
    surfaceCone: '/python-solid-geometry/surface-cone', // Tính diện tích hình nón
    surfaceSphere: '/python-solid-geometry/surface-sphere', // Tính diện tích hình cầu
    spaceDistance: '/python-solid-geometry/space-distance' // Tính khoảng cách giữa 2 điểm trong không gian
};

// Auto-generate actions
export const mathActions = Object.fromEntries(
    Object.entries(apiList).map(([name, url]) => [
        `action${name.charAt(0).toUpperCase() + name.slice(1)}`,
        (payload) => callMathApi(url, payload)
    ])
);
