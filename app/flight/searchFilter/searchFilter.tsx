// app/searchFilter.tsx
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAllFlight } from "@/hooks/useAllFlightData";

const SearchFilter = () => {
  const { query, date, airport, filter } = useLocalSearchParams();
  console.log("ACTIVE FILTER FROM PARAMS:", filter);
  const { data, loading } = useAllFlight(
    String(date),
    String(airport),
    String(query),
    String(filter)
  );

  const isEmptyQuery = !query || query.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Search Result: {query || "—"}</Text>

      {loading && <ActivityIndicator size="large" />}

      {!loading && (isEmptyQuery || data.length === 0) ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isEmptyQuery ? "Please enter a search term" : "No results found"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.flight_id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.company}>{item.company}</Text>
              <Text>
                {item.dep_ad_en} → {item.arr_ad_en}
              </Text>
              <Text>
                {item.dep_time} - {item.landing_time}
              </Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 15, fontFamily: "Bold" },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginVertical: 8,
    elevation: 3,
  },
  company: { fontSize: 16, fontFamily: "Bold" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#999", fontFamily: "Medium" },
});
