// import React, { useState } from 'react';
// import { View } from 'react-native';
// import { BottomNavigation, Text, Provider } from 'react-native-paper';
// import { Book, Server } from 'lucide-react-native';
// import Home from '../screens/Home';

// function SettingsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings!</Text>
//     </View>
//   );
// }

// const NavBar = () => {
//   const [index, setIndex] = useState(0);

//   const routes = [
//     { key: 'home', title: 'Home', icon: 'book' },
//     { key: 'settings', title: 'Settings', icon: 'server' },
//   ];

//   const renderScene = ({ route }) => {
//     switch (route.key) {
//       case 'home':
//         return <Home />;
//       case 'settings':
//         return <SettingsScreen />;
//       default:
//         return null;
//     }
//   };

//   const renderIcon = ({ route, color }) => {
//     switch (route.icon) {
//       case 'book':
//         return <Book size={22} color={color} />;
//       case 'server':
//         return <Server size={22} color={color} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Provider>
//       {renderScene({ route: routes[index] })}
//       <BottomNavigation.Bar
//         navigationState={{ index, routes }}
//         onTabPress={({ route }) =>
//           setIndex(routes.findIndex(r => r.key === route.key))
//         }
//         renderIcon={renderIcon}
//         getLabelText={({ route }) => route.title}
//       />
//     </Provider>
//   );
// };

// export default NavBar;


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
import { RegisterNavigatior } from '../App';


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
