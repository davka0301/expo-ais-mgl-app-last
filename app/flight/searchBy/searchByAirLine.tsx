import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useAllFlightLineSearch } from "@/hooks/airLine/useAllFlightAirLineSearch";
import { useLocalSearchParams } from "expo-router";

const SearchByAirLine = () => {
  const { selectedAirport, today, company } = useLocalSearchParams();
  const { data, loading } = useAllFlightLineSearch(
    today as string,
    selectedAirport as string,
    company as string
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        {company} - Flights
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.flight_id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "white",
              borderRadius: 8,
              marginBottom: 10,
              elevation: 2,
            }}
          >
            <Text>Flight: {item.flight_id}</Text>
            <Text>From: {item.dep_location}</Text>
            <Text>To: {item.arr_location}</Text>
            <Text>
              Time: {item.takeoff_time} → {item.landing_time}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchByAirLine;

const styles = StyleSheet.create({});
