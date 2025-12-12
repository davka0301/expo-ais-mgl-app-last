import FlightHeader from "@/components/flight/FlightHeader/FlightHeader";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAirport } from "@/hooks/useAirportData";
import Searchflight from "@/components/flight/SearchFilter/SearchFilter";
import { Colors } from "@/constants/color";
import moment from "moment";
import { useResponsive } from "@/hooks/useResponsive";
import SearchBy from "@/components/flight/SearchByList/SearchBy";

const Flight = () => {
  const { rw, rh, rf, cardWidth } = useResponsive();
  const today = moment().format("DD-MMM-YYYY");
  const [selAirport, setSelAirport] = useState("ZMCK");
  const { airport } = useAirport(selAirport);

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

      <View style={{ marginTop: rh(250), paddingHorizontal: rh(16) }}>
        <SearchBy selectedAirport={selAirport} />
      </View>
    </View>
  );
};

export default Flight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
