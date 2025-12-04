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
import { useCallback, useRef, useState } from "react";
import { Colors } from "@/constants/color";
import { Calendar } from "react-native-calendars";

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
}

const DirectionDate: React.FC<ModalProps> = ({
  itemData,
  isVisible,
  onClose,
  onNext,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const translateY = useRef(new Animated.Value(height)).current;
  const slideUpDuration = 300;

  const resetDates = () => {
    setSelectedDate(today);
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

  const handleNextPress = () => {
    onNext(selectedDate);
    resetDates();
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

          <View style={styles.calendarWrapper}>
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: Colors.primary,
                },
              }}
            />
          </View>

          <View style={styles.spacer} />

          <View style={styles.buttonArea}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={slideDown}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextPress}
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
  calendarWrapper: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  // Календарийн доорх зайг бөглөж, товчнуудыг доош түлхэнэ
  spacer: {
    flex: 1,
  },

  buttonArea: {
    paddingHorizontal: 12,
    paddingBottom: 20, // ✅ Хүссэн paddingBottom: 20
  },
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
    paddingHorizontal: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: Colors.text_grey },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  // title: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  //   textAlign: "center",
  // },
  calendarArea: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
  // Ашиглагдахгүй байгаа style-уудыг устгасан
});

export default DirectionDate;
