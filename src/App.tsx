import { useCallback, useEffect, useRef, useState } from 'react';
import { get, set } from 'idb-keyval'; 
import DialogLLM from './components/DialogLLM';
import FileSidebar from './components/FileSidebar';
import MarkdownEditor from './components/MarkdownEditor';
import TopBar from './components/TopBar';
import './style/main.css';

// --- TIPI ---
export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: number;
}

const WELCOME_NOTE: Note = {
    id: 'welcome-note',
    title: 'Benvenuto',
    content: `# Benvenuto nel tuo Editor!\n\nQuesta nota è stata creata automaticamente.\n\n## Funzionalità:\n* Le note vengono **salvate automaticamente** nel browser.\n* Puoi usare l'AI per riassumere o tradurre.\n* Usa la sidebar per creare nuovi fogli.`,
    createdAt: Date.now()
};

const DB_KEY = 'my-markdown-notes';

export default function App() {
    // --- STATO DATI ---
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

    // --- CARICAMENTO INIZIALE ---
    useEffect(() => {
        async function loadNotes() {
            try {
                const savedNotes = await get<Note[]>(DB_KEY);
                
                if (savedNotes && savedNotes.length > 0) {
                    setNotes(savedNotes);
                    setActiveNoteId(savedNotes[0].id);
                } else {
                    setNotes([WELCOME_NOTE]);
                    setActiveNoteId(WELCOME_NOTE.id);
                    await set(DB_KEY, [WELCOME_NOTE]);
                }
            } catch (error) {
                console.error("Errore nel caricamento delle note:", error);
                setNotes([WELCOME_NOTE]);
                setActiveNoteId(WELCOME_NOTE.id);
            } finally {
                setIsLoaded(true);
            }
        }
        loadNotes();
    }, []);

    // --- AUTOSAVE ---
    useEffect(() => {
        if (!isLoaded) return;
        set(DB_KEY, notes).catch(err => console.error("Errore salvataggio:", err));
    }, [notes, isLoaded]);


    const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

    // --- STATO LAYOUT ---
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
            content: '# Titolo\nInizia a scrivere...',
            createdAt: Date.now()
        };
        setNotes((prev) => [...prev, newNote]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const confirm = window.confirm("Sei sicuro di voler eliminare questa nota?");
        if (!confirm) return;

        setNotes((prev) => {
            const newNotes = prev.filter((n) => n.id !== id);
            if (activeNoteId === id) {
                if (newNotes.length > 0) {
                    setActiveNoteId(newNotes[0].id);
                } else {
                    setActiveNoteId('');
                }
            }
            return newNotes;
        });
    };

    const handleRenameNote = (id: string, newTitle: string) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, title: newTitle } : note
            )
        );
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
                if (newWidth > 200 && newWidth < 600) {
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

    if (!isLoaded) {
        return <div className="loading-screen">Caricamento note...</div>;
    }

    return (
        <div className='app-container'>
            {/* SIDEBAR SINISTRA */}
            <div
                className='sidebar-wrapper'
                style={{ width: sidebarWidth }}
                ref={sidebarRef}>
                <FileSidebar
                    notes={notes}
                    activeId={activeNoteId}
                    onSelect={setActiveNoteId}
                    onCreate={handleCreateNote}
                    onDelete={handleDeleteNote}
                    onRename={handleRenameNote}
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
                            <MarkdownEditor
                                key={activeNote.id}
                                initialValue={activeNote.content}
                                onChange={handleUpdateNote}
                            />
                        </div>
                    </>
                ) : (
                    <div className='empty-state'>
                        <p>Nessuna nota selezionata.</p>
                        <button onClick={handleCreateNote} style={{marginTop: '1rem'}}>
                            Crea una nuova nota
                        </button>
                    </div>
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