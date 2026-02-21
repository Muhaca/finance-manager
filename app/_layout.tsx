import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { initDB } from "@/src/database/migrations";
import { seedCategories } from "@/src/database/seed";

import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    initDB();
    seedCategories();
  }, []);

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
