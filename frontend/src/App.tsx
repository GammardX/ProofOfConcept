import { get, set } from 'idb-keyval';
import { useCallback, useEffect, useRef, useState } from 'react';
import DialogLLM from './components/DialogLLM';
import FileSidebar from './components/FileSidebar';
import MarkdownEditor from './components/MarkdownEditor';
import TopBar from './components/TopBar';
import { fileService } from './services/fileService';
import { wakeUpServer } from './services/llmService';
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
    // --- RISVEGLIO SERVER ---
    useEffect(() => {
        wakeUpServer();
    }, []);

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
                console.error('Errore nel caricamento delle note:', error);
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
        set(DB_KEY, notes).catch((err) =>
            console.error('Errore salvataggio:', err)
        );
    }, [notes, isLoaded]);

    const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

    // --- STATO LAYOUT ---
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const startWidthRef = useRef(0); 

    // --- GESTIONE NOTE ---
    const handleUpdateNote = (newText: string) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === activeNoteId ? { ...note, content: newText } : note
            )
        );
    };

    // --- GESTIONE LLM DIALOG ---
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');
    const [dialogLoading, setDialogLoading] = useState(false);

    const llmBridge = {
        currentText: () => activeNote?.content || '',

        openLoadingDialog: () => {
            setDialogText('');
            setDialogLoading(true);
            setDialogOpen(true);
        },

        setDialogResult: (text: string) => {
            setDialogLoading(false);
            setDialogText(text);
        }
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
        const confirm = window.confirm(
            'Sei sicuro di voler eliminare questa nota?'
        );
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

    const handleImportNote = async () => {
        const data = await fileService.importFile();
        if (data) {
            const newNote: Note = {
                id: Date.now().toString(),
                title: data.title,
                content: data.content,
                createdAt: Date.now()
            };
            setNotes(prev => [...prev, newNote]);
            setActiveNoteId(newNote.id);
        }
    };

    const handleExportNote = async (id: string) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            await fileService.exportFile(note.title, note.content);
        }
    };

    // --- LOGICA RESIZING SIDEBAR ---
    const startResizing = useCallback(() => {
        setIsResizing(true);
        startWidthRef.current = sidebarWidth;
    }, [sidebarWidth]);

    const stopResizing = useCallback(() => setIsResizing(false), []);

    const resize = useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing) {
                const newWidth = mouseMoveEvent.clientX;
                if (newWidth <= 100) {
                    setSidebarWidth(10);
                } else if (newWidth < 600) {
                    setSidebarWidth(newWidth);
                }
            }
        },
        [isResizing]
    );

    const handleResizerClick = () => {
        if (startWidthRef.current === 10 && sidebarWidth === 10) {
            setSidebarWidth(250);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    if (!isLoaded) {
        return <div className='loading-screen'>Caricamento note...</div>;
    }

    return (
        <div 
            className='app-container'
            style={{ 
                userSelect: isResizing ? 'none' : 'auto',
                cursor: isResizing ? 'col-resize' : 'auto' 
            }}
        >
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
                    onImport={handleImportNote} 
                    onExport={handleExportNote} 
                />
            </div>

            {/* MANIGLIA DI RIDIMENSIONAMENTO */}
            <div 
                className='resizer' 
                onMouseDown={startResizing} 
                onClick={handleResizerClick}
                style={{ 
                    backgroundColor: (sidebarWidth === 10 || isResizing) ? 'var(--accent-color)' : undefined 
                }}
            />

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
                        <button onClick={handleCreateNote} style={{ marginTop: '1rem' }}>
                            Crea una nuova nota
                        </button>
                    </div>
                )}
            </div>

            <DialogLLM
                text={dialogText}
                open={dialogOpen}
                loading={dialogLoading}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    );
}