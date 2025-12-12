import type EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { useEffect, useMemo, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import '../style/md-editor.css';

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
            toolbar: [
                'bold', 'italic', 'heading', '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', '|',
                'side-by-side'
            ] as const
        };
    }, []);

    const handleChange = (text: string) => {
        setValue(text);
        if (onChange) onChange(text);
    };

    const getMdeInstance = (instance: EasyMDE) => {
        setEditorInstance(instance);
    };

    useEffect(() => {
        if (!editorInstance) return;

        const timer = setTimeout(() => {
            if (!editorInstance.isSideBySideActive()) {
                editorInstance.toggleSideBySide();
            }
            if (editorInstance.codemirror) {
                editorInstance.codemirror.refresh();
            }
        }, 10);

        return () => clearTimeout(timer);
    }, [editorInstance]); 

    return (
        <SimpleMDE
            value={value}
            onChange={handleChange}
            options={options}
            getMdeInstance={getMdeInstance}
            className="h-full"
        />
    );
}