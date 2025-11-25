import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TAB_IMAGES } from "@/constants/tabBar";
import { LanguageContext } from "@/context/LanguageContext";

const { width } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.wrapper}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconName =
          route.name === "flight"
            ? TAB_IMAGES.flight
            : route.name === "notam"
            ? TAB_IMAGES.notam
            : TAB_IMAGES.aip;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.activeTab]}
          >
            <Image
              source={iconName}
              style={{
                width: 25,
                height: 25,
                tintColor: isFocused ? "#fff" : "#333",
              }}
            />

            {!isFocused && (
              <Text style={[styles.tabText, { color: "#333" }]}>
                {label as string}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 30,
    left: 70,
    right: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#C2C2C2",
    paddingVertical: 10,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  activeTab: {
    backgroundColor: "#2a9df4",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
});
