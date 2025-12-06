import React, { useMemo } from 'react';
import SimpleMde from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css'; // Stile essenziale per l'editor

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SmartEditor: React.FC<SmartEditorProps> = ({ value, onChange }) => {
  
  // Configuriamo EasyMDE. useMemo serve a non ricaricare la config ogni volta che scrivi una lettera.
  const editorOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false, // Disattiviamo il correttore ortografico inglese (fastidioso)
      status: false,       // Nascondiamo la barra di stato sotto (righe, parole) per pulizia
      // Nascondiamo i bottoni di preview/side-by-side nativi perché useremo la nostra preview personalizzata
      hideIcons: ["side-by-side", "fullscreen", "preview"] as const
    };
  }, []);

  return (
    <SimpleMde 
      value={value} 
      onChange={onChange} 
      options={editorOptions}
      className="h-full" // Classe per occupare l'altezza disponibile
    />
  );
};