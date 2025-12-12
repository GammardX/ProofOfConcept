import {
	improveWriting,
	summarizeText,
	translateToEnglish
} from '../services/llmService.ts';


interface TopBarProps {
	title: string;
	llm: {
		currentText: () => string;
		openDialog: (t: string) => void;
	};
}

export default function TopBar({ title, llm }: TopBarProps) {
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

	return (
		<header className='top-bar'>
			<div className='file-info'>
				<h2>{title}</h2>
			</div>
			<div className='actions'>
				<button onClick={handleSummarize}>📝 Riassumi</button>
				<button onClick={handleImprove}>✨ Migliora</button>
				<button onClick={handleTranslate}>🌐 Traduci</button>
			</div>
		</header>
	);
}