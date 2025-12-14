import type EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { useEffect, useMemo, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import '../style/md-editor.css';

// Import per fare colorazioni sintattiche nel markdown
import 'highlight.js/styles/vs.css'; 
import hljs from 'highlight.js';
import './utils/languageImports';

interface MarkdownEditorProps {
    initialValue?: string;
    onChange?: (text: string) => void;
}

export default function MarkdownEditor({
    initialValue = '',
    onChange
}: MarkdownEditorProps) {
    const [value, setValue] = useState(initialValue);
    const [editorInstance, setEditorInstance] = useState<EasyMDE | null>(null);

    const options = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: 'Scrivi qui le tue note in Markdown...',
            autofocus: true,
            status: false,
            sideBySideFullscreen: false,
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true, 
                hljs: hljs, 
            },
            toolbar: [
                'bold', 'italic', 'heading', '|',
                'code', 'quote', 'unordered-list', 'ordered-list', 'table', '|',
                'link', 'image', '|',
                'preview', 'side-by-side'
            ] as const
        };
    }, []);

    const handleChange = (text: string) => {
        setValue(text);
        if (onChange) onChange(text);
    };

    useEffect(() => {
        if (!editorInstance) return;
        if (!editorInstance.isSideBySideActive()) {
            editorInstance.toggleSideBySide();
        }
    }, [editorInstance]);

    return (
        <SimpleMDE
            value={value}
            onChange={handleChange}
            options={options}
            getMdeInstance={setEditorInstance} 
            className="h-full"
        />
    );
}