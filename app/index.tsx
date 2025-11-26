import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router } from "expo-router";

const Welcome = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 150,
      }}
    >
      <Text>Welcome</Text>
      <TouchableOpacity onPress={() => router.push("/(tabs)/flight")}>
        <Text>START</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
