# Avvio backend

cd backend uvicorn app.main:app --reload

# Avvio frontend

cd frontend npm run dev

# Crea virtual environment python (FastAPI) con requirements.txt

Nella root del progetto esegui il comando:

python -m venv .venv source .venv/bin/activate # su Linux/macOS
.venv\Scripts\activate # su Windows pip install -r requirements.txt

## Se non funziona, segui questi passi:

1️⃣ Verifica installazione Python

In PowerShell / CMD:

python --version

Se non funziona:

py --version

2️⃣ Crea un virtual environment (se non esiste)

Nella root del progetto:

python -m venv .venv

3️⃣ Attiva il virtualenv (Windows) .venv\Scripts\activate

Dovresti vedere:

(.venv) PS C:\tuo\progetto>

⚠️ Se non vedi (venv) NON è attivo

4️⃣ Installa FastAPI + Uvicorn pip install fastapi uvicorn

Verifica:

uvicorn --version

5️⃣ Avvia FastAPI (comando corretto)

⚠️ devi essere nella cartella backend (oppure adattare il path)

uvicorn app.main:app --reload

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in
  [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh
