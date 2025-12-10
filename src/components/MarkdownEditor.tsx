import type EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';

interface MarkdownEditorProps {
	initialValue?: string;
	onChange?: (text: string) => void;
}

export default function MarkdownEditor({
	initialValue = '',
	onChange
}: MarkdownEditorProps) {
	const [value, setValue] = useState(initialValue);
	const editorRef = useRef<EasyMDE | null>(null);

	const options = useMemo(() => {
		return {
			spellChecker: false,
			placeholder: 'Scrivi qui le tue note in Markdown...',
			autofocus: true,
			status: false,
			toolbar: [
				'bold',
				'italic',
				'heading',
				'|',
				'quote',
				'unordered-list',
				'ordered-list',
				'|',
				'link',
				'image',
				'|',
				'preview',
				'side-by-side'
			] as const
		};
	}, []);

	const handleChange = (text: any) => {
		setValue(text);
		if (onChange) onChange(text);
	};

	const getMdeInstance = (instance: EasyMDE) => {
		editorRef.current = instance;
	};

	// Attiva fullscreen automaticamente al caricamento
	useEffect(() => {
		// Piccolo ritardo per assicurarsi che l'editor sia completamente inizializzato
		setTimeout(() => {
			if (editorRef.current && editorRef.current.codemirror) {
				// Cast per bypassare il controllo TypeScript
				(editorRef.current.codemirror as any).setOption('fullScreen', true);
			}
		}, 100);
	}, []);

	return (
		<SimpleMDE
			value={value}
			onChange={handleChange}
			options={options}
			getMdeInstance={getMdeInstance}
		/>
	);
}
