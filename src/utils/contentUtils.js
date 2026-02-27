// ─────────────────────────────────────────────────────────────────────────────
// contentUtils.js — Pure functions for content parsing/serialization
// NO JSX, NO React components → satisfies react-refresh/only-export-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse rawContent (plain string or JSON string) into { text, tables }
 * Supports legacy plain-string content (no tables).
 */
export const parseContent = (rawContent) => {
    if (!rawContent) return { text: '', tables: [] };
    if (typeof rawContent === 'object') {
        return { text: rawContent.text || '', tables: rawContent.tables || [] };
    }
    try {
        const parsed = JSON.parse(rawContent);
        if (parsed && typeof parsed === 'object' && 'text' in parsed) {
            return { text: parsed.text || '', tables: parsed.tables || [] };
        }
    } catch {
        // Not JSON → treat as plain legacy string
    }
    return { text: rawContent, tables: [] };
};

/**
 * Serialize content object back to string for DB storage.
 * Always uses JSON format when tables exist.
 */
export const stringifyContent = (contentObj) => {
    if (!contentObj) return '';
    const { text = '', tables = [] } = contentObj;
    if (tables.length === 0) return text;
    return JSON.stringify({ text, tables });
};

/**
 * Flatten content into plain text — replaces {{table:N}} placeholders
 * with a simple ASCII/markdown representation of the table data.
 * Useful for copy-to-clipboard as plain text.
 */
export const flattenContentToText = (rawContent) => {
    const { text, tables } = parseContent(rawContent);
    if (tables.length === 0) return text;

    return text.replace(/{{table:(\d+)}}/g, (_, idxStr) => {
        const idx = parseInt(idxStr, 10);
        const table = tables[idx];
        if (!table) return '';

        const { label = '', headers = [], rows = [], direction = 'horizontal' } = table;
        const lines = [];

        if (label) lines.push(label);

        if (direction === 'vertical') {
            // headers row + each data row already structured correctly
            if (headers.length > 0) lines.push(headers.join('\t'));
            rows.forEach(row => lines.push(row.join('\t')));
        } else {
            // horizontal: headers on top
            if (headers.length > 0) lines.push(headers.join('\t'));
            rows.forEach(row => lines.push(row.join('\t')));
        }

        return '\n' + lines.join('\n') + '\n';
    });
};

