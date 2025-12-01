// app/flight/searchBy/searchByDate.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { useAllFlightDate } from "@/hooks/useAllFlightDate";
import { AllFlightProps } from "@/hooks/interface/allFlight";
import { Colors } from "@/constants/color";

export default function SearchByDate() {
  const params = useLocalSearchParams();

  // params.dates нь JSON.stringify(selectedDates) гэж дамжуулсан тул эндээс авна
  const rawDates = Array.isArray(params.dates) ? params.dates[0] : params.dates;
  const dates: string[] = rawDates ? JSON.parse(rawDates) : [];

  const airport = params.airportCode;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        ✈ Airport: {airport}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Сонгогдсон Огноонууд
      </Text>

      {dates.length === 0 ? (
        <Text>No dates selected</Text>
      ) : (
        dates.map((date, idx) => (
          <DateFlight
            key={`${date}-${idx}`}
            date={date}
            airport={airport as string}
          />
        ))
      )}
    </ScrollView>
  );
}

const DateFlight: React.FC<{ date: string; airport: string }> = ({
  date,
  airport,
}) => {
  const apiDate = moment(date, "YYYY-MM-DD")
    .format("DD-MMM-YYYY")
    .toUpperCase();
  const { data, loading } = useAllFlightDate(apiDate, airport);

  const sortedData = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a) => {
      const aNum = parseInt(a.iata?.replace(/\D/g, ""));
      return aNum;
    });
  }, [data]);
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
        📅 {moment(date).format("YYYY-MM-DD")} —{" "}
        {loading ? "Loading..." : `${data.length} flights`}
      </Text>

      {loading ? (
        <ActivityIndicator size="small" />
      ) : data.length === 0 ? (
        <Text>No flights found</Text>
      ) : (
        sortedData.map((flight: AllFlightProps) => {
          return (
            <TouchableOpacity>
              <Text>
                • {flight.iata} → {flight.dep_ad_en} — {flight.arr_ad_en}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark,
    borderStyle: "dashed",
    marginBottom: 8,
  },
});
