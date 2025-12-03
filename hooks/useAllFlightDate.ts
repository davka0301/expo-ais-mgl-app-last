import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { AllFlightProps } from "./interface/allFlight";

export interface FlightGroup {
  date: string; // YYYY-MM-DD
  apiDate: string; // DD-MMM-YYYY
  flights: AllFlightProps[];
}

type Options = {
  batchSize?: number; // зэрэг хэдийг явуулах (default 2)
  retries?: number; // хоосон эсвэл алдаа ирвэл retry хийх тоо (default 2)
  retryDelayMs?: number; // retry хоорондын хүлээлт (default 700ms)
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useAllFlightDate = (
  dates: string[],
  airport: string,
  opts?: Options
) => {
  const { batchSize = 2, retries = 2, retryDelayMs = 700 } = opts ?? {};
  const [data, setData] = useState<FlightGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchForDate = useCallback(
    async (d: string): Promise<FlightGroup> => {
      const apiDate = moment(d, "YYYY-MM-DD")
        .format("DD-MMM-YYYY")
        .toLowerCase();

      const url = `https://ais.mn/api/aismongolia/flight?date=${apiDate}&all=${airport}`;

      // retry loop
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          console.log(`FETCH ${d} attempt ${attempt + 1} -> ${url}`);
          const res = await axios.get(url);
          // log status & length for debugging
          console.log(
            `    ├─ apiDate: ${apiDate} attempt:${attempt + 1} status:${
              res.status
            } flights:${Array.isArray(res.data) ? res.data.length : "N/A"}`
          );

          // if server returns array with non-zero length OR it's the last attempt, return what we have
          if (Array.isArray(res.data) && res.data.length > 0) {
            return { date: d, apiDate, flights: res.data };
          }

          // if empty and still have retries left, wait then retry
          if (attempt < retries) {
            console.warn(
              `    └─ Empty result for ${apiDate}, retrying after ${retryDelayMs}ms...`
            );
            await sleep(retryDelayMs * (attempt + 1)); // incremental backoff
            continue;
          }

          // last attempt but empty -> still return empty array (so UI can show "no flights")
          return {
            date: d,
            apiDate,
            flights: Array.isArray(res.data) ? res.data : [],
          };
        } catch (err: any) {
          // log the error
          console.error(
            `    └─ Error fetching ${apiDate} attempt ${attempt + 1}:`,
            err?.message ?? err
          );

          if (attempt < retries) {
            // wait and retry
            await sleep(retryDelayMs * (attempt + 1));
            continue;
          }

          // final failure -> return empty flights (and allow overall handler to know)
          return { date: d, apiDate, flights: [] };
        }
      }

      // fallback (shouldn't reach)
      return { date: d, apiDate, flights: [] };
    },
    [airport, retries, retryDelayMs]
  );

  const fetchAll = useCallback(async () => {
    if (!dates?.length || !airport) {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      console.log("👉 TOTAL DATES RECEIVED:", dates.length);
      console.log("👉 DATES:", dates);

      const results: FlightGroup[] = [];

      // process dates in batches to avoid spamming server
      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        console.log(
          `Processing batch ${Math.floor(i / batchSize) + 1}:`,
          batch
        );

        // map batch to promises
        const promises = batch.map((d) => fetchForDate(d));

        // wait all in this batch
        const batchResults = await Promise.all(promises);

        // push to results preserving original order
        results.push(...batchResults);

        // small pause between batches to be gentle
        if (i + batchSize < dates.length) {
          await sleep(200); // short throttle (200ms)
        }
      }
      setData(results);

      // debug log
      results.forEach((item) => {
        console.log(
          `${item.date} (${item.apiDate}) — ${item.flights.length} flights`
        );
      });
    } catch (e) {
      console.error("MULTI DATE FLIGHT ERROR", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dates, airport, batchSize, fetchForDate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, refetch: fetchAll };
};
