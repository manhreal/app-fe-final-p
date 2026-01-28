import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const CustomPagination = ({
    page = 1,
    total = 0,
    limit = 10,
    onChange,
    showQuickJumper = true,
    showTotal = true,
}) => {
    const [jumpValue, setJumpValue] = useState('');

    const totalPages = Math.ceil(total / limit);
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            if (onChange) {
                onChange(newPage);
            }
        }
    };

    const handleJumpToPage = () => {
        const targetPage = parseInt(jumpValue);
        if (targetPage >= 1 && targetPage <= totalPages) {
            handlePageChange(targetPage);
            setJumpValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJumpToPage();
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        // Calculate start and end of the range
        let start = Math.max(1, page - delta);
        let end = Math.min(totalPages, page + delta);

        // Adjust range if we're near the beginning or end
        if (page <= delta + 1) {
            end = Math.min(totalPages, 2 * delta + 2);
        }
        if (page >= totalPages - delta) {
            start = Math.max(1, totalPages - 2 * delta - 1);
        }

        // Create the range
        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Add dots and first/last pages if needed
        if (start > 1) {
            rangeWithDots.push(1);
            if (start > 2) {
                rangeWithDots.push('...');
            }
        }

        rangeWithDots.push(...range);

        if (end < totalPages) {
            if (end < totalPages - 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (total === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                Không có dữ liệu
            </div>
        );
    }

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Total info */}
            {showTotal && (
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                    Hiển thị {startItem}-{endItem} của {total} kết quả
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4 order-1 sm:order-2">
                {/* Pagination controls */}
                <div className="flex items-center gap-1">
                    {/* First page */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Trang đầu"
                    >
                        <ChevronsLeft size={16} />
                    </button>

                    {/* Previous page */}
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Trang trước"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Page numbers */}
                    {pageNumbers.map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`min-w-[36px] h-9 px-3 py-1 rounded border text-sm transition-colors ${pageNum === page
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}

                    {/* Next page */}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Trang sau"
                    >
                        <ChevronRight size={16} />
                    </button>

                    {/* Last page */}
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page === totalPages}
                        className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                        title="Trang cuối"
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>

                {/* Quick jumper */}
                {showQuickJumper && totalPages > 1 && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Đi tới:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={jumpValue}
                            onChange={(e) => setJumpValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="..."
                        />
                        <button
                            onClick={handleJumpToPage}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                            Đi
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomPagination;