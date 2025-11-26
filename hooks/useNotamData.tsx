import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useNotamData(series: string) {
  const [notamData, setNotamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = `https://ais.mn/api/aismongolia/ntm?cat=${series}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(url, { timeout: 10000 });
      setNotamData(res.data);
    } catch (err) {
      console.error("Notam fetch error:", err);
      setNotamData([]);
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { notamData, loading, refetch: fetchData };
}
