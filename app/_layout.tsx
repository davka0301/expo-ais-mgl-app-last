import { SplashScreen, Stack } from "expo-router";
import { LanguageProvider } from "@/context/LanguageContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";

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
    <LanguageProvider>
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
    </LanguageProvider>
  );
}
