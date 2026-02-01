# Prerequisiti

## Avere un file .env dentro la cartella backend
File di esempio

```bash
# Chiave api
LLM_API_KEY=xx-xxxxxxxxxxxxxxxxxaxxxxx

# Url Api
LLM_API_URL=http://sito:porta/v1/chat/completions

# Modello
LLM_MODEL=gpt-oss:20b
```

# 1 Crea virtual environment python (FastAPI) con requirements.txt

Nella root del progetto esegui il comando:
importante avere la versione pyton 3.12.x poichè versioni più recenti risultano instabili

```cmd
py -3.12 -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

Questo comando basta eseguirlo la prima volta e basta

# 2 Avviare in due terminali attivi contemporaneamente backend e frontend

## 2.1 Avvio backend

```cmd
.venv\Scripts\activate
cd backend
uvicorn app.main:app --reload
```

## 2.2 Avvio frontend
### 2.2.1 Avvio frontend user

```cmd
cd frontend
npm install
npm run build
npm run preview
```

### 2.2.1 Avvio frontend developer

```cmd
cd frontend
npm run dev
```

## Se non funziona, segui questi passi:

1️⃣ Verifica installazione Python

In PowerShell / CMD:

```cmd
python --version
```

2️⃣ Crea un virtual environment (se non esiste)

Nella root del progetto:

```cmd
py -3.12 -m venv .venv
```

3️⃣ Attiva il virtualenv (Windows) .venv\Scripts\activate

Dovresti vedere:

(.venv) PS C:\tuo\progetto>

⚠️ Se non vedi (venv) NON è attivo

4️⃣ Installa FastAPI + Uvicorn pip install fastapi uvicorn

Verifica:

```cmd
uvicorn --version
```

5️⃣ Avvia FastAPI (comando corretto)

⚠️ devi essere nella cartella backend (oppure adattare il path)

```cmd
uvicorn app.main:app --reload
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in
  [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh
