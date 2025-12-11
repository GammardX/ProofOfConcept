//import { marked } from 'marked';
import { useState } from 'react';
import DialogLLM from './components/DialogLLM';
import MarkdownEditor from './components/MarkdownEditor';
import Sidebar from './components/Sidebar';

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

	const openDialogWithText = (result: string) => {
		setDialogText(result);
		setDialogOpen(true);
	};

	const llmBridge = {
		currentText: () => text,
		openDialog: openDialogWithText
	};

	const handleEditorChange = async (value: any) => {
		setText(value);
		//const html = await marked(value);
		//setPreview(html); // renderizza markdown in HTML
	};

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogText, setDialogText] = useState('');

	return (
		<div className='app-layout'>
			{/* 🔹 COLONNA SINISTRA - TOOLBAR FUNZIONI */}
			<Sidebar llm={llmBridge} />
			<div className='markdown-preview'>
				<MarkdownEditor initialValue={text} onChange={handleEditorChange} />
			</div>
			<DialogLLM
				text={dialogText}
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>
		</div>
	);
}
