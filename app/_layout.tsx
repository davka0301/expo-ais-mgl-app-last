import { Stack } from "expo-router";
import { LanguageProvider } from "@/context/LanguageContext";

export const unstable_settings = {
  anchor: "(tabs)",
};
export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack initialRouteName="welcome">
        <Stack.Screen
          name="welcome"
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
