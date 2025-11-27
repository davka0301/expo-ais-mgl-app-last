import { useEffect, useState } from "react";

export function useAipData(type: string) {
  const [aipData, setAipData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://ais.mn/api/aismongolia/aip?cat=${type}`
        );
        const json = await res.json();
        setAipData(json);
      } catch (e) {
        setError("Өгөгдөл ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [type]);

  return { aipData, loading, error };
}
