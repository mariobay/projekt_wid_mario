import { useEffect, useRef, useState } from "react";
import axios from "axios";
import embed from "vega-embed";

function App() {
  const [data, setData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/peak-time")
      .then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    if (!data) return;

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 650,
      height: 320,
      data: { values: data.hourly_data },
      mark: "bar",
      encoding: {
        x: {
          field: "hour",
          type: "ordinal",
          title: "Stunde des Tages",
        },
        y: {
          field: "count",
          type: "quantitative",
          title: "Anzahl erwachsene Passant:innen",
        },
        tooltip: [
          { field: "hour", type: "ordinal", title: "Stunde" },
          {
            field: "count",
            type: "quantitative",
            title: "Erwachsene",
          },
        ],
      },
    };

    embed(chartRef.current, spec, { actions: false });
  }, [data]);

  if (!data) return <p>Daten werden geladen…</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Bahnhofstrasse Nord</h1>

      <p>
        <strong>Peak:</strong> am <strong>{data.date}</strong> um{" "}
        <strong>{data.peak_hour} Uhr</strong> mit{" "}
        <strong>{data.peak_count}</strong> erwachsenen Passant:innen
      </p>

      <p>
        Anzahl der erwachsenen Passant:innen am Standort{" "}
        <strong>Bahnhofstrasse Nord</strong> am <strong>{data.date}</strong>
      </p>

      <div ref={chartRef} />
    </div>
  );
}

export default App;
