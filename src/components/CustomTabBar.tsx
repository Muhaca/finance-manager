import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="absolute left-0 right-0 flex-row bg-white border-t border-gray-200"
            style={{
                bottom: 0,
                paddingBottom: insets.bottom,
                height: 60 + insets.bottom,
                zIndex: 50,
                elevation: 20, // Android fix
            }}
        >
            {state.routes.map((route: any, index: any) => {
                const isFocused = state.index === index;

                const icons: any = {
                    index: isFocused ? "home" : "home-outline",
                    transactions: isFocused ? "receipt" : "receipt-outline",
                    reports: isFocused ? "bar-chart" : "pie-chart-outline",
                    accounts: isFocused ? "person" : "person-outline",
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                        className="flex-1 items-center justify-center"
                    >
                        <Ionicons
                            name={icons[route.name]}
                            size={24}
                            color={isFocused ? "#000" : "#9CA3AF"}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}