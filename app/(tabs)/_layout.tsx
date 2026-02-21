import CustomTabBar from "@/src/components/CustomTabBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

// 🔥 Ini magic supaya compatible dengan Expo Router
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: { display: "none" },
        tabBarIndicatorStyle: { display: "none" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <MaterialTopTabs.Screen name="index" />
      <MaterialTopTabs.Screen name="transactions" />
      <MaterialTopTabs.Screen name="reports" />
      <MaterialTopTabs.Screen name="accounts" />
    </MaterialTopTabs>
  );
}
