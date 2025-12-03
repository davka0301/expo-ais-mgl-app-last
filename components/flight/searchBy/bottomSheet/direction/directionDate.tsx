import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/color";
import { Calendar } from "react-native-calendars";
import DirectionSelect from "./directionSelect";

interface Props {
  icon: any;
  title: string;
  subtitle: string;
  onCancel: () => void;
  airportCode: string;
  onNext: (value?: any) => void;
}

const DirectionDate = ({
  icon,
  title,
  subtitle,
  onCancel,
  onNext,
  airportCode,
}: Props) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showDirectionList, setShowDirectionList] = useState(false);

  if (showDirectionList) {
    return (
      <DirectionSelect
        date={selectedDate}
        airportCode={airportCode} // 🟢 airport дамжуулж байна
        onCancel={onCancel}
        onNext={(directionCode: string) => {
          onNext({ date: selectedDate, airportCode, directionCode });
        }}
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={icon} style={{ width: 28, height: 28 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "red",
          },
        }}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.greyBtn]}
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.primaryBtn]}
          onPress={() => setShowDirectionList(true)}
        >
          <Text style={{ color: Colors.text_white }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DirectionDate;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: "dashed",
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: Colors.text_grey },

  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { width: "47%", padding: 10, borderRadius: 6, alignItems: "center" },
  greyBtn: { backgroundColor: Colors.grey },
  primaryBtn: { backgroundColor: Colors.primary },
});
