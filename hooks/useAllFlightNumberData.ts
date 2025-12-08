// hooks/useAllFlight.ts

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AllFlightProps } from "./interface/allFlight";
import moment from "moment";

export const useAllFlightNumber = (
  date: string,
  airport: string,
  flightNumber?: string
) => {
  const [data, setData] = useState<AllFlightProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const apiDate = moment(date, "YYYY-MM-DD")
        .format("DD-MMM-YYYY")
        .toLowerCase();

      let url = `https://ais.mn/api/aismongolia/flight?date=${apiDate}&all=${airport}`;

      //   🔍 FlightNumber хайлт хийвэл
      if (flightNumber && flightNumber.trim() !== "") {
        url += `&flight_number=${flightNumber.trim().toUpperCase()}`;
      }

      const res = await axios.get(url);

      const filter = res.data.filter(
        (item: AllFlightProps) =>
          item.iata?.toUpperCase() === flightNumber?.toUpperCase()
      );

      setData(filter);
    } catch (e) {
      console.log("FLIGHT ERROR", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    console.log(fetchFlights);
  }, [date, airport]);

  return { data, loading };
};
