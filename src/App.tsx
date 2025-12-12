import { useState, useRef, useEffect, useCallback } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import FileSidebar from './components/FileSidebar'; 
import TopBar from './components/TopBar';
import DialogLLM from './components/DialogLLM';
import './style/main.css';

// Tipo dati per una nota
export interface Note {
	id: string;
	title: string;
	content: string;
}

const INITIAL_NOTES: Note[] = [
	{ id: '1', title: 'Benvenuto', content: '# Ciao!\nQuesta è la tua prima nota.' },
	{ id: '2', title: 'Idee Progetto', content: '## Cose da fare\n* Creare sidebar\n* Aggiungere AI' }
];

export default function App() {
	// --- STATO DATI ---
	const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
	const [activeNoteId, setActiveNoteId] = useState<string>(INITIAL_NOTES[0].id);

	// Nota attiva corrente
	const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

	// --- STATO LAYOUT (Resizable) ---
	const [sidebarWidth, setSidebarWidth] = useState(250);
	const [isResizing, setIsResizing] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);

	// --- GESTIONE NOTE ---
	const handleUpdateNote = (newText: string) => {
		setNotes((prev) =>
			prev.map((note) =>
				note.id === activeNoteId ? { ...note, content: newText } : note
			)
		);
	};

	const handleCreateNote = () => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: 'Nuova Nota',
			content: '# Nuova nota'
		};
		setNotes([...notes, newNote]);
		setActiveNoteId(newNote.id);
	};

	const handleDeleteNote = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const newNotes = notes.filter((n) => n.id !== id);
		setNotes(newNotes);
		if (activeNoteId === id && newNotes.length > 0) {
			setActiveNoteId(newNotes[0].id);
		}
	};

	// --- GESTIONE LLM DIALOG ---
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogText, setDialogText] = useState('');

	const llmBridge = {
		currentText: () => activeNote?.content || '',
		openDialog: (text: string) => {
			setDialogText(text);
			setDialogOpen(true);
		}
	};

	// --- LOGICA RESIZING SIDEBAR ---
	const startResizing = useCallback(() => setIsResizing(true), []);
	const stopResizing = useCallback(() => setIsResizing(false), []);

	const resize = useCallback(
		(mouseMoveEvent: MouseEvent) => {
			if (isResizing) {
				const newWidth = mouseMoveEvent.clientX;
				if (newWidth > 100 && newWidth < 600) { // Limiti min/max
					setSidebarWidth(newWidth);
				}
			}
		},
		[isResizing]
	);

	useEffect(() => {
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', stopResizing);
		return () => {
			window.removeEventListener('mousemove', resize);
			window.removeEventListener('mouseup', stopResizing);
		};
	}, [resize, stopResizing]);

	return (
		<div className='app-container'>
			{/* SIDEBAR SINISTRA */}
			<div 
				className='sidebar-wrapper' 
				style={{ width: sidebarWidth }}
				ref={sidebarRef}
			>
				<FileSidebar 
					notes={notes} 
					activeId={activeNoteId} 
					onSelect={setActiveNoteId} 
					onCreate={handleCreateNote}
					onDelete={handleDeleteNote}
				/>
			</div>

			{/* MANIGLIA DI RIDIMENSIONAMENTO */}
			<div className='resizer' onMouseDown={startResizing} />

			{/* AREA PRINCIPALE */}
			<div className='main-content'>
				{activeNote ? (
					<>
						<TopBar title={activeNote.title} llm={llmBridge} />
						<div className='editor-wrapper'>
							{/* Usiamo la chiave 'key' per forzare il re-render quando cambia file */}
							<MarkdownEditor 
								key={activeNote.id} 
								initialValue={activeNote.content} 
								onChange={handleUpdateNote} 
							/>
						</div>
					</>
				) : (
					<div className="empty-state">Nessuna nota selezionata</div>
				)}
			</div>

			<DialogLLM
				text={dialogText}
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>
		</div>
	);
}