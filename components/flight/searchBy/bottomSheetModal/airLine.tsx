import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  PanResponder,
  ImageSourcePropType,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Colors } from "@/constants/color";
import { useAllFlightLine } from "@/hooks/airLine/useAllFlightAirLineData";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const SNAP_HEIGHT = height * 0.7;

interface SearchItemData {
  id: string;
  name_title: string;
  name_title_mn: string;
  sub_title: string;
  sub_title_mn: string;
  icon: ImageSourcePropType;
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onNext: (date: string) => void;
  itemData: SearchItemData;
  selectedAirport: string;
}

const AirLine: React.FC<ModalProps> = ({
  itemData,
  isVisible,
  onClose,
  selectedAirport,
  onNext,
}) => {
  const { language } = useLanguage();

  const router = useRouter();
  const translateY = useRef(new Animated.Value(height)).current;
  const slideUpDuration = 300;
  const today = new Date().toISOString().split("T")[0];
  const { companies, loading } = useAllFlightLine(today, selectedAirport);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return companies.filter((item) =>
      item.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const resetDates = () => {
    setSelectedCompany("");
  };

  const slideUp = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: slideUpDuration,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const slideDown = useCallback(() => {
    Animated.timing(translateY, {
      toValue: height,
      duration: slideUpDuration,
      useNativeDriver: true,
    }).start(onClose);
    resetDates();
  }, [translateY, onClose]);

  useEffect(() => {
    if (isVisible) {
      slideUp();
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          slideDown();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const nextHandle = () => {
    if (!selectedCompany) return;

    router.push({
      pathname: "/flight/searchBy/searchByAirLine",
      params: {
        selectedAirport: selectedAirport,
        today,
        company: selectedCompany,
      },
    });
    slideDown();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={slideDown}
      animationType="none"
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={styles.backdrop}
        onPress={slideDown}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, height],
                    outputRange: [0, height],
                    extrapolate: "clamp",
                  }),
                },
              ],
              height: SNAP_HEIGHT,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <View style={styles.headerRow}>
            <Image source={itemData.icon} style={{ width: 35, height: 35 }} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>{itemData.name_title}</Text>
              <Text style={styles.subtitle}>{itemData.sub_title}</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={"Flight Number Search"}
              placeholderTextColor="#A9A9A9"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* DATA */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.flight_id}
            style={{ marginTop: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() =>
                  setSelectedCompany(
                    selectedCompany === item.company ? null : item.company
                  )
                }
              >
                <Checkbox
                  value={selectedCompany === item.company}
                  onValueChange={() =>
                    setSelectedCompany(
                      selectedCompany === item.company ? null : item.company
                    )
                  }
                  color={
                    selectedCompany === item.company ? "#2196F3" : undefined
                  }
                />

                <Text style={styles.airlineName}>{item.company}</Text>
                <Text>{item.company_abbr}</Text>
                {/* <Image
                  source={{ uri: item.company_logo }}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                    marginRight: 12,
                  }}
                /> */}
              </TouchableOpacity>
            )}
          />
          {/* FOOTER */}
          <View style={styles.buttonArea}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={slideDown}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextHandle}>
                <Text style={styles.nextText}>NEXT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  handleContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: Colors.text_grey },

  inputWrapper: {
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 5,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  // FOOTER

  buttonArea: {
    paddingHorizontal: 12,
    paddingBottom: 20, // ✅ Хүссэн paddingBottom: 20
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  nextButton: {
    flex: 1,
    marginLeft: 5,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#000",
    fontWeight: "bold",
  },
  nextText: {
    color: "white",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },

  airlineName: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  code: {
    fontWeight: "700",
    color: "#555",
  },
});

export default AirLine;
