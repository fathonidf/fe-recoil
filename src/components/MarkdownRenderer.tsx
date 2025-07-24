// components/MarkdownRenderer.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // Verifikasi konten input
    if (!content) return null;
    
    // Proses konten terlebih dahulu untuk mengubah **text** menjadi <strong>text</strong>
    // tanpa mengganggu tag <strong> yang sudah ada dan sintaks markdown lainnya
    interface ProcessContentFunction {
        (text: string): string;
    }

    const processContent: ProcessContentFunction = (text) => {
        // Preserve markdown heading syntax (###) before processing bold
        // Temp replace ### headings to preserve them
        let processed = text;
        
        // Temporary replacement for markdown headings
        const headingPlaceholders: {[key: string]: string} = {};
        let headingCounter = 0;
        
        // First, protect headings from being processed
        processed = processed.replace(/^(#{1,6})\s+(.+)$/gm, (match) => {
            const placeholder = `__HEADING_PLACEHOLDER_${headingCounter}__`;
            headingPlaceholders[placeholder] = match;
            headingCounter++;
            return placeholder;
        });
        
        // Process bold text
        processed = processed.replace(/(?<!\<[^>]*)\*\*(.*?)\*\*(?![^<]*\>)/g, '<strong>$1</strong>');
        
        // Restore headings
        Object.keys(headingPlaceholders).forEach(placeholder => {
            processed = processed.replace(placeholder, headingPlaceholders[placeholder]);
        });
        
        return processed;
    };

    const processedContent = processContent(content);

    return (
        <div className="font-weissenhof text-sm md:text-base">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]} // Tambahkan rehype-raw untuk memproses HTML mentah dalam markdown
                components={{
                    p: ({ ...props }) => <p className="" {...props} />,
                    h1: ({ ...props }) => <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-lg md:text-xl font-bold mb-2" {...props} />,
                    h4: ({ ...props }) => <h4 className="text-base md:text-lg font-bold mb-1 md:mb-2" {...props} />,
                    a: ({ ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                    strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                    hr: () => <hr className="my-4 md:my-6 border-t border-gray-300" />,
                    ul: ({ ...props }) => <ul className="list-disc pl-4 md:pl-5 mb-3 md:mb-4" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-4 md:pl-5 mb-3 md:mb-4" {...props} />,
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                    blockquote: ({ ...props }) => <blockquote className="pl-3 md:pl-4 border-l-4 border-gray-300 italic" {...props} />,
                    code: ({ inline, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) =>
                        inline
                            ? <code className="bg-gray-100 px-1 rounded text-xs md:text-sm" {...props} />
                            : <code className="block bg-gray-100 p-2 rounded mb-3 md:mb-4 overflow-auto text-xs md:text-sm" {...props} />,
                    pre: ({ ...props }) => <pre className="bg-gray-100 p-3 md:p-4 rounded mb-3 md:mb-4 overflow-auto text-xs md:text-sm" {...props} />,
                    table: ({ ...props }) => <table className="min-w-full border border-gray-300 mb-3 md:mb-4 text-xs md:text-sm" {...props} />,
                    thead: ({ ...props }) => <thead className="bg-gray-100" {...props} />,
                    th: ({ ...props }) => <th className="border border-gray-300 px-2 py-1 md:px-4 md:py-2 text-left" {...props} />,
                    td: ({ ...props }) => <td className="border border-gray-300 px-2 py-1 md:px-4 md:py-2" {...props} />
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;