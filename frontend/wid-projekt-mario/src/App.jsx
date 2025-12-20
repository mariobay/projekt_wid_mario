import { useEffect, useRef, useState } from "react";
import axios from "axios";
import embed from "vega-embed";

function App() {
  /* ---------------- Fokusfrage ---------------- */
  const [peakData, setPeakData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/peak-time")
      .then((res) => setPeakData(res.data));
  }, []);

  useEffect(() => {
    if (!peakData) return;

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 650,
      height: 320,
      data: { values: peakData.hourly_data },
      mark: "bar",
      encoding: {
        x: { field: "hour", type: "ordinal", title: "Stunde" },
        y: {
          field: "count",
          type: "quantitative",
          title: "Erwachsene",
        },
      },
    };

    embed(chartRef.current, spec, { actions: false });
  }, [peakData]);

  /* ---------------- Exploration ---------------- */
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(12);
  const [location, setLocation] = useState("Nord");
  const [category, setCategory] = useState("Erwachsene");
  const [result, setResult] = useState(null);

  const handleExplore = () => {
    axios
      .get("http://127.0.0.1:8000/explore", {
        params: { date, hour, location, category },
      })
      .then((res) => setResult(res.data));
  };

  if (!peakData) return <p>Daten werden geladen…</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      {/* ---------- Fokusfrage ---------- */}
      <h1>Bahnhofstrasse Nord</h1>

      <p>
        <strong>Peak:</strong> am <strong>{peakData.date}</strong> um{" "}
        <strong>{peakData.peak_hour} Uhr</strong> mit{" "}
        <strong>{peakData.peak_count}</strong> erwachsenen Passant:innen
      </p>

      <p>
        Anzahl der erwachsenen Passant:innen am Standort Bahnhofstrasse Nord am{" "}
        {peakData.date}
      </p>

      <div ref={chartRef} />

      {/* ---------- Datenexploration ---------- */}
      <hr style={{ margin: "3rem 0" }} />

      <h2>Datenexploration</h2>
      <p>
        Wähle Datum, Uhrzeit, Location und Kategorie um anzuzeigen, wie viele
        Passant:innen an einem Ort laufen.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
        />

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option>Nord</option>
          <option>Mitte</option>
          <option>Süd</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Erwachsene</option>
          <option>Kinder</option>
        </select>

        <button onClick={handleExplore}>Anzeigen</button>
      </div>

      {result && (
        <p style={{ marginTop: "1.5rem" }}>
          {result.has_data ? (
            <>
              Am <strong>{result.date}</strong> um{" "}
              <strong>{result.hour} Uhr</strong> laufen an der{" "}
              <strong>Bahnhofstrasse {result.location}</strong>{" "}
              <strong>{result.count}</strong> <strong>{result.category}</strong>
              .
            </>
          ) : (
            <strong>Keine Daten für das gewählte Datum vorhanden.</strong>
          )}
        </p>
      )}
    </div>
  );
}

export default App;
