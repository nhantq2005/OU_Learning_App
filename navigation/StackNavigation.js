import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CourseDetail from "../screens/course/CourseDetail";
import Home from "../screens/course/Home";
import Enroll from "../screens/course/Enroll";
import LessonDetail from "../screens/lesson/LessonDetail";
import EditLesson from "../screens/lesson/EditLesson";
import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";
import Statistic from "../screens/teacher/Statistic";
import Chat from "../screens/message/Chat";

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