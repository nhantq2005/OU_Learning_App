import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";

// Import all detail screens
import CourseDetail from "../screens/course/CourseDetail";
import Enroll from "../screens/course/Enroll";
import CreateCourse from "../screens/course/CreateCourse";
import LessonDetail from "../screens/lesson/LessonDetail";
import EditLesson from "../screens/lesson/EditLesson";
import Chat from "../screens/message/Chat";
import Transaction from "../screens/user/Transaction";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* The Bottom Tabs acts as the root screen of the app */}
            <Stack.Screen name="MainTabs" component={TabNavigation} />
            
            {/* Common Detail Screens that can be accessed from any tab */}
            <Stack.Screen name="CourseDetail" component={CourseDetail} />
            <Stack.Screen name="Enroll" component={Enroll} />
            <Stack.Screen name="CreateCourse" component={CreateCourse} />
            <Stack.Screen name="LessonDetail" component={LessonDetail} />
            <Stack.Screen name="EditLesson" component={EditLesson} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Transaction" component={Transaction} />
        </Stack.Navigator>
    );
};

export default MainNavigation;
