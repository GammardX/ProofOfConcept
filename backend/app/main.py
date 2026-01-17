from app.config import settings
from app.llm.client import call_llm
from app.llm.parser import extract_json
from app.llm.prompts import summarize_prompt
from app.llm.schemas import LLMResponse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow this origin
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

@app.post("/llm/summarize", response_model=LLMResponse)
async def summarize(payload: dict):
    prompt = summarize_prompt(payload["text"], payload["percentage"])

    try:
        raw = await call_llm(
            prompt,
            settings.LLM_API_URL,
            settings.LLM_MODEL,
            settings.LLM_API_KEY,
        )
    except Exception:
        # Chiamata di fallback
        raw = await call_llm(
            prompt,
            "http://padova.zucchetti.it:14000/v1/chat/completions",
            "gpt-oss:20b",
            settings.LLM_API_KEY,
        )

    return extract_json(raw)
