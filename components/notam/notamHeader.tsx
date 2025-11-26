import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { useNotamWishlist } from "@/constants/notamBookMart";
import { useLanguage } from "@/context/LanguageContext";

const NotamHeader = ({
  series,
  setSeries,
}: {
  series: "a" | "c";
  setSeries: (value: "a" | "c") => void;
}) => {
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();
  // const { wishlist } = useNotamWishlist();
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Image
          source={require("@/assets/images/ais.png")}
          style={styles.aisLogo}
        />
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.langCircle}
            onPress={() => router.push("/notam/bookmark")}
          >
            <Ionicons name="bookmarks-outline" size={18} />
            {/* COUNT BADGE */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.langCircle} onPress={toggleLanguage}>
            <Text style={{ fontWeight: "600" }}>{language}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* SERIES */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segment, series === "a" && styles.activeSegment]}
          onPress={() => setSeries("a")}
        >
          <Text
            style={[
              styles.segmentText,
              series === "a" && styles.activeSegmentText,
            ]}
          >
            A SERIES
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, series === "c" && styles.activeSegment]}
          onPress={() => setSeries("c")}
        >
          <Text
            style={[
              styles.segmentText,
              series === "c" && styles.activeSegmentText,
            ]}
          >
            C SERIES
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotamHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: "flex-start",
    backgroundColor: "#C2C2C2",
    width: "100%",
    height: 150,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 25,
  },
  aisLogo: {
    width: 50,
    aspectRatio: 1273 / 615,
    height: undefined,
  },
  date: {
    fontSize: 16,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langCircle: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
  },

  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSegment: {
    backgroundColor: "#000",
    margin: 5,
    borderRadius: 8,
  },
  segmentText: {
    color: "#000",
    fontWeight: "bold",
  },
  activeSegmentText: {
    color: "#fff",
  },

  // NOTAM BADGE
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
