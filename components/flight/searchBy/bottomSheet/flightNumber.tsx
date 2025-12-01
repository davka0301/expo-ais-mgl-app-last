import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Props } from "@/hooks/interface/bottomSheet";
import { Colors } from "@/constants/color";

const FlightNumber = ({ icon, title, subtitle, onCancel, onNext }: Props) => {
  const [value, setValue] = React.useState("");
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={icon} style={{ width: 28, height: 28 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <TextInput
        placeholder="e.g. OM123"
        style={styles.input}
        value={value}
        onChangeText={setValue}
        autoCapitalize="characters"
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
          onPress={() => onNext(value)}
        >
          <Text style={{ color: Colors.text_white }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlightNumber;

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
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginVertical: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { width: "47%", padding: 10, borderRadius: 6, alignItems: "center" },
  greyBtn: { backgroundColor: Colors.grey },
  primaryBtn: { backgroundColor: Colors.primary },
});
