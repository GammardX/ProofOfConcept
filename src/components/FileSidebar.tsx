import type { Note } from '../App';
interface FileSidebarProps {
	notes: Note[];
	activeId: string;
	onSelect: (id: string) => void;
	onCreate: () => void;
	onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function FileSidebar({
	notes,
	activeId,
	onSelect,
	onCreate,
	onDelete
}: FileSidebarProps) {
	return (
		<aside className='file-sidebar'>
			<div className='sidebar-header'>
				<h3>Le tue note</h3>
				<button onClick={onCreate} className='btn-add' title="Nuova nota">
					+
				</button>
			</div>
			
			<ul className='file-list'>
				{notes.map((note) => (
					<li 
						key={note.id} 
						className={note.id === activeId ? 'active' : ''}
						onClick={() => onSelect(note.id)}
					>
						<span className="file-icon">📄</span>
						<span className="file-name">{note.title}</span>
						<button 
							className="btn-delete" 
							onClick={(e) => onDelete(note.id, e)}
							title="Elimina"
						>
							🗑️
						</button>
					</li>
				))}
			</ul>
		</aside>
	);
}