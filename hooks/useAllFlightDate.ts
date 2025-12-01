import { useEffect, useState } from "react";
import { AllFlightProps } from "./interface/allFlight";
import axios from "axios";

export const useAllFlightDate = (date: string, airport: string) => {
  const [data, setData] = useState<AllFlightProps[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(
    "-------------------------------------------------------------------"
  );
  console.log("date - 2", date);
  console.log("airport - 2", airport);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const url = `https://ais.mn/api/aismongolia/flight?date=${date}&all=${airport}`;
      const res = await axios.get(url);

      setData(res.data);
    } catch (e) {
      console.log("FLIGHT NUMBER ERROR", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [date, airport]);

  return { data, loading, refetch: fetchFlights };
};
