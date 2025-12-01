import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const FlightNumberHeader = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40, // center нь overlap болгохгүй болгоно
        position: "relative",
      }}
    >
      {/* CENTER TITLE */}
      <Text
        style={{
          textAlign: "center",
          fontFamily: "InterMedium",
        }}
      >
        {language === "EN" ? "Flight number" : "Нислэгийн дугаар"}
      </Text>

      {/* RIGHT BUTTON */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          backgroundColor: "#d9d9d9",
          borderRadius: 30,
          paddingHorizontal: 10,
          paddingVertical: 4,
          elevation: 2,
        }}
        onPress={toggleLanguage}
      >
        <Text style={{ fontFamily: "InterMedium" }}>{language}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlightNumberHeader;

const styles = StyleSheet.create({});
