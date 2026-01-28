import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer'; // Import component tái sử dụng
import { showSuccessToast } from '../../lib/sweetAlertConfig';

const LatexMathEditor = () => {
    const [latex, setLatex] = useState('');
    const [displayMode, setDisplayMode] = useState('inline');
    const [fontSize, setFontSize] = useState(20);
    const [copied, setCopied] = useState(false);

    const symbols = {
        'Phép toán cơ bản': [
            { label: '+', code: '+' },
            { label: '-', code: '-' },
            { label: '×', code: '\\times' },
            { label: '÷', code: '\\div' },
            { label: '±', code: '\\pm' },
            { label: '=', code: '=' },
            { label: '≠', code: '\\neq' },
            { label: '≈', code: '\\approx' },
        ],
        'So sánh': [
            { label: '<', code: '<' },
            { label: '>', code: '>' },
            { label: '≤', code: '\\leq' },
            { label: '≥', code: '\\geq' },
        ],
        'Phân số & Căn': [
            { label: 'a/b', code: '\\frac{a}{b}' },
            { label: '√', code: '\\sqrt{}' },
            { label: '∛', code: '\\sqrt[3]{}' },
            { label: 'ⁿ√', code: '\\sqrt[n]{}' },
        ],
        'Lũy thừa & Log': [
            { label: 'xⁿ', code: 'x^{n}' },
            { label: 'xₙ', code: 'x_{n}' },
            { label: 'log', code: '\\log' },
            { label: 'ln', code: '\\ln' },
            { label: 'eˣ', code: 'e^{x}' },
        ],
        'Hàm lượng giác': [
            { label: 'sin', code: '\\sin' },
            { label: 'cos', code: '\\cos' },
            { label: 'tan', code: '\\tan' },
            { label: 'cot', code: '\\cot' },
        ],
        'Ký hiệu Hy Lạp': [
            { label: 'α', code: '\\alpha' },
            { label: 'β', code: '\\beta' },
            { label: 'γ', code: '\\gamma' },
            { label: 'δ', code: '\\delta' },
            { label: 'θ', code: '\\theta' },
            { label: 'λ', code: '\\lambda' },
            { label: 'π', code: '\\pi' },
            { label: 'Σ', code: '\\Sigma' },
        ],
        'Tích phân & Đạo hàm': [
            { label: '∫', code: '\\int' },
            { label: '∫∫', code: '\\iint' },
            { label: '∑', code: '\\sum_{i=1}^{n}' },
            { label: '∏', code: '\\prod_{i=1}^{n}' },
            { label: "f'", code: "f'" },
            { label: 'lim', code: '\\lim_{x \\to a}' },
        ],
        'Ngoặc': [
            { label: '( )', code: '\\left( \\right)' },
            { label: '[ ]', code: '\\left[ \\right]' },
            { label: '{ }', code: '\\left\\{ \\right\\}' },
            { label: '| |', code: '\\left| \\right|' },
        ],
        'Vectơ & Ma trận': [
            { label: 'v⃗', code: '\\vec{v}' },
            { label: '→', code: '\\overrightarrow{AB}' },
            { label: 'Ma trận 2×2', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
        ],
    };

    const templates = [
        { name: 'Phương trình bậc 2', code: 'ax^2 + bx + c = 0' },
        { name: 'Delta', code: '\\Delta = b^2 - 4ac' },
        { name: 'Công thức nghiệm', code: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}' },
        { name: 'Sin công thức', code: '\\sin^2 x + \\cos^2 x = 1' },
        { name: 'Tích phân', code: '\\int_{a}^{b} f(x) dx' },
        { name: 'Giới hạn', code: '\\lim_{x \\to \\infty} f(x)' },
        { name: 'Phân số', code: '\\frac{a}{b}' },
        { name: 'Ma trận', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    ];

    const insertSymbol = (code) => {
        setLatex(prev => prev + code);
    };

    const copyLatex = () => {
        navigator.clipboard.writeText(latex);
        setCopied(true);
        showSuccessToast('Đã sao chép!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                    {/* Right Panel - Editor & Preview */}
                    <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
                        {/* Symbols Palette */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0">
                            <h3 className="font-bold text-xs mb-2 text-indigo-900">🔣 Bảng ký hiệu</h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {Object.entries(symbols).map(([category, syms]) => (
                                    <div key={category}>
                                        <h4 className="font-semibold text-xs text-gray-700 mb-1">{category}</h4>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
                                            {syms.map((sym, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => insertSymbol(sym.code)}
                                                    className="px-1 py-1.5 bg-gray-100 hover:bg-indigo-100 rounded text-center transition text-sm"
                                                    title={sym.code}
                                                >
                                                    {sym.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LaTeX Input */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0">
                            <h3 className="font-bold text-xs mb-2 text-indigo-900">✏️ Nhập mã LaTeX</h3>
                            <textarea
                                value={latex}
                                onChange={(e) => setLatex(e.target.value)}
                                className="w-full h-24 p-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nhập mã LaTeX hoặc click vào các ký hiệu bên trên..."
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={copyLatex}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
                                >
                                    <Copy size={14} />
                                    {copied ? 'Đã sao chép!' : 'Sao chép LaTeX'}
                                </button>
                                <button
                                    onClick={() => setLatex('')}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0">
                            <div className="mb-2">
                                <h3 className="font-bold text-xs text-indigo-900">👁️ Xem trước</h3>
                            </div>
                            <div className="min-h-20 p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {/* Render pure LaTeX hoặc mixed content */}
                                {latex.includes('\\(') || latex.includes('$') ? (
                                    <LaTeXRenderer
                                        content={latex}
                                        fontSize={fontSize}
                                        fallbackText="Nhập công thức..."
                                    />
                                ) : (
                                    <LaTeXRenderer
                                        content={displayMode === 'display' ? `$${latex}$` : `\\(${latex}\\)`}
                                        fontSize={fontSize}
                                        fallbackText="Nhập công thức..."
                                    />
                                )}
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                                <strong>Tip:</strong> Dùng <code className="bg-gray-200 px-1 rounded">\(...\)</code> cho inline, <code className="bg-gray-200 px-1 rounded">$...$</code> cho display mode
                            </div>
                        </div>
                    </div>

                    {/* Left Panel - Templates & Settings */}
                    <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
                        {/* Templates */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0 text-xs">
                            <h3 className="font-bold mb-3 text-indigo-900">📋 Mẫu có sẵn</h3>
                            <div className="divide-y divide-indigo-100">
                                {templates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setLatex(template.code)}
                                        className="w-full text-left py-2 text-gray-700 hover:text-indigo-600 transition"
                                    >
                                        {template.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Display Mode */}
                        <div className="bg-white rounded-lg shadow-lg p-4 flex-shrink-0 text-xs">
                            <h3 className="font-bold mb-2 text-indigo-900">⚙️ Cài đặt</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block font-medium mb-1">Chế độ hiển thị:</label>
                                    <select
                                        value={displayMode}
                                        onChange={(e) => setDisplayMode(e.target.value)}
                                        className="w-full px-2 py-1.5 border rounded"
                                    >
                                        <option value="inline">Inline (trong dòng)</option>
                                        <option value="display">Display (riêng dòng)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium mb-1">Kích thước: {fontSize}px</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="48"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex-shrink-0 text-xs">
                            <h4 className="font-bold text-yellow-800 mb-1">💡 Mẹo sử dụng:</h4>
                            <ul className="text-xs text-yellow-700 space-y-0.5">
                                <li>• Click vào các ký hiệu để thêm vào công thức</li>
                                <li>• Sử dụng dấu {'{}'} để nhóm: x^{'{2}'}</li>
                                <li>• Dùng \frac{'{tử}{mẫu}'} để tạo phân số</li>
                                <li>• Copy mã LaTeX để dán vào Word/đề thi online</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatexMathEditor;