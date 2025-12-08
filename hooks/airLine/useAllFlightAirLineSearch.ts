// hooks/useAllFlight.ts

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AllFlightProps } from "../interface/allFlight";
import moment from "moment";

export const useAllFlightLineSearch = (
  date: string,
  airport: string,
  company: string
) => {
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

      let list = res.data;

      // company filter
      if (company) {
        list = list.filter(
          (item: AllFlightProps) =>
            item.company_abbr === company ||
            item.company?.toLowerCase().includes(company.toLowerCase())
        );
      }

      setData(list);
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
