import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();

function Dashboard() {
    return (
        <View>
            <Text>Dashboard</Text>
        </View>
    );
}

function Transactions() {
    return (
        <View>
            <Text>Transactions</Text>
        </View>
    );
}

function Reports() {
    return (
        <View>
            <Text>Reports</Text>
        </View>
    );
}

function Accounts() {
    return (
        <View>
            <Text>Accounts</Text>
        </View>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={Dashboard} />
                <Tab.Screen name="Transactions" component={Transactions} />
                <Tab.Screen name="Reports" component={Reports} />
                <Tab.Screen name="Accounts" component={Accounts} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
