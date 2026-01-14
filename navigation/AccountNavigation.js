import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegisterProvider } from "../utils/RegisterProvider";;
import Account from "../screens/Account";
import Transaction from "../screens/Transaction";

const AccountNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
            <RegisterProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>                   
                    <Stack.Screen name="Account" component={Account} />
                    <Stack.Screen name="Transaction" component={Transaction} />
                </Stack.Navigator>
            </RegisterProvider>
    );
};

export default AccountNavigation;
