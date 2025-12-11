import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAllFlightNumber } from "@/hooks/useAllFlightNumberData";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/color";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { Ionicons } from "@expo/vector-icons";
import Svg, { ClipPath, Defs, Line, Path, Rect } from "react-native-svg";

const SearchByFlightNumber = () => {
  const router = useRouter();
  const { width, headerTop } = useResponsiveSize();
  const { language, toggleLanguage } = useLanguage();
  const { selectedAirport, search } = useLocalSearchParams();
  const today = new Date().toISOString().split("T")[0];
  const { data, loading } = useAllFlightNumber(
    today,
    selectedAirport as string,
    search as string
  );

  const CARD_WIDTH = width * 0.95;
  const CARD_HEIGHT = 130;
  const RADIUS = 15;
  const CUTOUT_RADIUS = 10;
  const a = 2;

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
          {/* <Text style={styles.airlineName}>SEARCH RESULT:{query}</Text>
          <Text style={styles.airlineTitle}>Miat</Text> */}
        </View>
      </View>

      {/*  */}

      {/* FLIGHT SCHEDULE TITLE */}
      <Text style={[styles.listTitle, { marginTop: CARD_HEIGHT - 20 }]}>
        {language ? "Flight Schedule" : "Тогтмол нислэг"}
      </Text>

      {!loading && data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {language ? "No flights found" : "Илэрц олдсонгүй"}
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Code</Text>
            <Text style={styles.headerText}>Departure</Text>
            <Text style={styles.headerText}>Arrival</Text>
            <Text style={styles.headerText}>Status</Text>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) =>
              item.flight_id && item.flight_id !== "0"
                ? item.flight_id
                : item.schedule_id.toString()
            }
            renderItem={({ item }) => {
              const flightDataString = JSON.stringify(item);
              return (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/flight/[flight_id]",
                      params: {
                        flight_id: item.flight_id,
                        flightData: flightDataString,
                      },
                    })
                  }
                >
                  <View style={styles.row}>
                    <Text style={styles.code}>{item.iata}</Text>

                    <View style={styles.col}>
                      <Text style={styles.city}>{item.dep_ad_code}</Text>
                      <Text style={styles.time}>{item.takeoff_time}(UTC)</Text>
                    </View>

                    <View style={styles.col}>
                      <Text style={styles.city}>{item.arr_ad_code}</Text>
                      <Text style={styles.time}>{item.landing_time}(UTC)</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status_en === "DEPARTED"
                              ? "#4CAF50"
                              : "#1E88E5",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status_en}</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.flight}>
              {item.company_abbr} {item.flight_type}
            </Text>
            <Text>
              {item.dep_location} → {item.arr_location}
            </Text>
            <Text>Status: {item.status_en}</Text>
            <Text>
              Time: {item.takeoff_time} - {item.landing_time}
            </Text>
          </View>
        )}
      /> */}
    </View>
  );
};

export default SearchByFlightNumber;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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

  saveButton: {
    marginTop: 5,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  saveButtonText: { color: "#fff", fontWeight: "600" },

  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 20,
    marginBottom: 10,
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  headerText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  code: { flex: 1, color: Colors.primary, fontWeight: "700" },

  col: {
    flex: 1,
  },

  city: { fontWeight: "700" },
  time: { fontSize: 12, color: "#555" },

  statusBadge: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: "center",
  },

  statusText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  divider: {
    height: 1,
    backgroundColor: Colors.grey,
    marginLeft: 20,
    marginRight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#999", fontFamily: "Medium" },
});
