import TabBar from "@/components/tabBar/tabBar";
import { TAB_NAME } from "@/constants/tabBar";
import { LanguageContext } from "@/context/LanguageContext";
import { Tabs } from "expo-router";
import { useContext } from "react";

export default function TabLayout() {
  const { language } = useContext(LanguageContext);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="flight"
        options={{
          title: language === "EN" ? TAB_NAME.en.flight : TAB_NAME.mn.flight,
        }}
      />
      <Tabs.Screen
        name="notam"
        options={{
          title: language === "EN" ? TAB_NAME.en.notam : TAB_NAME.mn.notam,
        }}
      />
      <Tabs.Screen
        name="aip"
        options={{
          title: language === "EN" ? TAB_NAME.en.aip : TAB_NAME.mn.aip,
        }}
      />
      <Tabs.Screen />
    </Tabs>
  );
}
