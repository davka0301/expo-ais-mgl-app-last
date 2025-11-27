import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Colors } from "@/constants/color";
import { useLanguage } from "@/context/LanguageContext";

import WebView from "react-native-webview";
import { useAipData } from "@/hooks/useAipData";

const AipContent = () => {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const { data } = useLocalSearchParams<{ data?: string }>();
  const { aipData: amdtData } = useAipData("amdt");

  let content: any = null;

  if (data) {
    try {
      content = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  }
  if (!data) {
    const pubDate = amdtData?.[0]?.pub_date ?? "-";
    const effDate = amdtData?.[0]?.eff_date ?? "-";
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ padding: 20 }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <AntDesign name="menu" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <Text style={styles.aipText}>
            {language === "EN"
              ? "Mongolia AIP Information"
              : "Монгол Улсын AIP мэдээлэл"}
          </Text>
          <Image
            source={require("@/assets/images/mgl_flag.png")}
            style={styles.flag}
            resizeMode="contain"
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text>{language === "EN" ? "Mongolia" : "Монгол Улс"}</Text>
            <Text>
              {language === "EN"
                ? "Consult NOTAM for latest information"
                : "Хамгийн сүүлийн мэдээллийг NОТАМ-аас хар"}
            </Text>
            <Text>
              {language === "EN"
                ? "Civil Aviation Authority of Mongolia"
                : "Монгол Улсын Иргэний нисэхийн ерөнхий газар"}
            </Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.pubDate}>
              {/* pub_date: {loading ? "loading..." : latestPubDate} */}
              {language === "EN"
                ? `Effective Date: ${effDate}`
                : `Хүчинтэй болсон огноо: ${effDate}`}
            </Text>
            <Text style={styles.pubDate}>
              {/* pub_date: {loading ? "loading..." : latestPubDate} */}
              {language === "EN"
                ? `Publication Date: ${pubDate}`
                : `Хэвлэх өдөр: ${pubDate}`}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  let REMOTE_URL = "";

  switch (content.type) {
    case "AIP":
      REMOTE_URL =
        language === "EN"
          ? `${content.direction}${content.aip_en}`
          : `${content.direction}${content.aip_mn}`;

      break;
    case "AMDT":
      REMOTE_URL = language === "EN" ? content.en : content.mn;
      break;
    case "SUP":
      REMOTE_URL = language === "EN" ? content.en : content.mn;
      break;
    case "AIC":
      REMOTE_URL = language === "EN" ? content.en : content.mn;
      break;
    default:
      REMOTE_URL = "";
  }
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ paddingTop: 20, paddingLeft: 20 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <AntDesign name="menu" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.container}>
        <WebView
          source={{ uri: REMOTE_URL }}
          style={{ flex: 1, width: "100%", height: "90%" }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          // javaScriptEnabled
          scalesPageToFit={false}
          injectedJavaScriptBeforeContentLoaded={`
            window.addEventListener("load", function() {
              document.body.style.paddingBottom = '400px';
            });
            true;
          `}
        />
      </View>
    </View>
  );
};

export default AipContent;

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 120,
    width: "95%",
    height: "90%",
    borderColor: Colors.grey,
    borderWidth: 1,
    backgroundColor: Colors.white,
    alignSelf: "center",
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // padding: 16,
  },
  // AIP
  aipText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  flag: {
    width: "80%",
    height: 120,
    textAlign: "center",
    justifyContent: "center",
  },

  dateCard: {
    width: "80%",
    padding: 10,
    borderWidth: 1.5,
    borderColor: "black",
  },

  pubDate: {
    fontSize: 14,
    textAlign: "left",
    justifyContent: "center",
  },
});
