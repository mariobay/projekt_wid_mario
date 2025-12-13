from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# CORS – erlaubt Zugriff vom Frontend (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CSV laden (liegt im backend/data Ordner)
df = pd.read_csv("data/Gesamtdatensatz.csv")

@app.get("/")
def root():
    return {"status": "Backend läuft"}

@app.get("/peak-time")
def peak_time():
    # Dummy-Daten zum Testen
    return {
        "hour": 17,
        "count": 1243
    }

