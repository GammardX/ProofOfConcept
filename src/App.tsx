//import { marked } from 'marked';
import { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';

export default function App() {
	const [text, setText] = useState('');
	//const [preview, setPreview] = useState('');

	const handleEditorChange = async (value: any) => {
		setText(value);
		//const html = await marked(value);
		//setPreview(html); // renderizza markdown in HTML
	};

	return (
		<div>
			<div className='markdown-preview'>
				<MarkdownEditor initialValue={text} onChange={handleEditorChange} />
			</div>
			{
				// <div
				// 	className='w-1/2 p-4 overflow-auto prose'
				// 	dangerouslySetInnerHTML={{ __html: preview }}
				// />
			}
		</div>
	);
}
