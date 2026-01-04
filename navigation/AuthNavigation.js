import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChooseRole from "../screens/ChooseRole";
import Login from "../screens/Login";
import Onboarding from "../screens/Onboarding";
import RegisterAccount from "../screens/RegisterAccount";
import Splash from "../screens/Splash";
import { RegisterProvider } from "../utils/RegisterProvider";
import TabNavigation from "./TabNavigation";
import RegisterInfo from "../screens/RegisterInfo";

const AuthNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
            <RegisterProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={Splash} />
                    <Stack.Screen name="Onboarding" component={Onboarding} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="ChooseRole" component={ChooseRole} />
                    <Stack.Screen name="RegisterInfo" component={RegisterInfo} />
                    <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
                    <Stack.Screen name="TabNavigation" component={TabNavigation} />
                </Stack.Navigator>
            </RegisterProvider>
    );
};

export default AuthNavigation;
