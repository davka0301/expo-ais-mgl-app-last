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
} from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { Colors } from "@/constants/color";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const SNAP_HEIGHT = height * 0.7; // Өндрийг Calendar-т тохируулан 70% болгоё
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

const DateList: React.FC<ModalProps> = ({
  itemData,
  isVisible,
  onClose,
  onNext,
  selectedAirport,
}) => {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDates, setSelectedDates] = useState<string[]>([today]);

  const translateY = useRef(new Animated.Value(height)).current;
  const slideUpDuration = 300;

  const onDayPress = useCallback((day: any) => {
    const date = day.dateString;
    setSelectedDates((prev) => {
      if (prev.includes(date)) return prev.filter((d) => d !== date);
      return [...prev, date];
    });
  }, []);

  const marked = useMemo(() => {
    const m: any = {};
    selectedDates.forEach((d) => {
      m[d] = { selected: true, selectedColor: Colors.primary };
    });
    return m;
  }, [selectedDates]);

  const resetDates = () => {
    setSelectedDates([today]);
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

  if (isVisible) {
    slideUp();
  }

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

  const handleNextDate = () => {
    router.push({
      pathname: "/flight/searchBy/searchByDate",
      params: {
        dates: JSON.stringify(selectedDates),
        airportCode: selectedAirport,
      },
    });
    resetDates();
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
          <View style={styles.calendarArea}>
            <Calendar onDayPress={onDayPress} markedDates={marked} />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  slideDown();
                }}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  handleNextDate();
                }}
              >
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

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: Colors.text_grey },

  // CALENDAR
  calendarArea: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  // FOOTER
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
    backgroundColor: "#6A5ACD",
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
});

export default DateList;
