


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { Home as HomeIcon, User, LogIn, UserPlus, BookOpen } from 'lucide-react-native';
import Home from '../screens/Home';
import Account from '../screens/Account';
import Login from '../screens/Login';
import ChooseRole from '../screens/ChooseRole';
import SearchCourse from '../screens/SearchCourse';
import Message from '../screens/Message';
import { MessageCircleMore } from 'lucide-react-native/icons';
import MyCourses from '../screens/MyCourse';
import { RegisterNavigatior } from '../../App';


const NavBar = () => {
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
        name="Home"
        component={RegisterNavigatior}
        options={{
          title: 'Khóa học',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      
        <>
          <Tab.Screen
            name="MyCourses"
            component={MyCourses}
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

export default NavBar;
