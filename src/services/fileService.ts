export const fileService = {
    // carica un file dal filesystem
    async importFile(): Promise<{ title: string; content: string } | null> {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{ description: 'Markdown Files', accept: { 'text/markdown': ['.md'], 'text/plain': ['.txt'] } }],
            });
            const file = await fileHandle.getFile();
            const content = await file.text();
            return { title: file.name.replace(/\.[^/.]+$/, ""), content };
        } catch (err) {
            console.error("Importazione annullata o fallita", err);
            return null;
        }
    },

    // salva una nota sul filesystem
    async exportFile(title: string, content: string) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: `${title}.md`,
                types: [{ description: 'Markdown File', accept: { 'text/markdown': ['.md'] } }],
            });
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
        } catch (err) {
            console.error("Salvataggio annullato", err);
        }
    }
};