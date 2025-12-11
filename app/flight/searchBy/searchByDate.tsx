import { Colors } from "@/constants/color";
import { useLanguage } from "@/context/LanguageContext";
import { useAllFlightDate } from "@/hooks/useAllFlightDate";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { ClipPath, Defs, Line, Path, Rect } from "react-native-svg";

export default function Flight() {
  const router = useRouter();
  const { width, headerTop } = useResponsiveSize();
  const { language, toggleLanguage } = useLanguage();
  const params = useLocalSearchParams();

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

  // Params parse
  const rawDates = Array.isArray(params.dates) ? params.dates[0] : params.dates;
  const dates: string[] = rawDates ? JSON.parse(rawDates) : [];

  const airport = Array.isArray(params.airportCode)
    ? params.airportCode[0]
    : params.airportCode ?? "";

  const { data, loading } = useAllFlightDate(dates, airport);

  // ⬇️ Date-үүдийг бага → их рүү эрэмбэлэх
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Нийт flight тоо
  const totalFlights = data.reduce((sum, d) => sum + d.flights.length, 0);

  if (loading || data.length !== dates.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={"red"} />
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
      <ScrollView>
        {/* Day-by-day flights */}
        {sortedData.map((group) => (
          <View>
            <Text style={styles.dateText}>
              {moment(group.date).format("DD-MMM-YYYY")}
            </Text>

            {group.flights.map((f, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Text style={{ textAlign: "right" }}>{f.dep_ad}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.codeIata}>{f.iata}</Text>
                      <Text style={styles.time}>{f.takeoff_time}</Text>
                    </View>
                  </View>

                  <View style={styles.centerCard}>
                    {/* <Image
                      source={{ uri: f.company_logo }}
                      style={styles.logo}
                    /> */}
                  </View>

                  <View style={styles.right}>
                    <Text>{f.arr_ad}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.time}>{f.landing_time}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              f.status_en === "DEPARTED"
                                ? "#4CAF50"
                                : "#1E88E5",
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>{f.status_en}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // logo: {
  //   width: 35,
  //   height: 35,
  //   resizeMode: "contain",
  // },
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

  time: { fontSize: 16, color: "#555" },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "red",
    paddingHorizontal: 20,
  },
});
