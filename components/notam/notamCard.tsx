import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { Notam } from "@/hooks/interface/notam";
import { Colors } from "@/constants/color";
import { useLanguage } from "@/context/LanguageContext";
import { NOTAM_TEXT } from "@/constants/notam";
import { RenderHTML } from "react-native-render-html";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";

const NotamCard = ({ item }: { item: Notam }) => {
  const { width, height } = useResponsiveSize();
  const { language } = useLanguage();
  const [showPlain, setShowPlainTes] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 📌 HTML source-г useMemo ашиглаж тогтвортой хадгалах
  const htmlSource = useMemo(
    () => ({ html: item.description }),
    [item.description]
  );
  // Android-д URL-ийг encode хийх шаардлагатай
  const androidUrl = `https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    item.d_notam_link
  )}`;
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>
          {item.aerodrome} NUMBER: {item.number}
        </Text>
        <Text style={{ fontSize: 12 }}>- {item.ago} -</Text>
      </View>
      <View style={styles.titleRow}>
        <Text>
          {language === "EN"
            ? NOTAM_TEXT.START_TIME_EN
            : NOTAM_TEXT.START_TIME_MN}
        </Text>
        <Text>
          {language === "EN" ? NOTAM_TEXT.END_TIME_EN : NOTAM_TEXT.END_TIME_MN}
        </Text>
      </View>
      <View style={styles.titleRow}>
        <Text>{item.b_item_decode}</Text>
        <Text>{item.c_item_decode}</Text>
      </View>

      {/* TOGGLE BUTTON */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showPlain && styles.activeButton]}
          onPress={() => setShowPlainTes(false)}
        >
          <Text>{NOTAM_TEXT.ICAO}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showPlain && styles.activeButton]}
          onPress={() => setShowPlainTes(true)}
        >
          <Text style={[styles.toggleText, showPlain && styles.activeText]}>
            {language === "EN"
              ? NOTAM_TEXT.PLAIN_LANGUAGE_EN
              : NOTAM_TEXT.PLAIN_LANGUAGE_MN}
          </Text>
        </TouchableOpacity>
        {item.d_notam !== "" && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setModalVisible(true)}
          >
            <Text>{item.d_notam.toUpperCase()}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.toggleButton}>
          <Ionicons name={"bookmark-outline"} size={19} color={"#000"} />
        </TouchableOpacity>
      </View>

      {/* TOGGLE CONTENT */}
      <View style={styles.contentBox}>
        {showPlain ? (
          <Text>{language === "EN" ? item.e_item_decode : item.e_item}</Text>
        ) : (
          <RenderHTML
            contentWidth={width}
            source={htmlSource}
            tagsStyles={{
              div: { marginBottom: 2 },
              strong: { fontWeight: "bold" },
            }}
          />
        )}
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width, height: height * 0.7 }]}>
            <View style={styles.modalHeader}>
              <Text style={{ fontWeight: "600" }}>{item.number}</Text>
              <Text style={{ fontWeight: "600", color: Colors.primary }}>
                {item.d_notam.toUpperCase()}
              </Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </Pressable>
            </View>
            {item.d_notam.toLowerCase() === "3D" ? (
              <Text>3D notam orj irne</Text>
            ) : item.d_notam.toUpperCase() === "2D" ? (
              <WebView
                style={{ flex: 1 }}
                originWhitelist={["*"]}
                source={{
                  uri: Platform.OS === "ios" ? item.d_notam_link : androidUrl,
                }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                scalesPageToFit={true} // zoom тохируулах
                useWebKit={true} // iOS-д webkit ашиглах
                Android-д
                zoom
                control
                тохиргоо
                androidHardwareAccelerationDisabled={false}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotamCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 30,
    shadowColor: Colors.dark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Bold",
    marginBottom: 4,
  },
  // toggle
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 10,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.grey,
    marginRight: 8,
  },
  toggleText: {
    color: "#333",
    fontWeight: "500",
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  activeText: {
    color: "#fff",
  },
  //  TOGGLE CONTENT
  contentBox: {
    padding: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderStyle: "dashed",
    borderColor: "#BAB9B9",
  },
  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    // width: Sizes.width,
    // height: Sizes.height * 0.7,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
