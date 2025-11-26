// hooks/useFlights.ts
import { useEffect, useState } from "react";
import axios from "axios";

export function useAirport(airport_code: string) {
  const [airport, setAirport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = "https://ais.mn/api/aismongolia/flight?airport=all";

  useEffect(() => {
    fetchData();
  }, [airport_code]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(baseUrl);
      setAirport(res.data);
      console.log("---------------------", airport);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { airport, loading };
}
