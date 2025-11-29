import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function SearchBy() {
  const params = useLocalSearchParams();

  const rawDates = Array.isArray(params.dates) ? params.dates[0] : params.dates;

  const dates: string[] = rawDates ? JSON.parse(rawDates) : [];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Selected Dates:</Text>

      {dates.length === 0 ? (
        <Text>No dates selected</Text>
      ) : (
        dates.map((d, i) => (
          <Text key={i} style={{ fontSize: 16, marginVertical: 4 }}>
            • {d}
          </Text>
        ))
      )}
    </View>
  );
}
