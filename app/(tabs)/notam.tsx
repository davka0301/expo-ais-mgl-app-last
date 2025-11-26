import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import NotamHeader from "@/components/notam/notamHeader";
import { Colors } from "@/constants/color";
import { StatusBar } from "expo-status-bar";
import useNotamData from "@/hooks/useNotamData";

const Notam = () => {
  const [series, setSeries] = useState<"a" | "c">("a");
  const { notamData, loading, refetch } = useNotamData(series);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NotamHeader series={series} setSeries={setSeries} />
    </View>
  );
};

export default Notam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
