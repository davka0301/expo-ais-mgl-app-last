// components/flight/searchBy.tsx

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/color"; // Таны өгөгдсөн загвар
import { useResponsiveSize } from "@/hooks/useResponsiveSize"; // Таны өгөгдсөн загвар

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

// --- 🏢 Үндсэн SearchBy Компонент ---
const SearchBy = () => {
  // NOTE: useRouter ашиглан хуудас хооронд шилжих үйлдлийг энд нэмж болно.

  // Жишээ:
  const handlePress = (type: string) => {
    console.log(`${type} хайх сонголт дээр дарлаа.`);
    // router.push(`/flight/search/${type}`);
  };

  // Дэлгэц дээр харагдах хайх сонголтууд
  const searchOptions = [
    {
      iconName: "airplane-outline",
      title: "Flight Number",
      subtitle: "Enter flight code to get flight details",
      onPress: () => handlePress("flight_number"),
    },
    {
      iconName: "briefcase-outline",
      title: "Airline",
      subtitle: "Enter flight code to get flight details", // subtitle-ийг зургийн дагуу тавив
      onPress: () => handlePress("airline"),
    },
    {
      iconName: "list-circle-outline", // Route-д тохирох icon
      title: "Route",
      subtitle: "Enter flight code to get flight details", // subtitle-ийг зургийн дагуу тавив
      onPress: () => handlePress("route"),
    },
    {
      iconName: "calendar-outline",
      title: "Date",
      subtitle: "Enter a date to retrieve its flight history",
      onPress: () => handlePress("date"),
    },
  ] as const;

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
    </View>
  );
};

export default SearchBy;

// --- 🎨 Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 350, // FlightSearch компонентийн SVG-ийн доор байрлуулахын тулд margin нэмсэн.
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Bold", // Таны бусад кодонд ашигласан font-ийг таамаглав
    marginBottom: 15,
    color: "#333",
  },
  searchItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Цайвар шугам
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 15,
    width: 30, // Icon-д тогтмол зай өгөх
    textAlign: "center",
  },
  textContainer: {
    flex: 1, // Текстийн зайг дүүргэх
  },
  titleText: {
    fontSize: 15,
    fontFamily: "Medium",
    color: "#333",
  },
  subtitleText: {
    fontSize: 12,
    fontFamily: "Regular",
    color: Colors.text_grey,
    marginTop: 2,
  },
});
