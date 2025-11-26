// hooks/useAllFlight.ts

import { useEffect, useState } from "react";
import axios from "axios";
import { AllFlightProps } from "./interface/allFlight";

export const useAllFlight = (
  date: string,
  airport: string,
  query?: string,
  filter?: string
) => {
  const [data, setData] = useState<AllFlightProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const url = `https://ais.mn/api/aismongolia/flight?date=${date}&all=${airport}`;
      const res = await axios.get(url);

      let flights = res.data || [];
      console.log("------date--", date);
      console.log("------airport--", airport);
      console.log("------query--", query);
      console.log("------filter--", filter); // ⬅️ ИНГЭЖ ХЭВЛЭНЭ

      // ХАЙЛТ — company, dep_ad_en, dep_location_en
      if (query && query.trim().length > 0) {
        const q = query.toLowerCase();
        if (filter === "1") {
          flights = flights.filter((f: AllFlightProps) => {
            return (
              f.dep_location.toLowerCase().includes(q) ||
              f.dep_ad_en.toLowerCase().includes(q) ||
              f.dep_ad.toLowerCase().includes(q) ||
              f.arr_ad_en.toLowerCase().includes(q) ||
              f.arr_ad.toLowerCase().includes(q)
            );
          });
          setData(flights);
        } else if (filter === "2") {
          flights = flights.filter((f: AllFlightProps) => {
            return f.dep_ad_code.toLowerCase().includes(q);
          });
          setData(flights);
        } else if (filter === "3") {
          flights = flights.filter((f: AllFlightProps) => {
            return f.company.toLowerCase().includes(q);
          });
          setData(flights);
        } else if (filter === "4") {
          flights = flights.filter((f: AllFlightProps) => {
            return (
              f.dep_ad_en.toLowerCase().includes(q) ||
              f.dep_ad.toLowerCase().includes(q) ||
              f.arr_ad_en.toLowerCase().includes(q) ||
              f.arr_ad.toLowerCase().includes(q)
            );
          });
          setData(flights);
        } else [];
      }
    } catch (e) {
      console.log("FLIGHT ERROR", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [date, airport, query, filter]);

  return { data, loading, refetch: fetchFlights };
};
