import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

// 🔥 Ini magic supaya compatible dengan Expo Router
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
      tabBarPosition="bottom"

    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }: any) => (<Ionicons name="home-outline" size={size} color={color} />) }} />
      <MaterialTopTabs.Screen name="transactions" options={{ title: "Transaksi", tabBarIcon: ({ color, size }: any) => (<Ionicons name="receipt-outline" size={size} color={color} />) }} />
      <MaterialTopTabs.Screen name="reports" options={{ title: "Laporan", tabBarIcon: ({ color, size }: any) => (<Ionicons name="pie-chart-outline" size={size} color={color} />) }} />
      <MaterialTopTabs.Screen name="accounts" options={{ title: "Akun", tabBarIcon: ({ color, size }: any) => (<Ionicons name="wallet-outline" size={size} color={color} />) }} />
    </MaterialTopTabs>
  );
}
