import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, User, BookOpen, MessageCircleMore } from 'lucide-react-native';
import { useContext } from 'react';
import { NotificationContext, MyUserContext } from '../utils/MyContexts';
import { StyleSheet, View } from 'react-native';
import Theme from '../styles/Theme';
import Home from '../screens/course/Home';
import Statistic from '../screens/teacher/Statistic';
import MyCourse from '../screens/course/MyCourse';
import Message from '../screens/message/Message';
import Account from '../screens/user/Account';
import { RegisterProvider } from '../utils/providers/RegisterProvider';

const Tab = createBottomTabNavigator();

const HomeTab = (props) => {
    const [user] = useContext(MyUserContext);
    return user?.role === 'teacher' ? <Statistic {...props} /> : <Home {...props} />;
};

const AccountTab = (props) => (
    <RegisterProvider>
        <Account {...props} />
    </RegisterProvider>
);

const TabNavigation = () => {

    const unreadCount = useContext(NotificationContext);

    const TABS = [
        { name: 'HomeMain', component: HomeTab, title: 'Trang chủ', Icon: HomeIcon },
        { name: 'MyCourses', component: MyCourse, title: 'Khóa học của tôi', Icon: BookOpen },
        { name: 'Messages', component: Message, title: 'Tin nhắn', Icon: MessageCircleMore, badge: unreadCount > 0 ? unreadCount : null },
        { name: 'Profile', component: AccountTab, title: 'Người dùng', Icon: User },
    ];

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
            {TABS.map(({ name, component, title, Icon, badge }) => (
                <Tab.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{
                        title,
                        ...(badge !== undefined && { tabBarBadge: badge }),
                        tabBarIcon: ({ color, focused }) => (
                            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                                <Icon color={color} size={20} strokeWidth={focused ? 2.6 : 2} />
                            </View>
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
};

export default TabNavigation;

const styles = StyleSheet.create({
    tabBar: {
        height: 68,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: Theme.colors.surface,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
    },
    iconWrap: {
        width: 48,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14, // Tạo hình viên thuốc bo tròn vừa phải
    },
    iconWrapActive: {
        backgroundColor: Theme.colors.primarySoft,
    },
});
