// src/services/llmService.ts
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function askLLM(prompt: string): Promise<string> {
	return prompt;
}

export async function summarizeText(text: string) {
	return askLLM(`Riassumi questo testo in modo chiaro e conciso:\n\n${text}`);
}

export async function improveWriting(text: string) {
	return askLLM(
		`Migliora la chiarezza e la scorrevolezza del seguente testo:\n\n${text}`
	);
}

export async function translateToEnglish(text: string) {
	return askLLM(`Traduci in inglese mantenendo il significato:\n\n${text}`);
}

// export async function applySixHats(text: string) {
// 	return askLLM(`
// Applica la tecnica dei Sei Cappelli di De Bono al seguente testo.
// Riporta le risposte in formato Markdown.

// Testo:
// ${text}
//   `);
// }
