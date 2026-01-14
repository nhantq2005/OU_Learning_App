import { StyleSheet, Text, View, Button } from 'react-native';
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home';
import { RegisterProvider } from './utils/RegisterProvider';
import { MyUserProvider } from './utils/MyUserProvider';
import AppNavigation from './navigation/AppNavigation';
import { NotificationProvider } from './utils/NotificationProvider';



export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <MyUserProvider>
                <NotificationProvider>
                    <AppNavigation />
                </NotificationProvider>
            </MyUserProvider>
        </SafeAreaView>
    );
}
