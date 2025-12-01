import FlightHeader from "@/components/flight/flightHeader";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAirport } from "@/hooks/useAirportData";
import SearchBy from "@/components/flight/searchBy/searchBy";
import Searchflight from "@/components/flight/searchflight";
import { Colors } from "@/constants/color";
import moment from "moment";

const Flight = () => {
  const today = moment().format("DD-MMM-YYYY");
  const [selAirport, setSelAirport] = useState("ZMCK");
  const { airport, loading } = useAirport(selAirport);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlightHeader />
      <Searchflight
        today={today}
        onAirport={airport}
        selectedAirport={selAirport}
        onSelectAirport={(code) => setSelAirport(code)}
      />
      <SearchBy />
    </View>
  );
};

export default Flight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  //
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
