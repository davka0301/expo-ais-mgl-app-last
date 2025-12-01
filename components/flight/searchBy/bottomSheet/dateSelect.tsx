import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";
import { Colors } from "@/constants/color";

interface Props {
  onCancel: () => void;
  onNext: (value?: any) => void;
  selectedDates: string[];
  onDayPress: (day: any) => void;
  marked: any;
  icon: any;
  title: string;
  subtitle: string;
}

const DateSelect: React.FC<Props> = ({
  onCancel,
  onNext,
  selectedDates,
  onDayPress,
  marked,
  icon,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={icon} style={{ width: 28, height: 28 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <Calendar onDayPress={onDayPress} markedDates={marked} />

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.greyBtn]}
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.primaryBtn]}
          onPress={() => onNext()}
        >
          <Text style={{ color: Colors.text_white }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateSelect;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { color: Colors.text_grey },

  //
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { width: "47%", padding: 10, borderRadius: 6, alignItems: "center" },
  greyBtn: { backgroundColor: Colors.grey },
  primaryBtn: { backgroundColor: Colors.primary },
});
