import 'easymde/dist/easymde.min.css';
import { useMemo, useState } from 'react';
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

	// useMemo evita di ricreare l'istanza di SimpleMDE a ogni re-render
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
				'side-by-side',
				'fullscreen'
			] as const
		};
	}, []); // ← importante: array vuoto, così non cambia mai

	const handleChange = (text: any) => {
		setValue(text);
		if (onChange) onChange(text);
	};

	return (
		<div>
			<SimpleMDE value={value} onChange={handleChange} options={options} />
		</div>
	);
	// return new EasyMDE({
	// 	element: document.getElementById('my-text-area')!
	// });
}
