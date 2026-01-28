import { mockData } from "./mockData";

import React, { useEffect, useRef, useState, useMemo } from "react";

// Simple candlestick chart implementation using Canvas
const CandlestickChart = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
    const [hoveredData, setHoveredData] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

    const timeframes = ["1m", "5m", "15m", "1h", "4h", "D"];

    // Convert mockData to chart format
    const chartData = useMemo(() => {
        return mockData.map((item, index) => {
            const open = parseFloat(item.open);
            const high = parseFloat(item.high);
            const low = parseFloat(item.low);
            const close = parseFloat(item.close);
            const volume = parseFloat(item.volume) / 1_000_000_000_000;
            const timestamp = parseInt(item.createDate);

            return {
                index,
                time: Math.floor(timestamp / 1000),
                open,
                high,
                low,
                close,
                volume,
                fullTime: new Date(timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }),
            };
        });
    }, [selectedTimeframe]);

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Draw chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !chartData.length) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, width, height);

        // Chart margins
        const margin = { top: 40, right: 60, bottom: 80, left: 60 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Calculate price range
        const prices = chartData.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.1;

        // Scale functions
        const xScale = (index) => margin.left + (index * chartWidth) / (chartData.length - 1);
        const yScale = (price) => margin.top + ((maxPrice + padding - price) * chartHeight) / (priceRange + 2 * padding);

        // Draw grid
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (i * chartHeight) / 5;
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(width - margin.right, y);
            ctx.stroke();
        }

        // Vertical grid lines
        for (let i = 0; i < chartData.length; i++) {
            const x = xScale(i);
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, height - margin.bottom);
            ctx.stroke();
        }

        // Draw candlesticks
        const candleWidth = Math.max(2, chartWidth / (chartData.length * 2));

        chartData.forEach((candle, index) => {
            const x = xScale(index);
            const openY = yScale(candle.open);
            const closeY = yScale(candle.close);
            const highY = yScale(candle.high);
            const lowY = yScale(candle.low);

            const isGreen = candle.close >= candle.open;
            const color = isGreen ? '#00D4AA' : '#FF6B7D';

            // Draw wick
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, highY);
            ctx.lineTo(x, lowY);
            ctx.stroke();

            // Draw body
            ctx.fillStyle = color;
            const bodyHeight = Math.abs(closeY - openY);
            const bodyY = Math.min(openY, closeY);

            if (bodyHeight < 2) {
                // Draw line for doji
                ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, 2);
            } else {
                ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
            }
        });

        // Draw price labels
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';

        for (let i = 0; i <= 5; i++) {
            const price = maxPrice + padding - (i * (priceRange + 2 * padding)) / 5;
            const y = margin.top + (i * chartHeight) / 5;
            ctx.fillText(price.toFixed(7), width - margin.right + 5, y + 4);
        }

        // Draw time labels
        ctx.textAlign = 'center';
        chartData.forEach((candle, index) => {
            if (index % Math.ceil(chartData.length / 4) === 0) {
                const x = xScale(index);
                const time = new Date(candle.time * 1000).toLocaleDateString();
                ctx.fillText(time, x, height - margin.bottom + 20);
            }
        });

    }, [chartData, dimensions]);

    // Handle mouse move for hover
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || !chartData.length) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const margin = { top: 40, right: 60, bottom: 80, left: 60 };
        const chartWidth = canvas.width - margin.left - margin.right;

        if (x >= margin.left && x <= canvas.width - margin.right &&
            y >= margin.top && y <= canvas.height - margin.bottom) {

            const index = Math.round(((x - margin.left) * (chartData.length - 1)) / chartWidth);
            if (index >= 0 && index < chartData.length) {
                setHoveredData(chartData[index]);
            }
        } else {
            setHoveredData(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredData(null);
    };

    // Display data
    const displayData = hoveredData || chartData[chartData.length - 1] || {};
    const previousCandle = hoveredData
        ? chartData[hoveredData.index - 1]
        : chartData[chartData.length - 2] || {};
    const priceChange = displayData.close - (previousCandle.close || displayData.open);
    const priceChangePercent = previousCandle.close
        ? ((priceChange / previousCandle.close) * 100).toFixed(2)
        : 0;

    return (
        <div className="w-auto h-[450px] bg-gray-900 text-white flex flex-col">
            {/* Header với timeframe buttons */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center space-x-1">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setSelectedTimeframe(tf)}
                            className={`px-3 py-1 text-sm font-medium rounded transition-all ${selectedTimeframe === tf
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
                <div className="text-sm text-gray-400">Chart</div>
            </div>

            {/* Info bar */}
            <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center space-x-6 text-sm">
                    <span className="text-green-400 font-mono text-base">
                        <span className="text-gray-400">O:</span>
                        {displayData.open?.toFixed(7)}{" "}
                        <span className="text-gray-400">H:</span>
                        {displayData.high?.toFixed(7)}{" "}
                        <span className="text-gray-400">L:</span>
                        {displayData.low?.toFixed(7)}{" "}
                        <span className="text-gray-400">C:</span>
                        {displayData.close?.toFixed(7)}{" "}
                        <span className="text-gray-400">V:</span>
                        {displayData.volume?.toFixed(2)}T
                    </span>
                    <span
                        className={`font-mono text-base ${priceChange >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        ({priceChange >= 0 ? "+" : ""}
                        {priceChangePercent}%)
                    </span>
                    {displayData.fullTime && (
                        <span className="text-gray-400 text-sm">{displayData.fullTime}</span>
                    )}
                </div>
            </div>

            {/* Chart container */}
            <div className="flex-1" ref={containerRef} style={{ minHeight: "300px" }}>
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-full cursor-crosshair"
                    style={{ display: 'block' }}
                />
            </div>
        </div>
    );
};

export default CandlestickChart;