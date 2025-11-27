import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { useNotamWishlist } from "@/constants/notamBookMart";
import { useLanguage } from "@/context/LanguageContext";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { Colors } from "@/constants/color";
import { NotamCat } from "@/hooks/interface/notamCat";
interface Props {
  onSeries: NotamCat[];
  selectedSerie: string;
  onSelectSerie: (code: string) => void;
}

const NotamHeader = ({ onSeries, selectedSerie, onSelectSerie }: Props) => {
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();

  const { width, headerNotamTop } = useResponsiveSize();
  return (
    <View style={styles.header}>
      <ImageBackground
        source={require("@/assets/images/notam.jpg")}
        style={[styles.bg, { width, height: headerNotamTop }]}
        resizeMode="stretch"
      >
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
              <Ionicons
                name="bookmarks-outline"
                size={18}
                color={Colors.white}
              />
              {/* COUNT BADGE */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.langCircle}
              onPress={toggleLanguage}
            >
              <Text style={{ fontWeight: "600", color: Colors.text_white }}>
                {language}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SERIES */}
        <View style={styles.seriesWrapper}>
          <FlatList
            horizontal
            data={onSeries}
            keyExtractor={(item) => item.cat_code}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.seriesContainer}
            renderItem={({ item }) => {
              const isActive = item.cat_code === selectedSerie;
              return (
                <TouchableOpacity
                  style={[
                    styles.seriesItem,
                    isActive ? styles.seriesActive : styles.series,
                  ]}
                  onPress={() => onSelectSerie(item.cat_code)}
                >
                  <Text
                    style={[
                      styles.seriesText,
                      isActive && styles.seriesTextActive,
                    ]}
                  >
                    {language === "EN" ? item.cat_name_en : item.cat_name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default NotamHeader;

const styles = StyleSheet.create({
  header: {
    alignSelf: "center",
    width: "100%",
  },
  bg: {
    justifyContent: "flex-start",
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
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  langCircle: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
  },

  // SERIEs
  seriesWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 60,
  },

  seriesContainer: {
    width: "80%", // дэлгэцийн 75%
    justifyContent: "space-evenly",
  },

  seriesItem: {
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  series: {
    backgroundColor: Colors.grey,
  },
  seriesActive: {
    backgroundColor: Colors.primary,
  },

  seriesText: {
    color: Colors.text_dark,
    fontSize: 14,
    fontWeight: "500",
  },
  seriesTextActive: {
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
