import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SmartPreviewProps {
  content: string;
}

export const SmartPreview: React.FC<SmartPreviewProps> = ({ content }) => {
  return (
    <div className="markdown-body p-4 bg-white border rounded h-full overflow-auto">
      {/* react-markdown trasforma il testo grezzo in HTML formattato */}
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};