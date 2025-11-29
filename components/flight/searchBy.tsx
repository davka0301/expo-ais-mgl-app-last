// components/flight/searchBy.tsx

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/color"; // Таны өгөгдсөн загвар
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";

// Modal төрөл
type ModalType = "flight_number" | "airline" | "route" | "date" | null;

// --- ⚙️ Хайх Сонголтын Компонент ---
interface SearchByItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void; // Дарах үед ажиллах функц
}

const SearchByItem: React.FC<SearchByItemProps> = ({
  iconName,
  title,
  subtitle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.searchItemContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={Colors.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.text_grey} />
    </TouchableOpacity>
  );
};

const SearchBy = () => {
  const router = useRouter();
  const snapPoints = useMemo(() => ["60%", "80%"], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDates, setSelectedDates] = useState<string[]>([today]);

  // ---- Өдөр дарахад -------
  const onDayPress = (day: any) => {
    const date = day.dateString;

    if (selectedDates.includes(date)) {
      // Устгах
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      // Нэмэх
      setSelectedDates([...selectedDates, date]);
    }
  };

  // ---- Calendar Highlight ----
  const marked = useMemo(() => {
    const marks: any = {};
    selectedDates.forEach((d) => {
      marks[d] = {
        selected: true,
        selectedColor: Colors.primary,
      };
    });
    return marks;
  }, [selectedDates]);

  const handlePresentModalPress = useCallback((type: ModalType) => {
    setModalType(type);
    bottomSheetModalRef.current?.present();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // -1 индекс дээр байх үед ард тал алга болно.
        appearsOnIndex={0}
        pressBehavior="close" // Ард тал дээр дарахад модалыг хаана.
      />
    ),
    []
  );

  // Дэлгэц дээр харагдах хайх сонголтууд
  const searchOptions = [
    {
      iconName: "airplane-outline",
      title: "Flight Number",
      subtitle: "Enter flight code to get flight details",
      onPress: () => handlePresentModalPress("flight_number"),
    },
    {
      iconName: "briefcase-outline",
      title: "Airline",
      subtitle: "Enter flight code to get flight details",
      onPress: () => handlePresentModalPress("airline"),
    },
    {
      iconName: "list-circle-outline",
      title: "Route",
      subtitle: "Enter flight code to get flight details",
      onPress: () => handlePresentModalPress("route"),
    },
    {
      iconName: "calendar-outline",
      title: "Date",
      subtitle: "Enter a date to retrieve its flight history",
      onPress: () => handlePresentModalPress("date"),
    },
  ] as const;

  const renderSheetContent = () => {
    switch (modalType) {
      case "flight_number":
        return (
          <View style={styles.modalBox}>
            <View style={styles.searchItemContainer}>
              <Ionicons
                name="airplane-outline"
                size={24}
                color={Colors.primary}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>Flight Number</Text>
                <Text style={styles.subtitleText}>
                  Enter flight code to get flight details
                </Text>
              </View>
            </View>

            <TextInput placeholder="e.g. OM123" style={styles.input} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.grey,
                  },
                ]}
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
              >
                <Text style={styles.flightText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}
                onPress={() => {
                  router.push("/flight/searchBy/searchBy");
                }}
              >
                <Text
                  style={[
                    styles.flightText,
                    {
                      color: Colors.text_white,
                    },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "airline":
        return (
          <View style={styles.modalBox}>
            <View style={styles.searchItemContainer}>
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={Colors.primary}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>Airline</Text>
                <Text style={styles.subtitleText}>
                  Enter flight code to get flight details
                </Text>
              </View>
            </View>
            <TextInput placeholder="Search arlines" style={styles.input} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.grey,
                  },
                ]}
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
              >
                <Text style={styles.flightText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}
                onPress={() => {
                  router.push("/flight/searchBy/searchBy");
                }}
              >
                <Text
                  style={[
                    styles.flightText,
                    {
                      color: Colors.text_white,
                    },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "route":
        return (
          <View style={styles.modalBox}>
            <View style={styles.searchItemContainer}>
              <Ionicons
                name="list-circle-outline"
                size={24}
                color={Colors.primary}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>Route</Text>
                <Text style={styles.subtitleText}>
                  Enter flight code to get flight details
                </Text>
              </View>
            </View>
            <TextInput placeholder="Search arlines" style={styles.input} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.grey,
                  },
                ]}
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
              >
                <Text style={styles.flightText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}
                onPress={() => {
                  router.push("/flight/searchBy/searchBy");
                }}
              >
                <Text
                  style={[
                    styles.flightText,
                    {
                      color: Colors.text_white,
                    },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "date":
        return (
          <View style={styles.modalBox}>
            <View style={styles.searchItemContainer}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={Colors.primary}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>Date</Text>
                <Text style={styles.subtitleText}>
                  Enter a date to retrieve its flight history
                </Text>
              </View>
            </View>

            <Calendar onDayPress={onDayPress} markedDates={marked} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.grey,
                  },
                ]}
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
              >
                <Text style={styles.flightText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flightBtn,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/flight/searchBy/searchBy",
                    params: {
                      dates: JSON.stringify(selectedDates),
                    },
                  });
                }}
              >
                <Text
                  style={[
                    styles.flightText,
                    {
                      color: Colors.text_white,
                    },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Search By</Text>
      {searchOptions.map((item, index) => (
        <SearchByItem
          key={index}
          iconName={item.iconName}
          title={item.title}
          subtitle={item.subtitle}
          onPress={item.onPress}
        />
      ))}
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetModalRef}
        index={1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          <View>{renderSheetContent()}</View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default SearchBy;

// --- 🎨 Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Bold",
    marginBottom: 15,
  },
  searchItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderStyle: "dashed",
    borderBottomColor: Colors.grey,

    justifyContent: "space-between",
  },
  icon: { marginRight: 15, width: 30, textAlign: "center" },
  textContainer: { flex: 1 },
  titleText: { fontSize: 15, fontFamily: "Medium" },
  subtitleText: { fontSize: 12, color: Colors.text_grey },

  // Modal
  modalBox: { paddingHorizontal: 20 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  flightBtn: {
    width: "45%",
    borderRadius: 5,
    padding: 5,
  },
  flightText: { textAlign: "center", fontFamily: "Regular", fontSize: 15 },

  // Airlines

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },

  routeBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  routeText: { fontSize: 16, fontWeight: "600" },
});
