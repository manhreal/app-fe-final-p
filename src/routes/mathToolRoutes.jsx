// --- Phương trình và HPT ---
import LinearEquation from '../pages/math_tool/equation/LinearEquation';
import QuadraticEquation from '../pages/math_tool/equation/QuadraticEquation';
import SystemTwoEquations from '../pages/math_tool/equation/SystemTwoEquations';
import System3Equations from '../pages/math_tool/equation/System3Equations';
import LinearInequality from '../pages/math_tool/equation/LinearInequality';
import InequalityQuadratic from '../pages/math_tool/equation/InequalityQuadratic';
import ParametricEquation from '../pages/math_tool/equation/ParametricEquation';
import AbsoluteValue from '../pages/math_tool/equation/AbsoluteValue';
import RootEquation from '../pages/math_tool/equation/RootEquation';
import FractionEquation from '../pages/math_tool/equation/FractionEquation';

// --- Tổ hợp và Xác suất ---
import Factorial from '../pages/math_tool/combinatoric/Factorial';
import Permutation from '../pages/math_tool/combinatoric/Permutation';
import Arrangement from '../pages/math_tool/combinatoric/Arrangement';
import Combination from '../pages/math_tool/combinatoric/Combination';
import BinomialTheorem from '../pages/math_tool/combinatoric/BinomialTheorem';
import SimpleProbability from '../pages/math_tool/combinatoric/SimpleProbability';

// --- Hàm số ---
import FunctionEvaluation from '../pages/math_tool/calculus/FunctionEvaluation';
import Derivative from '../pages/math_tool/calculus/Derivative';
import Slope from '../pages/math_tool/calculus/Slope';
import Monotonic from '../pages/math_tool/calculus/Monotonic';
import Extrema from '../pages/math_tool/calculus/Extrema';
import Intersection from '../pages/math_tool/calculus/Intersection';
import QuadraticVertex from '../pages/math_tool/calculus/QuadraticVertex';
import IntegralSimple from '../pages/math_tool/calculus/IntegralSimple';
import AreaBetween from '../pages/math_tool/calculus/AreaBetween';

// --- Số học ---
import GCD from '../pages/math_tool/number_theory/GCD';
import LCM from '../pages/math_tool/number_theory/LCM';
import PrimeCheck from '../pages/math_tool/number_theory/PrimeCheck';
import PerfectSquareCheck from '../pages/math_tool/number_theory/PerfectSquareCheck';
import PerfectNumber from '../pages/math_tool/number_theory/PerfectNumber';
import Divisors from '../pages/math_tool/number_theory/Divisors';
import PrimeFactors from '../pages/math_tool/number_theory/PrimeFactors';
import CommonDivisors from '../pages/math_tool/number_theory/CommonDivisors';
import CoPrime from '../pages/math_tool/number_theory/CoPrime';

// --- Dãy số ---
import ArithmeticTerm from '../pages/math_tool/sequence/ArithmeticTerm';
import ArithmeticSum from '../pages/math_tool/sequence/ArithmeticSum';
import GeometricTerm from '../pages/math_tool/sequence/GeometricTerm';
import GeometricSum from '../pages/math_tool/sequence/GeometricSum';
import CheckArithmetic from '../pages/math_tool/sequence/CheckArithmetic';
import CheckGeometric from '../pages/math_tool/sequence/CheckGeometric';
import RecursiveTerm from '../pages/math_tool/sequence/RecursiveTerm';
import FindCommon from '../pages/math_tool/sequence/FindCommon';

// --- Hình học phẳng ---
import TriangleArea from '../pages/math_tool/geometry_plane/TriangleArea';
import TriangleHeight from '../pages/math_tool/geometry_plane/TriangleHeight';
import TriangleAngle from '../pages/math_tool/geometry_plane/TriangleAngle';
import Circle from '../pages/math_tool/geometry_plane/Circle';
import Rectangle from '../pages/math_tool/geometry_plane/Rectangle';
import Square from '../pages/math_tool/geometry_plane/Square';
import Parallelogram from '../pages/math_tool/geometry_plane/Parallelogram';
import Trapezoid from '../pages/math_tool/geometry_plane/Trapezoid';
import PointDistance from '../pages/math_tool/geometry_plane/PointDistance';
import PointMid from '../pages/math_tool/geometry_plane/PointMid';
import AngleCosSin from '../pages/math_tool/geometry_plane/AngleCosSin';

// --- Hình học không gian ---
import VolumePrism from '../pages/math_tool/geometry_solid/VolumePrism';
import VolumePyramid from '../pages/math_tool/geometry_solid/VolumePyramid';
import VolumeCylinder from '../pages/math_tool/geometry_solid/VolumeCylinder';
import VolumeCone from '../pages/math_tool/geometry_solid/VolumeCone';
import VolumeSphere from '../pages/math_tool/geometry_solid/VolumeSphere';
import SurfaceCylinder from '../pages/math_tool/geometry_solid/SurfaceCylinder';
import SurfaceCone from '../pages/math_tool/geometry_solid/SurfaceCone';
import SurfaceSphere from '../pages/math_tool/geometry_solid/SurfaceSphere';
import SpaceDistance from '../pages/math_tool/geometry_solid/SpaceDistance';

export const mathToolRoutes = [
    { path: '', element: null, name: 'Hướng dẫn sử dụng' },

    // --- Phương trình và HPT ---
    { path: 'equation/linear-one', element: <LinearEquation />, name: 'Phương trình bậc nhất' },
    { path: 'equation/quadratic-equation', element: <QuadraticEquation />, name: 'Phương trình bậc hai' },
    { path: 'equation/system-2', element: <SystemTwoEquations />, name: 'Hệ phương trình 2 ẩn' },
    { path: 'equation/system-3', element: <System3Equations />, name: 'Hệ phương trình 3 ẩn' },
    { path: 'equation/linear-inequality', element: <LinearInequality/>, name: 'Bất phương trình bậc nhất' },
    { path: 'equation/inequality-quadratic', element: <InequalityQuadratic />, name: 'Bất phương trình bậc hai' },
    { path: 'equation/parametric', element: <ParametricEquation />, name: 'Phương trình có tham số' },
    { path: 'equation/abs', element: <AbsoluteValue />, name: 'Phương trình giá trị tuyệt đối' },
    { path: 'equation/root', element: <RootEquation />, name: 'Phương trình căn thức' },
    { path: 'equation/fraction', element: <FractionEquation />, name: 'Phương trình phân thức' },

    // --- Tổ hợp và xác suất ---
    { path: 'combinatoric/factorial', element: <Factorial />, name: 'Tính giai thừa' },
    { path: 'combinatoric/permutation', element: <Permutation />, name: 'Hoán vị' },
    { path: 'combinatoric/arrangement', element: <Arrangement />, name: 'Chỉnh hợp' },
    { path: 'combinatoric/combination', element: <Combination />, name: 'Tổ hợp' },
    { path: 'combinatoric/binomial-theorem', element: <BinomialTheorem />, name: 'Khai triển nhị thức Newton' },
    { path: 'combinatoric/probability', element: <SimpleProbability />, name: 'Tính xác suất' },

    // --- Hàm số ---
    { path: 'calculus/evaluate', element: <FunctionEvaluation />, name: 'Giá trị hàm số tại x' },
    { path: 'calculus/derivative', element: <Derivative />, name: 'Đạo hàm cơ bản' },
    { path: 'calculus/slope', element: <Slope />, name: 'Hệ số góc tiếp tuyến' },
    { path: 'calculus/monotonic', element: <Monotonic />, name: 'Xét chiều biến thiên' },
    { path: 'calculus/extrema', element: <Extrema />, name: 'Tìm cực trị' },
    { path: 'calculus/intersection', element: <Intersection />, name: 'Tìm giao điểm đồ thị' },
    { path: 'calculus/quadratic-vertex', element: <QuadraticVertex />, name: 'Tọa độ đỉnh Parabol' },
    { path: 'calculus/integral-simple', element: <IntegralSimple />, name: 'Tích phân cơ bản' },
    { path: 'calculus/area-between', element: <AreaBetween />, name: 'Diện tích miền giới hạn' },

    // --- Số học ---
    { path: 'number-theory/gcd', element: <GCD />, name: 'Ước chung lớn nhất' },
    { path: 'number-theory/lcm', element: <LCM />, name: 'Bội chung nhỏ nhất' },
    { path: 'number-theory/is-prime', element: <PrimeCheck />, name: 'Kiểm tra số nguyên tố' },
    { path: 'number-theory/is-perfect-square', element: <PerfectSquareCheck />, name: 'Kiểm tra số chính phương' },
    { path: 'number-theory/is-perfect', element: <PerfectNumber  />, name: 'Kiểm tra số hoàn hảo' },
    { path: 'number-theory/divisors', element: <Divisors />, name: 'Liệt kê ước số' },
    { path: 'number-theory/prime-factors', element: <PrimeFactors />, name: 'Phân tích thừa số nguyên tố' },
    { path: 'number-theory/common-divisors', element: <CommonDivisors />, name: 'Các ước chung' },
    { path: 'number-theory/co-prime', element: <CoPrime />, name: 'Nguyên tố cùng nhau' },

    // --- Dãy số ---
    { path: 'sequence/arithmetic-term', element: <ArithmeticTerm />, name: 'Số hạng CSC' },
    { path: 'sequence/arithmetic-sum', element: <ArithmeticSum />, name: 'Tổng CSC' },
    { path: 'sequence/geometric-term', element: <GeometricTerm />, name: 'Số hạng CSN' },
    { path: 'sequence/geometric-sum', element: <GeometricSum />, name: 'Tổng CSN' },
    { path: 'sequence/check-arithmetic', element: <CheckArithmetic />, name: 'Kiểm tra CSC' },
    { path: 'sequence/check-geometric', element: <CheckGeometric />, name: 'Kiểm tra CSN' },
    { path: 'sequence/recursive-term', element: <RecursiveTerm />, name: 'Số hạng đệ quy' },
    { path: 'sequence/find-common', element: <FindCommon />, name: 'Công sai / Công bội' },

    // --- Hình học phẳng ---
    { path: 'geometry-plane/triangle-area', element: <TriangleArea />, name: 'Diện tích tam giác' },
    { path: 'geometry-plane/triangle-height', element: <TriangleHeight />, name: 'Đường cao tam giác' },
    { path: 'geometry-plane/triangle-angle', element: <TriangleAngle />, name: 'Góc trong tam giác' },
    { path: 'geometry-plane/circle', element: <Circle />, name: 'Hình tròn' },
    { path: 'geometry-plane/rectangle', element: <Rectangle />, name: 'Hình chữ nhật' },
    { path: 'geometry-plane/square', element: <Square />, name: 'Hình vuông' },
    { path: 'geometry-plane/parallelogram', element: <Parallelogram />, name: 'Hình bình hành' },
    { path: 'geometry-plane/trapezoid', element: <Trapezoid />, name: 'Hình thang' },
    { path: 'geometry-plane/point-distance', element: <PointDistance />, name: 'Khoảng cách 2 điểm' },
    { path: 'geometry-plane/point-mid', element: <PointMid />, name: 'Trung điểm đoạn thẳng' },
    { path: 'geometry-plane/angle-cos-sin', element: <AngleCosSin />, name: 'Tính góc bằng Cos/Sin' },

    // --- Hình học không gian ---
    { path: 'solid-geometry/volume-prism', element: <VolumePrism />, name: 'Thể tích lăng trụ' },
    { path: 'solid-geometry/volume-pyramid', element: <VolumePyramid />, name: 'Thể tích chóp' },
    { path: 'solid-geometry/volume-cylinder', element: <VolumeCylinder />, name: 'Thể tích hình trụ' },
    { path: 'solid-geometry/volume-cone', element: <VolumeCone />, name: 'Thể tích hình nón' },
    { path: 'solid-geometry/volume-sphere', element: <VolumeSphere />, name: 'Thể tích hình cầu' },
    { path: 'solid-geometry/surface-cylinder', element: <SurfaceCylinder />, name: 'Diện tích hình trụ' },
    { path: 'solid-geometry/surface-cone', element: <SurfaceCone />, name: 'Diện tích hình nón' },
    { path: 'solid-geometry/surface-sphere', element: <SurfaceSphere />, name: 'Diện tích hình cầu' },
    { path: 'solid-geometry/space-distance', element: <SpaceDistance />, name: 'Khoảng cách 3D' },
];
