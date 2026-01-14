import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateCourse from "../screens/CreateCourse"; 
import MyCourse from "../screens/MyCourse";
import CourseDetail from "../screens/CourseDetail";
import Enroll from "../screens/Enroll";
import LessonDetail from "../screens/LessonDetail";
import EditLesson from '../screens/EditLesson';

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
        </Stack.Navigator>
    );
}

export default MyCourseNavigation;