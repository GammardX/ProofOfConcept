import {
	improveWriting,
	summarizeText,
	translateToEnglish
} from '../services/llmService.ts';
import '../style/topbar.css';

interface TopBarProps {
	title: string;
	llm: {
		currentText: () => string;
		openLoadingDialog: () => void;
		setDialogResult: (t: string) => void;
	};
}

export default function TopBar({ title, llm }: TopBarProps) {
	const handleSummarize = async () => {
		llm.openLoadingDialog();

		try {
			const result = await summarizeText(llm.currentText());
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
	};

	const handleImprove = async () => {
		llm.openLoadingDialog();

		try {
			const result = await improveWriting(llm.currentText());
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
	};

	const handleTranslate = async () => {
		llm.openLoadingDialog();

		try {
			const result = await translateToEnglish(llm.currentText());
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
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
