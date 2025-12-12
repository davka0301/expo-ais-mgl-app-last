import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/context/LanguageContext";
import { Colors } from "@/constants/color";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { useRouter } from "expo-router";
import { useResponsive } from "@/hooks/useResponsive";

const FlightHeader = () => {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const { rw, rh, rf, cardWidth } = useResponsive();

  // STYLES
  const styles = StyleSheet.create({
    header: { flex: 1 },

    aisLogo: {
      width: rh(50),
      aspectRatio: 1273 / 615,
      height: undefined,
    },
    roundButton: {
      width: rh(28),
      height: rh(28),
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

  return (
    <View style={{ width: cardWidth, height: rh(150) }}>
      <ImageBackground
        source={require("@/assets/images/chingiss-khaan-airport.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: rw(20),
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
                size={rh(18)}
                color={Colors.text_white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={toggleLanguage}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: rf(14),
                  color: Colors.text_white,
                }}
              >
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
