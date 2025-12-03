// hooks/useAllFlight.ts

import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { AllFlightProps } from "../interface/allFlight";

export const useDirectionList = (
  date?: string,
  airport?: string,
  direction?: string
) => {
  const [data, setData] = useState<AllFlightProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const apiDate = moment(date, "YYYY-MM-DD")
        .format("DD-MMM-YYYY")
        .toLowerCase();
      const url = `https://ais.mn/api/aismongolia/flight?date=${apiDate}&airport=${airport}&direction=${direction}`;
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
