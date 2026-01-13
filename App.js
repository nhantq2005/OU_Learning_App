import { StyleSheet, Text, View, Button } from 'react-native';
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home';
import { RegisterProvider } from './utils/RegisterProvider';
import { MyUserProvider } from './utils/MyUserProvider';
import AppNavigation from './navigation/AppNavigation';
import EditCourse from './screens/EditCourse';
import EditLesson from './screens/EditLesson';
import Enroll from './screens/Enroll';
import AuthNavigation from './navigation/AuthNavigation';
import TabNavigation from './navigation/TabNavigation';
import FillInfo from './screens/FillInfo';
import CreateCourse from './screens/CreateCourse';
import { Edit } from 'lucide-react-native';
import CourseDetail from './screens/CourseDetail';
import StackNavigation from './navigation/StackNavigation';
import LessonDetail from './screens/LessonDetail';
import Message from './screens/Message';



export default function App() {


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <MyUserProvider>
            {/* <CreateCourse/> */}
                {/* <LessonDetail /> */}
              {/* <NavigationContainer>  */}
                    <AppNavigation />
                    {/* <CreateCourse />
                </NavigationContainer> */}

{/* <EditLesson /> */}
                {/* <Message /> */}
            </MyUserProvider>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
