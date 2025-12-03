// hooks/useAllFlight.ts

import { useEffect, useState } from "react";
import axios from "axios";
import { DirectionAirport } from "../interface/directionAirport";
import moment from "moment";

export const useDirectionAirport = (date: string, airport: string) => {
  const [data, setData] = useState<DirectionAirport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const apiDate = moment(date, "YYYY-MM-DD")
        .format("DD-MMM-YYYY")
        .toLowerCase();
      const url = `https://ais.mn/api/aismongolia/flight?date=${apiDate}&airport=${airport}`;
      const res = await axios.get(url);

      setData(res.data);
    } catch (e) {
      console.log("FLIGHT ERROR", e);
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
