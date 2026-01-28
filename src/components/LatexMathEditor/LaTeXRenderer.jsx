import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Component tái sử dụng để render text có chứa LaTeX
 * Tự động phát hiện và render các phần LaTeX trong text
 * @param {string} content - Text có chứa LaTeX (format: \(...\) hoặc $...$)
 * @param {number} fontSize - Kích thước font (px)
 * @param {string} className - Custom CSS class
 * @param {string} fallbackText - Text hiển thị khi không có content
 */
const LaTeXRenderer = ({ 
    content = '', 
    fontSize = 16,
    className = '',
    fallbackText = 'Chưa có nội dung...'
}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const text = content || fallbackText;
        
        try {
            // Parse text và tìm các phần LaTeX
            const parts = parseLatexContent(text);
            
            // Clear container
            containerRef.current.innerHTML = '';
            
            // Render từng phần
            parts.forEach(part => {
                if (part.type === 'latex') {
                    // Tạo span cho LaTeX
                    const span = document.createElement('span');
                    span.className = 'latex-math';
                    
                    try {
                        katex.render(part.content, span, {
                            throwOnError: false,
                            displayMode: part.displayMode
                        });
                    } catch (e) {
                        console.error('KaTeX render error:', e);
                        span.innerHTML = `<span style="color: red;">\\(${part.content}\\)</span>`;
                    }
                    
                    containerRef.current.appendChild(span);
                } else {
                    // Text thường
                    const textNode = document.createTextNode(part.content);
                    containerRef.current.appendChild(textNode);
                }
            });
        } catch (e) {
            console.error('Parse error:', e);
            containerRef.current.textContent = text;
        }
    }, [content, fallbackText]);

    return (
        <div 
            ref={containerRef}
            className={`latex-content ${className}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
        />
    );
};

/**
 * Parse content thành các phần text và LaTeX
 * Hỗ trợ: \(...\) cho inline và $...$ cho display mode
 */
const parseLatexContent = (text) => {
    const parts = [];
    let currentIndex = 0;
    
    // Regex để tìm LaTeX: \(...\) hoặc $...$
    const latexRegex = /\\\(((?:[^\\]|\\(?!\)))*)\\\)|\$\$((?:[^$]|\$(?!\$))*)\$\$/g;
    
    let match;
    while ((match = latexRegex.exec(text)) !== null) {
        // Thêm text trước LaTeX
        if (match.index > currentIndex) {
            parts.push({
                type: 'text',
                content: text.substring(currentIndex, match.index)
            });
        }
        
        // Thêm phần LaTeX
        const isDisplayMode = match[0].startsWith('$');
        const latexContent = isDisplayMode ? match[2] : match[1];
        
        parts.push({
            type: 'latex',
            content: latexContent,
            displayMode: isDisplayMode
        });
        
        currentIndex = match.index + match[0].length;
    }
    
    // Thêm text còn lại
    if (currentIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.substring(currentIndex)
        });
    }
    
    return parts;
};

export default LaTeXRenderer;