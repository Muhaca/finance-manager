import { Stack } from "expo-router";
import { useEffect } from "react";

import { initDB } from "@/src/database/migrations";
import { seedCategories } from "@/src/database/seed";

import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    initDB();
    seedCategories();
  }, []);

  return <Stack />;
}
