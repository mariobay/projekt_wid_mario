import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/peak-time")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bahnhofstrasse Nord</h1>
      {data && (
        <p>
          Peak: {data.hour} Uhr – {data.count} Erwachsene
        </p>
      )}
    </div>
  );
}

export default App;
