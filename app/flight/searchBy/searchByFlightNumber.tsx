import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useAllFlightNumber } from "@/hooks/useAllFlightNumberData";
import { useLocalSearchParams } from "expo-router";

const SearchByFlightNumber = () => {
  const { selectedAirport, search } = useLocalSearchParams();
  const today = new Date().toISOString().split("T")[0];
  const { data, loading } = useAllFlightNumber(
    today,
    selectedAirport as string,
    search as string
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flight Number Search</Text>

      {loading && <ActivityIndicator size="large" />}

      {!loading && data.length === 0 && (
        <Text style={styles.noData}>No flights found</Text>
      )}

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.flight}>
              {item.company_abbr} {item.flight_type}
            </Text>
            <Text>
              {item.dep_location} → {item.arr_location}
            </Text>
            <Text>Status: {item.status_en}</Text>
            <Text>
              Time: {item.takeoff_time} - {item.landing_time}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchByFlightNumber;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  noData: { marginTop: 30, textAlign: "center", color: "#999" },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  flight: { fontWeight: "bold", fontSize: 16 },
});
