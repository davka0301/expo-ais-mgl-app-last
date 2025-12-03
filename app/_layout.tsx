import { SplashScreen, Stack, useRouter } from "expo-router";
import { LanguageProvider } from "@/context/LanguageContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotamWishlistProvider } from "@/constants/bookMart/notamBookMart";
import BookMartHeader from "./notam/bookMartHeader";

import { Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FlightNumberHeader from "./flight/searchBy/headers/flightNumberHeader";
import BookMartFilghtHeader from "./flight/bookmark/bookMartFlightHeader";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};
export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Regular: require("../assets/font/Roboto-Regular.ttf"),
    Medium: require("../assets/font/Roboto-Medium.ttf"),
    Bold: require("../assets/font/Roboto-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <LanguageProvider>
          <NotamWishlistProvider>
            <Stack initialRouteName="index">
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="flight/bookmark/bookmark"
                options={{
                  headerTitle: () => <BookMartFilghtHeader />,
                }}
              />
              <Stack.Screen
                name="notam/bookmark"
                options={{
                  headerShown: true,
                  headerTitle: () => <BookMartHeader />,
                  headerLeft: () =>
                    Platform.OS === "ios" ? (
                      <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                          borderRadius: 20,
                          borderWidth: 1,
                          padding: 3,
                        }}
                      >
                        <Ionicons
                          name="arrow-back-outline"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    ) : null,
                }}
              />
              <Stack.Screen
                name="flight/searchBy/searchByFlightNumber"
                options={{
                  headerShown: true,
                  headerTitle: () => <FlightNumberHeader />,
                  headerLeft: () =>
                    Platform.OS === "ios" ? (
                      <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                          borderRadius: 20,
                          borderWidth: 1,
                          padding: 3,
                        }}
                      >
                        <Ionicons
                          name="arrow-back-outline"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    ) : null,
                }}
              />
              <Stack.Screen
                name="flight/searchBy/searchByDirection"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </NotamWishlistProvider>
        </LanguageProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
