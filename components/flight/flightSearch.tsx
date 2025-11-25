// components/flight/FlightSearch.tsx

import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
// useResponsiveSize-ийн кодыг харуулаагүй тул dummy hook үүсгэсэн.
import Svg, {
  ClipPath,
  Defs,
  Path,
  Rect,
  Circle,
  FeDropShadow,
  Filter,
  FeOffset,
  FeGaussianBlur,
  FeFlood,
  FeComposite,
  FeMerge,
  FeMergeNode,
} from "react-native-svg";
import { Colors } from "../../constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";

// NOTE: useResponsiveSize hook-ийн кодыг харуулаагүй тул загвар үүсгэв.

const FlightSearch = () => {
  const { width, height } = useResponsiveSize();

  const cardWidth = width * 0.95;
  const radius = 30;
  const cardHeight = cardWidth * 0.7;
  const notch = width * 0.04;
  const a = 2;

  // Path commands:
  const path = `

  M0,${radius}

  Q0,0 ${radius},0

  L${cardWidth - radius},0

  Q${cardWidth},0 ${cardWidth},${radius}

  L${cardWidth},${cardHeight / a - notch}

  A${notch},${notch} 0 1,0 ${cardWidth},${cardHeight / a + notch}

  L${cardWidth},${cardHeight - radius}

  Q${cardWidth},${cardHeight} ${cardWidth - radius},${cardHeight}

  L${radius},${cardHeight}

  Q0,${cardHeight} 0,${cardHeight - radius}

  L0,${cardHeight / a + notch}

  A${notch},${notch} 0 1,0 0,${cardHeight / a - notch}

  Z

`;

  return (
    <View style={[styles.header, { width: cardWidth }]}>
      <Svg width={cardWidth} height={cardHeight}>
        <Defs>
          <ClipPath id="ticketClip">
            <Path d={path} />
          </ClipPath>
          <Filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <FeFlood floodColor="#000000" floodOpacity="0.15" result="flood" />
            <FeGaussianBlur in="flood" stdDeviation="5" result="blurred" />
            <FeOffset in="blurred" dx="0" dy="5" result="offset" />
            <FeComposite in="SourceGraphic" in2="offset" operator="over" />
          </Filter>
          <Filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
            <FeOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
            <FeGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
            <FeFlood
              floodColor="#000000"
              floodOpacity="0.2"
              result="theColor"
            />
            <FeComposite
              result="shadowColor"
              in="theColor"
              in2="blurOut"
              operator="in"
            />
            <FeMerge>
              <FeMergeNode in="shadowColor" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        <Rect
          width={cardWidth}
          height={cardHeight}
          fill={Colors.background}
          stroke={Colors.background}
          clipPath="url(#ticketClip)"
          strokeWidth="1"
          filter="url(#boxShadow)"
        />
      </Svg>
      <View style={[styles.absoluteOverlay, { width: cardWidth }]}>
        <View style={styles.searchHeader}>
          <Text style={{ fontSize: 18, fontFamily: "Bold" }}>
            Search for Flights
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={"Enter here"}
              placeholderTextColor="#A9A9A9" // Саарал өнгө
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FlightSearch;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    alignItems: "center",
  },
  absoluteOverlay: {
    position: "absolute",
    // padding: 20, // Энэ утгаас болж position таарч өгөхгүй байсан
  },
  searchHeader: {
    top: 25,
    alignItems: "center",
  },
  inputWrapper: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    marginTop: 16,
    marginHorizontal: 50,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center", // Зургийн дагуу текстийг төвлөрүүлэх
  },
});
