import Button from '@mui/material/Button';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

interface DialogLLMProps {
	text: string; // ⬅ testo da mostrare
	open: boolean; // ⬅ controllato dal parent
	onClose: () => void;
}

export default function DialogLLM({ text, open, onClose }: DialogLLMProps) {
	const [scroll] = React.useState<DialogProps['scroll']>('paper');

	const descriptionElementRef = React.useRef<HTMLElement>(null);
	React.useEffect(() => {
		if (open) {
			descriptionElementRef.current?.focus();
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			scroll={scroll}
			aria-labelledby='scroll-dialog-title'
			aria-describedby='scroll-dialog-description'>
			<DialogTitle id='scroll-dialog-title'>Risultato LLM</DialogTitle>
			<DialogContent dividers={scroll === 'paper'}>
				<DialogContentText
					id='scroll-dialog-description'
					ref={descriptionElementRef}
					tabIndex={-1}>
					{text || 'Nessun risultato'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Chiudi</Button>
			</DialogActions>
		</Dialog>
	);
}
