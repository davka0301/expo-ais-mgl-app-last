import FlightHeader from "@/components/flight/flightHeader";
import FlightSearch from "@/components/flight/flightSearch";
import { useLanguage } from "@/context/LanguageContext";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Flight = () => {
  const { language } = useLanguage();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <FlightHeader />
      <FlightSearch />
      <Text>{language === "EN" ? "sain bna uu" : "сайн бна уу"}</Text>
    </View>
  );
};

export default Flight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
