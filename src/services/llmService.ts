const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function askLLM(prompt: string): Promise<string> {
	const response = await fetch(
		'http://padova.zucchetti.it:14000/v1/chat/completions',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-oss:20b',
				messages: [
					{
						role: 'user',
						content: prompt
					}
				]
			})
		}
	);

	const data = await response.json();

	return data.choices[0].message.content;
}

export async function summarizeText(text: string, percentage: number) {
	return askLLM( 
		`Riduci la lunghezza del testo fornito di circa il ${percentage}%, mantenendo:\n
		- lo stesso tono e stile dell'originale\n
		- tutte le informazioni essenziali\n
		- la struttura del testo, se presente\n

		Non aggiungere nuove informazioni e non interpretare il contenuto, non aggiungere commenti.\n
		Il risultato deve sembrare una versione più compatta dello stesso testo.\n

		Restituisci solo l'analisi richiesta.\n
		Non inserire introduzioni, titoli, prefazioni o frasi di apertura.\n
		Non invitare a ulteriori interazioni.\n
		
		Testo:\n
		${text}`
	);
}

export async function improveWriting(text: string, criterion: string) {
	return askLLM(
		`Riscrivi il testo fornito applicando il criterio indicato.\n
		Mantieni il significato originale del contenuto, a meno che il criterio non richieda esplicitamente una modifica.\n

		Non aggiungere commenti o spiegazioni.\n
		Non rendere il testo una lista a meno che non lo specifichi il criterio.\n
		Non inserire introduzioni, titoli, prefazioni o frasi di apertura.\n
		L'output deve contenere esclusivamente i punti principali.\n
		Non aggiungere commenti o spiegazioni.\n
		Non invitare a ulteriori interazioni.\n
		Criterio di riscrittura:\n
		${criterion}
		\n
		Testo:\n
		${text}`
	);
}

export async function translate(text: string, targetLanguage: string) {
	return askLLM(
		`Traduci il testo fornito nella lingua di destinazione mantenendo:\n
		- lo stesso tono e stile dell'originale\n
		- la struttura del testo, se presente\n
		- il significato originale senza aggiunte o interpretazioni o parafrasi\n

		Non spiegare la traduzione e non aggiungere commenti.\n
		Non inserire introduzioni, titoli, prefazioni o frasi di apertura.\n
		Non aggiungere commenti o spiegazioni.\n
		Non invitare a ulteriori interazioni.\n

		Lingua di destinazione:\n
		${targetLanguage}\n
		Testo:\n
		${text}`
	);
}

export async function applySixHats(text: string, hat: string) {
	switch (hat){
		case 'Bianco':
			return askLLM(
				`Analizza il testo fornito dal punto di vista dell'obiettività.\n
				Individua eventuali elementi di soggettività, bias, linguaggio valutativo o assunzioni non dichiarate.\n
				Distingui tra affermazioni fattuali e affermazioni valutative.\n

				Basa l'analisi esclusivamente sul testo fornito.\n
				Non esprimere opinioni personali e non aggiungere informazioni esterne.\n
				Restituisci solo l'analisi richiesta.\n
				Non inserire introduzioni, titoli, prefazioni o frasi di apertura.\n
				Non aggiungere commenti o spiegazioni.\n
				Non invitare a ulteriori interazioni.\n

				Testo:\n
				${text}`
			);
		default:
			return "marameo";
	}
}
