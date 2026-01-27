import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegisterProvider } from "../utils/providers/RegisterProvider";
import Account from "../screens/user/Account";
import Transaction from "../screens/user/Transaction";



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
