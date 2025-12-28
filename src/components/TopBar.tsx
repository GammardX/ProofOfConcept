import {
	improveWriting,
	summarizeText,
	translate,
	applySixHats
} from '../services/llmService.ts';
import '../style/topbar.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Menu, MenuItem} from '@mui/material';
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
	/*
		------------------------------------
		SUMMARY
		------------------------------------
	*/
	const handleSummarize = async () => {
		llm.openLoadingDialog();

		try {
			const result = await summarizeText(llm.currentText());
			llm.setDialogResult(result);
		} catch {
			llm.setDialogResult('Errore durante la generazione.');
		}
	};

	/*
		------------------------------------
		ENHANCEMENT
		------------------------------------
	*/
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

	/*
		------------------------------------
		TRANSLATION
		------------------------------------
	*/
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
	
	/*
		------------------------------------
		SIX HATS
		------------------------------------
	*/
	const sixHats = [
		{ label: 'Bianco', color: '#ffffff' },  //fatti, informazioni
		{ label: 'Rosso', color: '#ff0000' },   //emozioni, sentimenti
		{ label: 'Nero', color: '#000000' },    //critica, problemi
		{ label: 'Giallo', color: '#ffeb3b' },  //benefici, ottimismo
		{ label: 'Verde', color: '#4caf50' },   //creatività, alternative
		{ label: 'Blu', color: '#2196f3' },     //controllo, sintesi, gestione processo
		];

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
	setAnchorEl(null);
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
				<button onClick={(e) => setAnchorEl(e.currentTarget as HTMLElement)}>🧢 Analisi</button>
			</div>
			<Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
				{sixHats.map((hat) => (
					<MenuItem
					key={hat.label}
					onClick={async () => {
						handleMenuClose();
						llm.openLoadingDialog();
						try {
							const result = await applySixHats(llm.currentText(), hat.label);
							llm.setDialogResult(result);
						} catch {
							llm.setDialogResult('Errore durante la generazione.');
						}
					}}>
					<span
						style={{
						display: 'inline-block',
						width: 12,
						height: 12,
						borderRadius: '50%',
						backgroundColor: hat.color,
						marginRight: 8
						}}
					></span>
					{hat.label}
					</MenuItem>
				))}
				</Menu>

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
