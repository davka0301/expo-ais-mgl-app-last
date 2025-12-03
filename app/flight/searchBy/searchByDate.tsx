import { useAllFlightDate } from "@/hooks/useAllFlightDate";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Flight() {
  const params = useLocalSearchParams();

  // Params parse
  const rawDates = Array.isArray(params.dates) ? params.dates[0] : params.dates;
  const dates: string[] = rawDates ? JSON.parse(rawDates) : [];

  const airport = Array.isArray(params.airportCode)
    ? params.airportCode[0]
    : params.airportCode ?? "";

  const { data, loading } = useAllFlightDate(dates, airport);

  // ⬇️ Date-үүдийг бага → их рүү эрэмбэлэх
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Нийт flight тоо
  const totalFlights = data.reduce((sum, d) => sum + d.flights.length, 0);

  if (loading || data.length !== dates.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={"red"} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Selected Days: {data.length}</Text>
        <Text style={styles.summaryText}>Total Flights: {totalFlights}</Text>
      </View>
      {/* Day-by-day flights */}
      {sortedData.map((group) => (
        <View key={group.date} style={styles.card}>
          <Text style={styles.dateText}>
            {moment(group.date).format("DD-MMM-YYYY")} — {group.flights.length}{" "}
            flights
          </Text>

          {group.flights.map((f, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.flightText}>
                {f.company_abbr} — {f.dep_location} → {f.arr_location}
              </Text>
              <Text style={styles.timeText}>
                {f.takeoff_time} → {f.landing_time}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  summaryBox: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  summaryText: { fontSize: 16, fontWeight: "600" },

  card: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateText: { fontSize: 17, fontWeight: "700", marginBottom: 10, color: "red" },

  item: {
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#d1d5db",
  },
  flightText: { fontSize: 15, fontWeight: "500" },
  timeText: { fontSize: 14, color: "#6b7280" },
});
