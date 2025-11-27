import { useEffect, useState } from "react";

export const useAipCatData = () => {
  const [tabs, setTabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const res = await fetch("https://ais.mn/api/aismongolia/aip?cat=ALL");
      const json = await res.json();
      setTabs(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { tabs, loading, error };
};
