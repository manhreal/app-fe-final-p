// ─────────────────────────────────────────────────────────────────────────────
// renderLatex.jsx — React components ONLY (satisfies react-refresh rule)
// Pure utility functions are in contentUtils.js
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { parseContent } from './contentUtils';

// Re-export for convenience so existing imports don't break
export { parseContent, stringifyContent, flattenContentToText } from './contentUtils';

// ─────────────────────────────────────────────────────────────────────────────
// LatexText — renders a string containing $...$ and $$...$$ LaTeX
// ─────────────────────────────────────────────────────────────────────────────
export const LatexText = ({ text }) => {
    if (!text) return null;
    try {
        const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
        return (
            <>
                {parts.map((part, index) => {
                    if (part.startsWith('$$') && part.endsWith('$$')) {
                        return <BlockMath key={index} math={part.slice(2, -2)} />;
                    }
                    if (part.startsWith('$') && part.endsWith('$')) {
                        return <InlineMath key={index} math={part.slice(1, -1)} />;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </>
        );
    } catch (e) {
        console.error('LaTeX render error:', e);
        return <span>{text}</span>;
    }
};

// Backward-compat: renderLatex(text) returns JSX
export const renderLatex = (text) => <LatexText text={text} />;

const TC = 'px-4 py-2 border border-gray-200 whitespace-nowrap text-sm';

// ─────────────────────────────────────────────────────────────────────────────
// TableRenderer — renders a single table definition
// ─────────────────────────────────────────────────────────────────────────────
export const TableRenderer = ({ table }) => {
    if (!table) return null;
    const { label, headers = [], rows = [], direction = 'horizontal' } = table;
    const isVertical = direction === 'vertical';

    return (
        <div className="my-3">
            {label && (
                <div className="text-sm font-semibold text-gray-700 mb-1">
                    <LatexText text={label} />
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-max border-collapse rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    {!isVertical && (
                        <>
                            {headers.length > 0 && (
                                <thead>
                                    <tr className="bg-indigo-50">
                                        {headers.map((h, i) => (
                                            <th key={i} className={`${TC} font-semibold text-indigo-800 text-left`}>
                                                <LatexText text={h} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {rows.map((row, ri) => (
                                    <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row.map((cell, ci) => (
                                            <td key={ci} className={`${TC} text-gray-800`}>
                                                <LatexText text={String(cell)} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                    {isVertical && (
                        <tbody>
                            {headers.length > 0 && (
                                <tr className="bg-indigo-50">
                                    {headers.map((h, i) => (
                                        <th key={i} className={`${TC} font-semibold text-indigo-800 text-left`}>
                                            <LatexText text={h} />
                                        </th>
                                    ))}
                                </tr>
                            )}
                            {rows.map((row, ri) => (
                                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {row.map((cell, ci) =>
                                        ci === 0 ? (
                                            <th key={ci} className={`${TC} font-semibold text-indigo-800 bg-indigo-50 text-left`}>
                                                <LatexText text={String(cell)} />
                                            </th>
                                        ) : (
                                            <td key={ci} className={`${TC} text-gray-800 text-center`}>
                                                <LatexText text={String(cell)} />
                                            </td>
                                        )
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// TextBlockRenderer (internal)
// ─────────────────────────────────────────────────────────────────────────────
const TextBlockRenderer = ({ raw }) => {
    const paragraphs = raw.split(/\n{2,}/);
    return (
        <>
            {paragraphs.map((para, pi) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                    return <div key={pi} className="my-2"><BlockMath math={trimmed.slice(2, -2)} /></div>;
                }
                const lines = trimmed.split('\n');
                return (
                    <p key={pi} className="mb-2 last:mb-0 leading-relaxed">
                        {lines.map((line, li) => (
                            <React.Fragment key={li}>
                                <LatexText text={line} />
                                {li < lines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// RichContent — renders full content (text + embedded tables via {{table:N}})
// Usage: <RichContent content={quiz.content} />
// ─────────────────────────────────────────────────────────────────────────────
export const RichContent = ({ content: rawContent }) => {
    const { text, tables } = parseContent(rawContent);
    if (!text && tables.length === 0) return null;

    const parts = text.split(/({{table:\d+}})/g);
    return (
        <div>
            {parts.map((part, i) => {
                const match = part.match(/^{{table:(\d+)}}$/);
                if (match) {
                    const idx = parseInt(match[1], 10);
                    return <TableRenderer key={i} table={tables[idx]} />;
                }
                if (part.trim()) return <TextBlockRenderer key={i} raw={part} />;
                return null;
            })}
        </div>
    );
};

// Backward-compat function wrapper
export const renderRichContent = (rawContent) => <RichContent content={rawContent} />;

export const renderSmartContent = (content) => {
    if (!content) return null;
    if (typeof content === 'string') {
        const trimmed = content.trim();
        if (trimmed.startsWith('{')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (typeof parsed.text === 'string' && Array.isArray(parsed.tables)) {
                    return <RichContent content={parsed} />;
                }
            } catch (error) {
                console.warn('Failed to parse content as JSON, falling back to plain text:', error);
            }
        }
    }
    return renderLatex(content);
};