import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChooseRole from "../screens/user/ChooseRole";
import Login from "../screens/user/Login";
import Onboarding from "../screens/course/Onboarding";
import RegisterAccount from "../screens/user/RegisterAccount";
import Splash from "../screens/user/Splash";
import { RegisterProvider } from "../utils/providers/RegisterProvider";
import TabNavigation from "./TabNavigation";
import RegisterInfo from "../screens/user/RegisterInfo";
import FillInfo from "../screens/user/FillInfo";
import Account from "../screens/user/Account";

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
                    <Stack.Screen name="FillInfo" component={FillInfo} />
                    <Stack.Screen name="TabNavigation" component={TabNavigation} />
                    <Stack.Screen name="Account" component={Account} />
                </Stack.Navigator>
            </RegisterProvider>
    );
};

export default AuthNavigation;
