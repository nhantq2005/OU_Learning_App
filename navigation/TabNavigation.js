import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, User, LogIn, UserPlus, BookOpen } from 'lucide-react-native';
import Account from '../screens/user/Account';
import { MessageCircleMore } from 'lucide-react-native/icons';
import StackNavigation from './StackNavigation';
import MyCourseNavigation from './MyCourseNavigation';
import MessageNavigation from './MessageNavigation';
import { useContext } from 'react';
import { NotificationContext } from '../utils/MyContexts';
import AccountNavigation from './AccountNavigation';


const TabNavigation = () => {
    const Tab = createBottomTabNavigator();
    const unreadCount = useContext(NotificationContext);
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
                component={MessageNavigation}
                options={{
                    title: 'Tin nhắn',
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircleMore color={color} size={size} />
                    ),
                    tabBarBadge: unreadCount > 0 ? unreadCount : null,
                }}
            
            />

            <Tab.Screen
                name="Profile"
                component={AccountNavigation}
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