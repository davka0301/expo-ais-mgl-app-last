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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Colors } from "@/constants/color";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");
const SNAP_HEIGHT = height * 0.7; // Modal height set to 70% of screen height
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
  // NOTE: onNext prop is unused internally and has been kept here for interface consistency, but removed from usage.
  onNext: (date: string) => void;
  itemData: SearchItemData;
  selectedAirport: string;
}

const DateList: React.FC<ModalProps> = ({
  itemData,
  isVisible,
  onClose,
  selectedAirport,
}) => {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  // Allow multiple date selection
  const [selectedDates, setSelectedDates] = useState<string[]>([today]);

  const translateY = useRef(new Animated.Value(height)).current;
  const slideUpDuration = 300;

  const onDayPress = useCallback((day: any) => {
    const date = day.dateString;
    setSelectedDates((prev) => {
      // Toggle date selection
      if (prev.includes(date)) return prev.filter((d) => d !== date);
      return [...prev, date];
    });
  }, []);

  // Memoized object for Calendar component's markedDates prop
  const marked = useMemo(() => {
    const m: any = {};
    selectedDates.forEach((d) => {
      m[d] = {
        selected: true,
        selectedColor: Colors.primary,
        disableTouchEvent: false, // Allow re-tapping to deselect
      };
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
    }).start(() => {
      onClose();
      resetDates(); // Reset dates after modal closes
    });
  }, [translateY, onClose]);

  useEffect(() => {
    if (isVisible) {
      slideUp();
    }
  }, [isVisible, slideUp]);

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
    if (selectedDates.length === 0) return; // Prevent navigation if no date is selected

    router.push({
      pathname: "/flight/searchBy/searchByDate",
      params: {
        dates: JSON.stringify(selectedDates),
        airportCode: selectedAirport,
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

          <View style={styles.calendarArea}>
            <Calendar onDayPress={onDayPress} markedDates={marked} />
          </View>

          {/* Spacer View to push the footer down */}
          <View style={styles.spacer} />

          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.cancelButton} onPress={slideDown}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextDate}
              // Disable NEXT button if no dates are selected (optional guard)
              disabled={selectedDates.length === 0}
            >
              <Text style={styles.nextText}>NEXT</Text>
            </TouchableOpacity>
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

  // HEADER (Updated paddingHorizontal to 20)
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

  // CALENDAR (Updated padding to 20)
  calendarArea: {
    // Removed flex: 1 to ensure calendar takes natural height
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // FOOTER BUTTONS (Updated container name and paddingHorizontal to 20)
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  // Removed old 'contentContainer' and merged footer styles into 'buttonArea'

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
});

export default DateList;
