import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseDetail from "../screens/CourseDetail";
import Home from "../screens/Home";
import Enroll from "../screens/Enroll";
import MyCourse from "../screens/MyCourse";
import LessonDetail from "../screens/LessonDetail";
import EditLesson from "../screens/EditLesson";
import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";
import Statistic from "../screens/Statistic";
import Chat from "../screens/Chat";

const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
    const [user,]=useContext(MyUserContext);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user.role === 'teacher' ? (
                <Stack.Screen name="Home" component={Statistic} />
            ) : (
                <Stack.Screen name="Home" component={Home} />
            )}
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="Enroll" component={Enroll} />
            <Stack.Screen name="LessonDetail" component={LessonDetail} />
            <Stack.Screen name="EditLesson" component={EditLesson} />
            <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    );
}

export default StackNavigation;