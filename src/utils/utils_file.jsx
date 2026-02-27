import { renderLatex, RichContent } from './renderLatex';

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