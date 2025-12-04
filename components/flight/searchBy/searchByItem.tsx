import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";

interface SearchByItemProps {
  iconName: ImageSourcePropType;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SearchByItem = ({
  iconName,
  title,
  subtitle,
  onPress,
}: SearchByItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.leftRow}>
        <Image source={iconName} style={styles.icon} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.text_grey} />
    </TouchableOpacity>
  );
};

export default SearchByItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    borderStyle: "dashed",
    marginBottom: 8,
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  icon: { width: 30, height: 30, margin: 10 },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { fontSize: 12, color: Colors.text_grey },
});
