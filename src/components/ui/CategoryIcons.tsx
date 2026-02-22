import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    name: string;
    size?: number;
    color?: string;
};

export function CategoryIcon({ name, size = 22, color = "#111" }: Props) {
    const iconMap: Record<
        string,
        { lib: "ion" | "material" | "fontAwesome5"; icon: string }
    > = {
        // ======================
        // EXPENSE (Main)
        // ======================
        Makan: { lib: "ion", icon: "restaurant" },
        Belanja: { lib: "material", icon: "cart" },
        Transport: { lib: "material", icon: "car" },
        Tagihan: { lib: "material", icon: "file-document-outline" },
        Hiburan: { lib: "ion", icon: "game-controller" },
        Kesehatan: { lib: "material", icon: "medical-bag" },
        Pendidikan: { lib: "material", icon: "school" },

        // ======================
        // BELANJA (Sub)
        // ======================
        Sayuran: { lib: "fontAwesome5", icon: "seedling" },
        "Bahan Pokok": { lib: "fontAwesome5", icon: "bread-slice" },
        "Belanja Bulanan": { lib: "fontAwesome5", icon: "shopping-basket" },
        "Online Shop": { lib: "material", icon: "shopping" },

        // ======================
        // MAKAN (Sub)
        // ======================
        "Makan di luar": { lib: "ion", icon: "restaurant-outline" },
        Delivery: { lib: "material", icon: "motorbike" },
        Jajan: { lib: "material", icon: "cookie" },
        Minuman: { lib: "material", icon: "cup" },

        // ======================
        // TRANSPORT (Sub)
        // ======================
        Bensin: { lib: "material", icon: "gas-station" },
        Parkir: { lib: "material", icon: "parking" },
        "Servis Kendaraan": { lib: "material", icon: "tools" },
        Tol: { lib: "material", icon: "road-variant" },

        // ======================
        // TAGIHAN (Sub)
        // ======================
        Listrik: { lib: "material", icon: "flash" },
        Air: { lib: "material", icon: "water" },
        Internet: { lib: "material", icon: "wifi" },
        Pulsa: { lib: "material", icon: "cellphone" },

        // ======================
        // HIBURAN (Sub)
        // ======================
        Nonton: { lib: "material", icon: "movie" },
        Game: { lib: "ion", icon: "game-controller-outline" },
        Liburan: { lib: "material", icon: "airplane" },
        Langganan: { lib: "material", icon: "credit-card-refresh" },

        // ======================
        // KESEHATAN (Sub)
        // ======================
        Obat: { lib: "material", icon: "pill" },
        Dokter: { lib: "material", icon: "doctor" },
        Vitamin: { lib: "material", icon: "pill-multiple" },

        // ======================
        // PENDIDIKAN (Sub)
        // ======================
        "SPP Sekolah": { lib: "material", icon: "cash" },
        Buku: { lib: "material", icon: "book-open-variant" },
        Kuliah: { lib: "material", icon: "school-outline" },
        Kursus: { lib: "material", icon: "laptop" },

        // ======================
        // INCOME
        // ======================
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

    if (config.lib === "fontAwesome5") {
        return <FontAwesome5 name={config.icon as any} size={size} color={color} />;
    }

    return (
        <MaterialCommunityIcons
            name={config.icon as any}
            size={size}
            color={color}
        />
    );
}