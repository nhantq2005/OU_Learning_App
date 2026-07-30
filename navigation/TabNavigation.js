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
import { StyleSheet, View } from 'react-native';
import Theme from '../styles/Theme';


const TabNavigation = () => {
    const Tab = createBottomTabNavigator();
    const unreadCount = useContext(NotificationContext);
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Theme.colors.primary,
                tabBarInactiveTintColor: Theme.colors.textMuted,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="HomeMain"
                component={StackNavigation}
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <HomeIcon color={color} size={20} strokeWidth={focused ? 2.6 : 2} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="MyCourses"
                component={MyCourseNavigation}
                options={{
                    title: 'Khóa học của tôi',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <BookOpen color={color} size={20} strokeWidth={focused ? 2.6 : 2} />
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Messages"
                component={MessageNavigation}
                options={{
                    title: 'Tin nhắn',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <MessageCircleMore color={color} size={20} strokeWidth={focused ? 2.6 : 2} />
                        </View>
                    ),
                    tabBarBadge: unreadCount > 0 ? unreadCount : null,
                }}
            
            />

            <Tab.Screen
                name="Profile"
                component={AccountNavigation}
                options={{
                    title: 'Người dùng',
                    tabBarIcon: ({ color, focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <User color={color} size={20} strokeWidth={focused ? 2.6 : 2} />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;

const styles = StyleSheet.create({
    tabBar: {
        height: 72,
        paddingTop: 7,
        paddingBottom: 9,
        borderTopWidth: 0,
        backgroundColor: Theme.colors.surface,
        ...Theme.shadow,
    },
    tabItem: {
        borderRadius: Theme.radius.md,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 1,
    },
    iconWrap: {
        width: 38,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Theme.radius.pill,
    },
    iconWrapActive: {
        backgroundColor: Theme.colors.primarySoft,
    },
});
