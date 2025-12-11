import {
	improveWriting,
	summarizeText,
	translateToEnglish
} from '../services/llmService.ts';
import '../style/sidebar.css';

interface SidebarProps {
	llm: {
		currentText: () => string;
		// setText: (t: string) => void;
		openDialog: (t: string) => void;
	};
}

export default function Sidebar({ llm }: SidebarProps) {
	const handleSummarize = async () => {
		const result = await summarizeText(llm.currentText());
		llm.openDialog(result);
	};

	const handleImprove = async () => {
		const result = await improveWriting(llm.currentText());
		llm.openDialog(result);
	};

	const handleTranslate = async () => {
		const result = await translateToEnglish(llm.currentText());
		llm.openDialog(result);
	};

	// const handleSixHats = async () => {
	//   const result = await applySixHats(onLLMResult.currentText());
	//   onLLMResult.setText(result);
	// };

	return (
		<aside className='sidebar'>
			{/* <DialogLLM></DialogLLM> */}
			{/* <button onClick={handleClickOpen}>Carica nota</button> */}
			<button onClick={handleSummarize}>📝 Riassumi</button>
			<button onClick={handleImprove}>✨ Migliora</button>
			<button onClick={handleTranslate}>🌐 Traduci</button>
			{/* <button onClick={handleSixHats}>🎩 6 Cappelli</button> */}
		</aside>
	);
}
