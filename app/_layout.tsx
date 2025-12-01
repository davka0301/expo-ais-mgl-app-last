import { SplashScreen, Stack } from "expo-router";
import { LanguageProvider } from "@/context/LanguageContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotamWishlistProvider } from "@/constants/bookMart/notamBookMart";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};
export default function RootLayout() {
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
            </Stack>
          </NotamWishlistProvider>
        </LanguageProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
