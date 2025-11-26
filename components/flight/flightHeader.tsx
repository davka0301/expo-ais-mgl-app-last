import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/context/LanguageContext";
import { Colors } from "@/constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useRouter } from "expo-router";

const FlightHeader = () => {
  const router = useRouter();
  const { width, headerTop } = useResponsiveSize();
  const { language, toggleLanguage } = useLanguage();
  return (
    <View style={styles.header}>
      <ImageBackground
        source={require("@/assets/images/chingiss-khaan-airport.jpg")}
        style={{ width: width, height: headerTop }}
        resizeMode="cover"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 25,
            marginVertical: 50,
          }}
        >
          <View>
            <Image
              source={require("@/assets/images/ais.png")}
              style={styles.aisLogo}
            />
          </View>

          <View style={styles.bar}>
            <TouchableOpacity
              onPress={() => router.push("/flight/bookmark/bookmark")}
              style={styles.roundButton}
            >
              <Ionicons
                name="bookmark-outline"
                size={22}
                color={Colors.text_white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
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

export default FlightHeader;

const styles = StyleSheet.create({
  header: { flex: 1 },

  aisLogo: {
    width: 50,
    aspectRatio: 1273 / 615,
    height: undefined,
  },
  roundButton: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
