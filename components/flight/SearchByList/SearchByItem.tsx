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
import { useResponsive } from "@/hooks/useResponsive";

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
  const { rw, rh, rf, cardWidth } = useResponsive();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { marginBottom: rh(10), paddingVertical: rh(10) },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.leftRow}>
        <Image
          source={iconName}
          style={{
            width: rh(30),
            height: rh(30),
            marginVertical: rh(5),
            marginRight: rh(12),
          }}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.dark} />
    </TouchableOpacity>
  );
};

export default SearchByItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
    borderStyle: "solid",
    marginBottom: 5,
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  icon: { width: 30, height: 30, margin: 10 },
  title: { fontSize: 15, fontWeight: "600" },
  subtitle: { fontSize: 12, color: Colors.text_grey },
});
