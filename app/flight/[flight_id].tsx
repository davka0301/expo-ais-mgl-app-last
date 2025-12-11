import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AllFlightProps } from "@/hooks/interface/allFlight";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/color";
import Svg, { ClipPath, Defs, Line, Path, Rect } from "react-native-svg";

const FlightId = () => {
  const router = useRouter();
  const { width, headerTop } = useResponsiveSize();
  const { language, toggleLanguage } = useLanguage();
  const { flightData: flightDataString } = useLocalSearchParams();

  const CARD_WIDTH = width * 0.95;
  const CARD_HEIGHT = 130;
  const RADIUS = 15;
  const CUTOUT_RADIUS = 10;
  const a = 2;

  // 🚀 JSON string-ийг FlightDetails объект болгож хувиргах
  const flight: AllFlightProps | undefined = useMemo(() => {
    if (!flightDataString || typeof flightDataString !== "string") {
      return undefined;
    }
    try {
      // Expo Router params нь string эсвэл string[] байж болно. String-ийг сонгох.
      const dataString = Array.isArray(flightDataString)
        ? flightDataString[0]
        : flightDataString;
      return JSON.parse(dataString) as AllFlightProps;
    } catch (e) {
      console.error("Error parsing flight data:", e);
      return undefined;
    }
  }, [flightDataString]);

  const path = `
    M0,${RADIUS}
    Q0,0 ${RADIUS},0
    L${CARD_WIDTH - RADIUS},0
    Q${CARD_WIDTH},0 ${CARD_WIDTH},${RADIUS}
    L${CARD_WIDTH},${CARD_HEIGHT / a - CUTOUT_RADIUS}
    A${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 1,0 ${CARD_WIDTH},${
    CARD_HEIGHT / a + CUTOUT_RADIUS
  }
    L${CARD_WIDTH},${CARD_HEIGHT - RADIUS}
    Q${CARD_WIDTH},${CARD_HEIGHT} ${CARD_WIDTH - RADIUS},${CARD_HEIGHT}
    L${RADIUS},${CARD_HEIGHT}
    Q0,${CARD_HEIGHT} 0,${CARD_HEIGHT - RADIUS}
    L0,${CARD_HEIGHT / a + CUTOUT_RADIUS}
    A${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 1,0 0,${
    CARD_HEIGHT / a - CUTOUT_RADIUS
  }
    Z
  `;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/chingiss-khaan-airport.jpg")}
        style={{ width: width, height: headerTop }}
        resizeMode="cover"
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={30} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={toggleLanguage}>
            <Text style={{ fontWeight: "600", color: Colors.text_white }}>
              {language}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* SVG TICKET HEADER */}
      <View style={[styles.headerCard, { width: CARD_WIDTH }]}>
        <Svg width={CARD_WIDTH} height={CARD_HEIGHT}>
          <Defs>
            <ClipPath id="ticketClip">
              <Path d={path} />
            </ClipPath>
          </Defs>

          <Rect
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            fill={Colors.white}
            clipPath="url(#ticketClip)"
            stroke="#e5e7eb"
          />

          <Line
            x1="0"
            y1={CARD_HEIGHT / 2}
            x2={CARD_WIDTH}
            y2={CARD_HEIGHT / 2}
            stroke="#000"
            strokeDasharray="8"
            strokeWidth="1.2"
            clipPath="url(#ticketClip)"
          />
        </Svg>

        <View style={[styles.ticketContent]}>
          <Text style={styles.airlineName}>
            SEARCH RESULT:{flight?.flight_id}
          </Text>
          <Text style={styles.airlineTitle}>Miat</Text>
        </View>
      </View>
    </View>
  );
};

export default FlightId;

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 25,
    marginVertical: 50,
  },

  roundButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  headerCard: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
  },

  ticketContent: {
    position: "absolute",
    top: 10,
    width: "100%",
    alignItems: "center",
  },

  airlineName: {
    fontSize: 14,
    fontWeight: "700",
  },

  airlineTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
});
