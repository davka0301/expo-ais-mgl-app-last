import { useEffect, useState } from "react";
import { NotamCat } from "./interface/notamCat";

const useNotamCat = (cat_code: string) => {
  const [serie, setSerie] = useState<NotamCat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCat();
  }, [cat_code]);

  const fetchCat = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ais.mn/api/aismongolia/ntm?cat=ALL");
      const json = await res.json();
      setSerie(json);
    } catch (err) {
      console.log("CATEGORY ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  return { serie, loading };
};

export default useNotamCat;
