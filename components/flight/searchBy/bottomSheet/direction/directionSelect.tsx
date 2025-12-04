import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { Colors } from "@/constants/color";
import { useDirectionAirport } from "@/hooks/direction/useDirectionAiportData";

interface DirectionSelectProps {
  date: string;
  airportCode: string;
  onCancel: () => void;
  onNext: (directionCode: string) => void;
}

const DirectionSelect = ({
  onNext,
  airportCode,
  onCancel,
  date,
}: DirectionSelectProps) => {
  const { data, loading } = useDirectionAirport(date, airportCode);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary}
        style={{ marginTop: 50 }}
      />
    );
  }

  // ✅ Filtered data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter(
      (item) =>
        item.direction_name_en.toLowerCase().includes(search.toLowerCase()) ||
        item.direction_code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>{date}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={"Direction search"}
          value={
            selected
              ? data.find((d) => d.direction_code === selected)
                  ?.direction_name_en || ""
              : search
          }
          onChangeText={(text) => {
            setSearch(text);
            setSelected(null); // search хийж эхэлвэл сонгосон direction clear
          }}
          placeholderTextColor="#A9A9A9"
        />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.direction_code}
        style={{ maxHeight: 300, marginTop: 12 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor:
                selected === item.direction_code ? Colors.primary : Colors.grey,
              marginVertical: 6,
              borderRadius: 6,
            }}
            onPress={() => setSelected(item.direction_code)}
          >
            <Text
              style={{
                color: selected === item.direction_code ? "#fff" : "#000",
              }}
            >
              {item.direction_name_en}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: Colors.grey }}
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: Colors.primary }}
          // onPress={() => {
          //   if (selected) {
          //     onNext(selected);
          //   } else {
          //     alert("Please select a direction"); 94192944
          //   }
          // }}
        >
          <Text style={{ color: Colors.text_white }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DirectionSelect;

const styles = StyleSheet.create({
  inputWrapper: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
