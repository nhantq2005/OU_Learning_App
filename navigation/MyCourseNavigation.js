import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateCourse from "../screens/course/CreateCourse"; 
import MyCourse from "../screens/course/MyCourse";
import CourseDetail from "../screens/course/CourseDetail";
import Enroll from "../screens/course/Enroll";
import LessonDetail from "../screens/lesson/LessonDetail";
import EditLesson from '../screens/lesson/EditLesson';
import Chat from "../screens/message/Chat";

const MyCourseNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyCourse" component={MyCourse} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="Enroll" component={Enroll} />
            <Stack.Screen name="LessonDetail" component={LessonDetail} />
            <Stack.Screen name="CreateCourse" component={CreateCourse} />
            <Stack.Screen name="EditLesson" component={EditLesson} />
            <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    );
}

export default MyCourseNavigation;