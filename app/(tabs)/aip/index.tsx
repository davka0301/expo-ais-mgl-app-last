import AipHeader from "@/components/aip/aipHeader";
import AipContent from "@/components/aip/aipContent";
import { Colors } from "@/constants/color";
import React from "react";
import { StyleSheet, View } from "react-native";

const AIP = () => {
  return (
    <View style={styles.container}>
      <AipHeader />
      <AipContent />
    </View>
  );
};

export default AIP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
