// components/flight/FlightSearch.tsx

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
import { Colors } from "../../constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { AirportProps } from "@/hooks/interface/airport";
import { useRouter } from "expo-router";
import { SEARCH_FILTER } from "@/constants/searchFilter";
import { useLanguage } from "@/context/LanguageContext";

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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("1");
  const { language } = useLanguage();

  const { width } = useResponsiveSize();
  const CARD_WIDTH = width * 0.95;
  const CARD_HEIGHT = 330;
  const RADIUS = 15;
  const CUTOUT_RADIUS = 15;
  const CUTOUT_CENTER_Y = CARD_HEIGHT / 2;

  // Path commands:
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
  return (
    <View style={[styles.header, { width: CARD_WIDTH }]}>
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
      <Svg
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
      >
        <Path fill={Colors.white} stroke={Colors.white} strokeWidth="1" />
      </Svg>
      <View style={[styles.absoluteOverlay, { width: CARD_WIDTH }]}>
        <View style={styles.searchHeader}>
          <Text
            style={{ fontSize: 18, fontFamily: "Bold", textAlign: "center" }}
          >
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

          <FlatList
            horizontal
            data={onAirport}
            keyExtractor={(item) => item.airport_code}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            renderItem={({ item, index }) => {
              const isActive = item.airport_code === selectedAirport;
              return (
                <TouchableOpacity
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
                    {language === "EN"
                      ? item.airport_name_en
                      : item.airport_name}
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
            }}
          />
          <View style={styles.filter}>
            <Text style={styles.filterLabel}>
              {language === "EN" ? "Filters" : "Шүүлтүүр"}
            </Text>

            <Text style={styles.filterLabel}>{today.toUpperCase()}</Text>
          </View>

          {/* FILTER CHIPS */}
          <View style={styles.chipRow}>
            {SEARCH_FILTER.map((chip) => {
              const isActive = chip.code === activeFilter;

              return (
                <TouchableOpacity
                  key={chip.code}
                  style={[
                    styles.chip,
                    isActive
                      ? { backgroundColor: Colors.primary }
                      : { backgroundColor: Colors.grey },
                  ]}
                  onPress={() => {
                    setActiveFilter(chip.code);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isActive
                        ? { color: "#fff" }
                        : { color: Colors.text_grey },
                    ]}
                  >
                    {language === "EN" ? chip.name : chip.name_mn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SEARCH BUTTON */}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>
              {language === "EN" ? "Search" : "Хайх"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Searchflight;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#d9d9d9",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 25, // Android shadow
    backgroundColor: "transparent",
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
    width: "90%",
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },

  // ----- Horizontal Airport Items -----

  flatListContent: { justifyContent: "center", alignItems: "center" },
  airportItem: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 6,
    marginTop: 15,
  },

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
