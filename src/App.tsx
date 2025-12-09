//import { marked } from 'marked';
import { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';

export default function App() {
	const [text, setText] = useState(`# Intro
Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like.

## Lists
Unordered lists can be started using the toolbar or by typing . Ordered lists can be started by typing.

#### Unordered
* Lists are a piece of cake
* They even auto continue as you type
* A double enter will end them
* Tabs and shift-tabs work too

#### Ordered
1. Numbered lists...
2. ...work too!

## What about images?
![Yes](https://i.imgur.com/sZlktY7.png)`);
	//const [preview, setPreview] = useState('');

	const handleEditorChange = async (value: any) => {
		setText(value);
		//const html = await marked(value);
		//setPreview(html); // renderizza markdown in HTML
	};

	return (
		<div className='app-layout'>
			{/* 🔹 COLONNA SINISTRA - TOOLBAR FUNZIONI */}
			<aside className='sidebar'>
				<button>➕ Nuova nota</button>
				<button>💾 Salva</button>
				<button>🧠 AI</button>
				<button>📁 Archivio</button>
			</aside>
			<div className='markdown-preview'>
				<MarkdownEditor initialValue={text} onChange={handleEditorChange} />
			</div>
		</div>
	);
}
