import {
	improveWriting,
	summarizeText,
	translateToEnglish
} from '../services/llmService.ts';

interface SidebarProps {
	llm: {
		currentText: () => string;
		setText: (t: string) => void;
	};
}

export default function Sidebar({ llm }: SidebarProps) {
	const handleSummarize = async () => {
		const result = await summarizeText(llm.currentText());
		llm.setText(result);
	};

	const handleImprove = async () => {
		const result = await improveWriting(llm.currentText());
		llm.setText(result);
	};

	const handleTranslate = async () => {
		const result = await translateToEnglish(llm.currentText());
		llm.setText(result);
	};

	// const handleSixHats = async () => {
	//   const result = await applySixHats(onLLMResult.currentText());
	//   onLLMResult.setText(result);
	// };

	return (
		<aside className='sidebar'>
			<button onClick={handleSummarize}>📝 Riassumi</button>
			<button onClick={handleImprove}>✨ Migliora</button>
			<button onClick={handleTranslate}>🌐 Traduci</button>
			{/* <button onClick={handleSixHats}>🎩 6 Cappelli</button> */}
		</aside>
	);
}
