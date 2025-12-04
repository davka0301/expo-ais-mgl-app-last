import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TAB_IMAGES } from "@/constants/tabBar";
import { Colors } from "@/constants/color";

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
            ? TAB_IMAGES.flight_grey
            : route.name === "notam"
            ? TAB_IMAGES.notam_grey
            : TAB_IMAGES.aip_grey;

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
            style={styles.tabItem}
          >
            <Image
              source={iconName}
              style={{
                width: 25,
                height: 25,
                tintColor: isFocused ? Colors.primary : Colors.grey,
              }}
            />

            <Text
              style={[
                styles.tabText,
                { color: isFocused ? Colors.primary : Colors.grey },
              ]}
            >
              {label as string}
            </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    backgroundColor: "blue",
    borderRadius: 25,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
});
