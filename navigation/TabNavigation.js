import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, User, LogIn, UserPlus, BookOpen } from 'lucide-react-native';
import Account from '../screens/Account';
import Message from '../screens/Message';
import { MessageCircleMore } from 'lucide-react-native/icons';
import MyCourses from '../screens/MyCourse';
// import { RegisterNavigatior } from '../App';
import Home from '../screens/Home';
import StackNavigation from './StackNavigation';
import MyCourseNavigation from './MyCourseNavigation';


const TabNavigation = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1976D2',
                tabBarInactiveTintColor: '#999',
            }}
        >
            <Tab.Screen
                name="HomeMain"
                component={StackNavigation}
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => (
                        <HomeIcon color={color} size={size} />
                    ),
                }}
            />


            <>
                <Tab.Screen
                    name="MyCourses"
                    component={MyCourseNavigation}
                    options={{
                        title: 'Khóa học của tôi',
                        tabBarIcon: ({ color, size }) => (
                            <BookOpen color={color} size={size} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Messages"
                    component={Message}
                    options={{
                        title: 'Tin nhắn',
                        tabBarIcon: ({ color, size }) => (
                            <MessageCircleMore color={color} size={size} />
                        ),
                        tabBarBadge: 2,
                    }}
                />
            </>

            <Tab.Screen
                name="Profile"
                component={Account}
                options={{
                    title: 'Người dùng',
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;