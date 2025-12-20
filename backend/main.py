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
    # 1. Filtern: Standort Bahnhofstrasse (Nord)
    df_f = df[df["location_name"] == "Bahnhofstrasse (Nord)"].copy()

    # 2. Zeit aufbereiten
    df_f["timestamp"] = pd.to_datetime(df_f["timestamp"])
    df_f["date"] = df_f["timestamp"].dt.date
    df_f["hour"] = df_f["timestamp"].dt.hour

    # 3. Tagesgesamtmenge Erwachsene bestimmen
    daily_totals = (
        df_f
        .groupby("date")["adult_pedestrians_count"]
        .sum()
        .reset_index()
    )

    # 4. Peak-Tag finden
    peak_day_row = daily_totals.loc[
        daily_totals["adult_pedestrians_count"].idxmax()
    ]
    peak_date = peak_day_row["date"]

    # 5. Stundenwerte für genau diesen Tag
    hourly_peak_day = (
        df_f[df_f["date"] == peak_date]
        .groupby("hour")["adult_pedestrians_count"]
        .sum()
        .reset_index()
        .sort_values("hour")
    )

    # 6. Peak-Stunde an diesem Tag
    peak_hour_row = hourly_peak_day.loc[
        hourly_peak_day["adult_pedestrians_count"].idxmax()
    ]

    return {
        "date": str(peak_date),
        "peak_hour": int(peak_hour_row["hour"]),
        "peak_count": int(peak_hour_row["adult_pedestrians_count"]),
        "hourly_data": hourly_peak_day.rename(
            columns={"adult_pedestrians_count": "count"}
        ).to_dict(orient="records")
    }

@app.get("/explore")
def explore(
    date: str,
    hour: int,
    location: str,
    category: str
):
    location_map = {
        "Nord": "Bahnhofstrasse (Nord)",
        "Mitte": "Bahnhofstrasse (Mitte)",
        "Süd": "Bahnhofstrasse (Süd)"
    }

    location_name = location_map[location]

    if category == "Erwachsene":
        count_column = "adult_pedestrians_count"
    else:
        count_column = "child_pedestrians_count"

    df_f = df[df["location_name"] == location_name].copy()
    df_f["timestamp"] = pd.to_datetime(df_f["timestamp"])

    df_f = df_f[
        (df_f["timestamp"].dt.date == pd.to_datetime(date).date()) &
        (df_f["timestamp"].dt.hour == hour)
    ]

    # 🔹 NEU: Keine Daten vorhanden
    if df_f.empty:
        return {
            "has_data": False
        }

    total = int(df_f[count_column].sum())

    return {
        "has_data": True,
        "date": date,
        "hour": hour,
        "location": location,
        "category": category,
        "count": total
    }








