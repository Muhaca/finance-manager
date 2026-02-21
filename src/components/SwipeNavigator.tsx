import { usePathname, useRouter } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

const routes = ["/", "/transactions", "/accounts", "/reports"] as const;

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = routes.findIndex((r) => r === pathname);

  const navigate = (direction: "left" | "right") => {
    if (currentIndex === -1) return;

    if (direction === "left" && currentIndex < routes.length - 1) {
      router.replace(routes[currentIndex + 1]);
    }

    if (direction === "right" && currentIndex > 0) {
      router.replace(routes[currentIndex - 1]);
    }
  };

  const pan = useMemo(() => {
    return Gesture.Pan().onEnd((event) => {
      if (event.translationX < -120) {
        runOnJS(navigate)("left");
      }

      if (event.translationX > 120) {
        runOnJS(navigate)("right");
      }
    });
  }, [currentIndex]);

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}