import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useLanguage } from "@/context/LanguageContext";
import { Colors } from "@/constants/color";

const AipSearchHeader = () => {
  const { language, toggleLanguage } = useLanguage();
  const { width, headerNotamTop } = useResponsiveSize();
  return (
    <View style={styles.header}>
      <ImageBackground
        source={require("@/assets/images/notam.jpg")}
        style={[styles.bg, { height: headerNotamTop }]}
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
              onPress={toggleLanguage}
            >
              <Text style={{ fontWeight: "600", color: Colors.text_white }}>
                {language}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AipSearchHeader;

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
    // paddingHorizontal: 25,
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
});
