import AipSearch from "@/components/aip/aipSearch";
import { Drawer } from "expo-router/drawer";

export default function ProfileLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerType: "slide",
        drawerPosition: "left",
        headerShown: false,
        drawerContentStyle: { flex: 1 }, // <-- override default scroll
        drawerStyle: { flex: 1 },
        drawerHideStatusBarOnOpen: false,
      }}
      // IMPORTANT
      drawerContent={(props) => <AipSearch {...props} />}
    >
      <Drawer.Screen name="index" />
    </Drawer>
  );
}
