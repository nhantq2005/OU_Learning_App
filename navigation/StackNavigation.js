import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseDetail from "../screens/CourseDetail";
import Home from "../screens/Home";

const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="CourseDetail" component={CourseDetail} />
                </Stack.Navigator>
    );
}

export default StackNavigation;