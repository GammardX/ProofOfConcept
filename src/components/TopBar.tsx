import {
	improveWriting,
	summarizeText,
	translate
} from '../services/llmService.ts';
import '../style/topbar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
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

	const [openCriterion, setOpenCriterion] = useState(false);
	const [criterion, setCriterion] = useState('');

	const handleImproveClick = () => {
		setCriterion('');
		setOpenCriterion(true);
	};

	const handleConfirmImprove = async () => {
		setOpenCriterion(false);
		llm.openLoadingDialog();

		try {
			const result = await improveWriting(
				llm.currentText(),
				criterion
			);
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
	};

	const [openTargetLanguage, setOpenTargetLanguage] = useState(false);
	const [targetLanguage, setTargetLanguage] = useState('');

	const handleTranslate = () => {
		setTargetLanguage('');
		setOpenTargetLanguage(true);
	};

	const handleConfirmTranslate = async () => {
		setOpenTargetLanguage(false);
		llm.openLoadingDialog();

		try {
			const result = await translate(llm.currentText(), targetLanguage);
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
	};
	
	return (
		<>
		<header className='top-bar'>
			<div className='file-info'>
				<h2>{title}</h2>
			</div>
			<div className='actions'>
				<button onClick={handleSummarize}>📝 Riassumi</button>
				<button onClick={handleImproveClick}>✨ Migliora</button>
				<button onClick={handleTranslate}>🌐 Traduci</button>
			</div>
		</header>
		<Dialog open={openCriterion} onClose={() => setOpenCriterion(false)}>
				<DialogTitle>Decidi il criterio di riscrittura</DialogTitle>

				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						minRows={3}
						placeholder="Es: più formale, più chiaro, stile accademico…"
						value={criterion}
						onChange={(e) => setCriterion(e.target.value)}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setOpenCriterion(false)}>
						Annulla
					</Button>
					<Button
						onClick={handleConfirmImprove}
						disabled={!criterion.trim()}
					>
						Applica
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openTargetLanguage} onClose={() => setOpenTargetLanguage(false)}>
				<DialogTitle>Decidi la lingua di destinazione</DialogTitle>

				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						minRows={3}
						placeholder="Es: inglese, spagnolo, francese…"
						value={targetLanguage}
						onChange={(e) => setTargetLanguage(e.target.value)}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => setOpenTargetLanguage(false)}>
						Annulla
					</Button>
					<Button
						onClick={handleConfirmTranslate}
						disabled={!targetLanguage.trim()}
					>
						Applica
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
