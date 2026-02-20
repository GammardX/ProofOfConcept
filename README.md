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

# Usando docker
Nella root del progetto esegui il comando:
```cmd
docker compose up --build
```

# Per spegnere
Nel terminale premere Ctrl+C oppure "docker compose down"

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in
  [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh
