import type EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import { useEffect, useMemo, useRef, useState } from 'react';
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
	const editorRef = useRef<EasyMDE | null>(null);

	const options = useMemo(() => {
		return {
			spellChecker: false,
			placeholder: 'Scrivi qui le tue note in Markdown...',
			autofocus: true,
			status: false,
			sideBySideFullscreen: false, // Importante per il layout grid
			toolbar: [
				'bold', 'italic', 'heading', '|',
				'quote', 'unordered-list', 'ordered-list', '|',
				'link', 'image', '|',
				'preview', 'side-by-side'
			] as const
		};
	}, []);

	const handleChange = (text: string) => {
		setValue(text);
		if (onChange) onChange(text);
	};

	const getMdeInstance = (instance: EasyMDE) => {
		editorRef.current = instance;
	};

	// --- FIX PER IL PRIMO AVVIO ---
	useEffect(() => {
		// Aumentiamo leggermente il tempo per dare modo al CSS Grid di stabilizzarsi
		const timer = setTimeout(() => {
			if (!editorRef.current) return;

			const instance = editorRef.current;
			
			// 1. Attiva Side-by-Side se spento
			if (!instance.isSideBySideActive()) {
				instance.toggleSideBySide();
			}

			// 2. PASSAGGIO FONDAMENTALE MANCANTE:
			// Forziamo il motore CodeMirror a ricalcolare le dimensioni.
			// Senza questo, al primo avvio vede dimensioni errate finché non clicchi o ridimensioni.
			if (instance.codemirror) {
				instance.codemirror.refresh();
			}

		}, 200); // 200ms è più sicuro di 100ms per il primo rendering

		return () => clearTimeout(timer);
	}, []);

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