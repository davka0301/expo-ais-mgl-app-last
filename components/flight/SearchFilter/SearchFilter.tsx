import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../../constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { AirportProps } from "@/hooks/interface/airport";
import { useRouter } from "expo-router";
import { SEARCH_FILTER } from "@/constants/searchFilter";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsive } from "@/hooks/useResponsive";

interface Props {
  today: string;
  onAirport: AirportProps[];
  selectedAirport: string;
  onSelectAirport: (code: string) => void;
}

const Searchflight = ({
  today,
  onAirport,
  selectedAirport,
  onSelectAirport,
}: Props) => {
  const { rw, rh, rf, cardWidth } = useResponsive();
  const router = useRouter();
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("1");

  // TICKET CARD
  const CARD_WIDTH = cardWidth * 0.93;
  const CARD_HEIGHT = rh(270);
  const RADIUS = 25;
  const CUTOUT_RADIUS = 12;
  const CUTOUT_CENTER_Y = CARD_HEIGHT / 2;

  // PATH COMMANDs:
  const getPathD = () => {
    return `
    M ${RADIUS},0
    L ${CARD_WIDTH - RADIUS},0
    A ${RADIUS},${RADIUS} 0 0 1 ${CARD_WIDTH},${RADIUS}
    L ${CARD_WIDTH},${CUTOUT_CENTER_Y - CUTOUT_RADIUS}
    A ${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 0 0 ${CARD_WIDTH},${
      CUTOUT_CENTER_Y + CUTOUT_RADIUS
    }
    L ${CARD_WIDTH},${CARD_HEIGHT - RADIUS}
    A ${RADIUS},${RADIUS} 0 0 1 ${CARD_WIDTH - RADIUS},${CARD_HEIGHT}
    L ${RADIUS},${CARD_HEIGHT}
    A ${RADIUS},${RADIUS} 0 0 1 0,${CARD_HEIGHT - RADIUS}
    L 0,${CUTOUT_CENTER_Y + CUTOUT_RADIUS}
    A ${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 0 0 0,${
      CUTOUT_CENTER_Y - CUTOUT_RADIUS
    }
    L 0,${RADIUS}
    A ${RADIUS},${RADIUS} 0 0 1 ${RADIUS},0
    Z
  `;
  };

  const resetDates = () => {
    setSearch("");
  };
  const handleSearch = () => {
    router.push({
      pathname: "/flight/searchFilter/searchFilter",
      params: {
        query: search,
        date: today.toLowerCase(),
        airport: selectedAirport,
        filter: activeFilter,
      },
    });
    resetDates();
  };

  const styles = StyleSheet.create({
    ticketCard: {
      position: "absolute",
      alignSelf: "center",
      alignItems: "center",
      shadowColor: "#d9d9d9",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 30, // Android shadow
      backgroundColor: "transparent",
    },
    searchHeader: {},

    // INPUT
    inputWrapper: {
      height: rh(40),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: Colors.dark,
      borderRadius: 15,
      marginTop: 16,
      width: CARD_WIDTH * 0.9,
    },
    input: {
      flex: 1,
      fontSize: rf(16),
      color: "#333",
      textAlign: "center",
    },

    // ----- Horizontal Airport Items -----

    airportRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: CARD_WIDTH * 0.9,
      marginTop: 15,
    },
    airportItem: {
      flex: 1,
      height: rh(45),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
      marginHorizontal: 5,
    },

    flatListContent: { justifyContent: "center", alignItems: "center" },
    // airportItem: {
    //   width: 150,
    //   height: 50,
    //   justifyContent: "center",
    //   alignItems: "center",
    //   borderRadius: 30,
    //   marginHorizontal: 6,
    //   marginTop: 15,
    // },

    airportText: {
      fontSize: 14,
      fontFamily: "Bold",
    },
    // ------------------FILTER-------------------
    filter: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      alignSelf: "center",
      marginTop: 10,
    },
    filterLabel: {
      fontSize: 14,
      fontFamily: "Bold",
    },

    dateLabel: {
      fontSize: 14,
      fontFamily: "Bold",
    },

    // -------------------FILTER CHIP---------------
    chipRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
      width: "90%",
      justifyContent: "space-between",
    },

    chip: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 18,
    },

    chipText: {
      fontSize: 13,
      fontFamily: "Medium",
    },
    // ---------------------SEARCH BTN--------------
    searchBtn: {
      width: "90%",
      height: 48,
      backgroundColor: "#e5e5e5",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 18,
    },

    searchBtnText: {
      fontSize: 16,
      fontFamily: "Bold",
      color: "#333",
    },
  });

  return (
    <View
      style={[styles.ticketCard, { width: CARD_WIDTH, paddingTop: rh(90) }]}
    >
      <Svg
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      >
        <Path
          d={getPathD()}
          fill="#FFFFFF"
          stroke={Colors.dark}
          strokeWidth="0.5"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          marginTop: rh(110),
          width: CARD_WIDTH,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: rf(16), fontFamily: "Bold" }}>
          {language === "EN" ? "Search for Flights" : "Нислэг хайх"}
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={language === "EN" ? "Enter here" : "Хайлт"}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#A9A9A9"
          />
        </View>
        {/* AIRPORT ROW */}
        <View style={styles.airportRow}>
          {onAirport.map((item) => {
            const isActive = item.airport_code === selectedAirport;

            return (
              <TouchableOpacity
                key={item.airport_code}
                activeOpacity={0.8}
                style={[
                  styles.airportItem,
                  {
                    backgroundColor: isActive ? Colors.primary : Colors.grey,
                  },
                ]}
                onPress={() => onSelectAirport(item.airport_code)}
              >
                <Text
                  style={[
                    styles.airportText,
                    { color: isActive ? Colors.white : Colors.text_grey },
                  ]}
                >
                  {language === "EN" ? item.airport_name_en : item.airport_name}
                </Text>

                <Text
                  style={{
                    fontSize: 8,
                    color: isActive ? Colors.white : Colors.text_grey,
                  }}
                >
                  ОЛОН УЛСЫН НИСЭХ БУУДАЛ
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Searchflight;
