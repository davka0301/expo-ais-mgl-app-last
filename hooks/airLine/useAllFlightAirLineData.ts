// hooks/useAllFlight.ts

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AllFlightProps } from "../interface/allFlight";
import moment from "moment";

export const useAllFlightLine = (date: string, airport: string) => {
  const [data, setData] = useState<AllFlightProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const apiDate = moment(date, "YYYY-MM-DD")
        .format("DD-MMM-YYYY")
        .toLowerCase();

      const url = `https://ais.mn/api/aismongolia/flight?date=${apiDate}&all=${airport}`;
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

  // 🔥 Давхардсан company-г цэвэрлэх (distinct)
  const companies = useMemo(() => {
    const unique: { [key: string]: AllFlightProps } = {};

    data.forEach((item) => {
      if (!unique[item.company]) {
        unique[item.company] = item;
      }
    });

    return Object.values(unique);
  }, [data]);

  return { data, companies, loading, refetch: fetchFlights };
};
