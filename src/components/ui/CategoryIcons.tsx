import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    name: string;
    size?: number;
    color?: string;
};

export function CategoryIcon({ name, size = 22, color = "#111" }: Props) {
    const iconMap: Record<
        string,
        { lib: "ion" | "material"; icon: string }
    > = {
        // Expense
        Makan: { lib: "ion", icon: "restaurant" },
        Belanja: { lib: "material", icon: "cart" },
        Transport: { lib: "material", icon: "car" },
        Tagihan: { lib: "material", icon: "file-document-outline" },
        Hiburan: { lib: "ion", icon: "game-controller" },
        Kesehatan: { lib: "material", icon: "medical-bag" },

        // Income
        Gaji: { lib: "material", icon: "briefcase" },
        Bonus: { lib: "material", icon: "cash-plus" },
        Freelance: { lib: "material", icon: "laptop" },
        Gift: { lib: "ion", icon: "gift" },
        Investasi: { lib: "material", icon: "chart-line" },
    };

    const config = iconMap[name];

    if (!config) {
        return (
            <Ionicons name="help-circle-outline" size={size} color={color} />
        );
    }

    if (config.lib === "ion") {
        return <Ionicons name={config.icon as any} size={size} color={color} />;
    }

    return (
        <MaterialCommunityIcons
            name={config.icon as any}
            size={size}
            color={color}
        />
    );
}