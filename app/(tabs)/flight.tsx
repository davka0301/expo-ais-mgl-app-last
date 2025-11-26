import FlightHeader from "@/components/flight/flightHeader";
import { useLanguage } from "@/context/LanguageContext";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAirport } from "@/hooks/useAirportData";
import SearchBy from "@/components/flight/searchBy";
import Searchflight from "@/components/flight/searchflight";
import { Colors } from "@/constants/color";
import moment from "moment";

const Flight = () => {
  const today = moment().format("DD-MMM-YYYY");
  const [selAirport, setSelAirport] = useState("ZMCK");
  const { airport, loading } = useAirport(selAirport);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style="dark" />
      <FlightHeader />
      <Searchflight
        today={today}
        onAirport={airport}
        selectedAirport={selAirport}
        onSelectAirport={(code) => setSelAirport(code)}
      />
      <SearchBy />
    </ScrollView>
  );
};

export default Flight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    // ScrollView-н контентийн доод талд зай үүсгэхэд ашигтай.
    paddingBottom: 200,
  },
});
