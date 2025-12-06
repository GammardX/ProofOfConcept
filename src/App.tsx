import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { SmartEditor } from './components/SmartEditor';
import { SmartPreview } from './components/SmartPreview';
import './style/App.css'; 

function App() {
  const [noteContent, setNoteContent] = useState<string>("# Titolo della Nota\n\nBenvenuto in **Second Brain**.\nScrivi qui a sinistra...");

  return (
    <div className="app-container">
      
      <header className="app-header">
        <h1>Second Brain</h1>
      </header>

      {/* Area di Lavoro con Pannelli Ridimensionabili */}
      <main className="workspace">
        <PanelGroup direction="horizontal">
          
          {/* LATO SINISTRO: EDITOR */}
          <Panel defaultSize={50} minSize={20} className="editor-pane">
            <SmartEditor value={noteContent} onChange={setNoteContent} />
          </Panel>

          {/* LA BARRA DI TRASCINAMENTO CENTRALE */}
          <PanelResizeHandle className="resize-handle">
            <div className="resize-handle-bar" />
          </PanelResizeHandle>

          {/* LATO DESTRO: ANTEPRIMA */}
          <Panel defaultSize={50} minSize={20} className="preview-pane">
            <SmartPreview content={noteContent} />
          </Panel>

        </PanelGroup>
      </main>
    </div>
  );
}

export default App;