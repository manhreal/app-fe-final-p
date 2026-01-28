import {
    Eye,
    Pencil,
    Plus,
    Minus,
    Check,
    Trash2,
} from "lucide-react";

export default function ActionEditDelete(props) {
    const {
        onclickEdit,
        onclickDelete,
        onclickView,
        tooltipText = "",
        hideEdit,
        hideDelete,
        hideView,
        onclickProcessingOrder,
        onclickCancelOrder,
        onclickConfirmOrder,
        showProcessingOrder,
        showCancelOrder,
        showConfirmOrder
    } = props;

    const buttonClass = "flex items-center justify-center w-8 h-8 p-0 rounded hover:scale-105 transition-transform";
    const iconSize = 18;

    return (
        <div className="flex items-center gap-2">
            {/* View */}
            {!hideView && (
                <button
                    onClick={onclickView}
                    className={`${buttonClass} bg-gray-100 hover:bg-blue-100 text-blue-600`}
                    title={`Xem chi tiết ${tooltipText}`}
                >
                    <img src="/icon/view.png" alt="view" className="h-5 w-auto" />
                </button>
            )}

            {/* Edit */}
            {!hideEdit && (
                <button
                    onClick={onclickEdit}
                    className={`${buttonClass} bg-gray-100 hover:bg-blue-100 text-blue-600`}
                    title={`Sửa ${tooltipText}`}
                >
                    <img src="/icon/edit.png" alt="edit" className="h-5 w-auto" />
                </button>
            )}

            {/* Xử lý đơn */}
            {showProcessingOrder && (
                <button
                    onClick={onclickProcessingOrder}
                    className={`${buttonClass} bg-gray-100 hover:bg-blue-100 text-blue-600`}
                    title={`Xử lý đơn ${tooltipText}`}
                >
                    <Plus size={iconSize} />
                </button>
            )}

            {/* Xác nhận đơn */}
            {showConfirmOrder && (
                <button
                    onClick={onclickConfirmOrder}
                    className={`${buttonClass} bg-gray-100 hover:bg-green-100 text-green-600`}
                    title={`Xác nhận đơn ${tooltipText}`}
                >
                    <Check size={iconSize} />
                </button>
            )}

            {/* Hủy đơn */}
            {showCancelOrder && (
                <button
                    onClick={onclickCancelOrder}
                    className={`${buttonClass} bg-gray-100 hover:bg-yellow-100 text-yellow-600`}
                    title={`Hủy đơn ${tooltipText}`}
                >
                    <Minus size={iconSize} />
                </button>
            )}

            {/* Xóa */}
            {!hideDelete && (
                <button
                    onClick={onclickDelete}
                    className={`${buttonClass} bg-gray-100 hover:bg-red-100 text-red-600`}
                    title={`Xóa ${tooltipText}`}
                >
                    <img src="/icon/delete.png" alt="delete" className="h-5 w-auto" />
                </button>
            )}
        </div>
    );
}
