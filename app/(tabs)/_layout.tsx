import {
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabsLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        title: "  ",
        swipeEnabled: true,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIndicatorStyle: { backgroundColor: "#000" },
      }}
      initialRouteName="index"
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />
      <MaterialTopTabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <MaterialTopTabs.Screen name="reports" options={{ title: "Reports" }} />
      <MaterialTopTabs.Screen name="accounts" options={{ title: "Accounts" }} />
    </MaterialTopTabs>
  );
}