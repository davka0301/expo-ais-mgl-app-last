import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Props } from "@/hooks/interface/bottomSheet";
import { Colors } from "@/constants/color";

const Route = ({ icon, title, subtitle, onCancel, onNext }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={icon} style={{ width: 28, height: 28 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <Text>Direction neer haih bolomjtoi balgah</Text>
    </View>
  );
};

export default Route;

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
});
