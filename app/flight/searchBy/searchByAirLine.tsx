import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAllFlightLineSearch } from "@/hooks/airLine/useAllFlightAirLineSearch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import Svg, { ClipPath, Defs, Line, Path, Rect } from "react-native-svg";

const SearchByAirLine = () => {
  const router = useRouter();
  const { width, headerTop } = useResponsiveSize();
  const { language, toggleLanguage } = useLanguage();
  const { selectedAirport, today, company } = useLocalSearchParams();
  const { data, loading } = useAllFlightLineSearch(
    today as string,
    selectedAirport as string,
    company as string
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              {data.length > 0 ? (
                <Text style={{ fontFamily: "Bold" }}>
                  {data[0].company_abbr}
                </Text>
              ) : (
                <Text></Text>
              )}

              <Text style={{ fontFamily: "Bold", fontSize: 16 }}>
                {company}
              </Text>
            </View>
            {data.length > 0 ? (
              <Image
                source={{ uri: data[0].company_logo }}
                style={{ width: 35, height: 35, resizeMode: "contain" }}
              />
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </View>

      {/* FLIGHT SCHEDULE TITLE */}
      <Text style={[styles.listTitle, { marginTop: CARD_HEIGHT - 20 }]}>
        {language ? "Flight Schedule" : "Тогтмол нислэг"}
      </Text>

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
        contentContainerStyle={{
          paddingBottom: 20,
        }}
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
              <View style={styles.item}>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Text style={{ textAlign: "right" }}>
                      {language === "EN" ? item.dep_ad_en : item.dep_ad}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.codeIata}>{item.iata}</Text>
                      <Text style={styles.time}>{item.takeoff_time}</Text>
                    </View>
                  </View>

                  <View style={styles.centerCard}></View>

                  <View style={styles.right}>
                    <Text>
                      {language === "EN" ? item.arr_ad_en : item.arr_ad}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.time}>{item.landing_time}</Text>

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
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default SearchByAirLine;

const styles = StyleSheet.create({
  item: {
    // paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cols: {
    flexDirection: "column",
  },
  left: {
    width: "40%",
  },

  codeIata: { flex: 1, color: Colors.primary, fontWeight: "700" },
  centerCard: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  dash: {},

  right: {
    width: "40%",
  },

  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 6,
  },

  statusText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  //
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
    paddingHorizontal: 30,
    width: "100%",
  },

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

  //
  card: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#999",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  flightNumber: {
    fontWeight: "600",
    color: "#0070C0",
  },

  statusBox: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  // statusText: {
  //   color: "white",
  //   fontWeight: "600",
  // },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  col: {
    flex: 1,
    alignItems: "center",
  },

  airport: {
    fontSize: 14,
    fontWeight: "600",
  },

  time: {
    fontSize: 14,
    marginTop: 3,
  },

  centerCol: {
    flex: 1,
    alignItems: "center",
  },

  // dash: {
  //   fontSize: 18,
  // },
});
