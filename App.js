import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { TextField } from './components/TextField';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home';
import RegisterAccount from './screens/RegisterAccount';

import Spacing from "./styles/Spacing";
import { use, useEffect, useState } from 'react';
import ChooseRole from './screens/ChooseRole';
import { RegisterProvider } from './utils/RegisterProvider';
import RegisterInfo from './screens/RegisterInfo';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const StackNavigatior = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterInfo" component={RegisterInfo} />

        </Stack.Navigator>
    )
}

const RegisterNavigatior = () => {
    return (
        <PaperProvider>
        <RegisterProvider>
            <NavigationContainer>
                <Stack.Navigator  screenOptions={{headerShown: false}}>
                    <Stack.Screen name="ChooseRole" component={ChooseRole} />
                    <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
                    <Stack.Screen name="RegisterInfo" component={RegisterInfo} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        </RegisterProvider>
        </PaperProvider>
    )
}





export default function App() {
    // const [cate, setCate] = useState([])

    // const [categories, setCategories] = useState([]);

    // const loadCategories = async () => {
    //     let res = await Apis.get(endpoints['categories']);
    //     setCategories(res.data.results);
    //     console.info(`Categories: ${res.data.results}`);
    // }

    // useEffect(() => {
    //     loadCategories();;
    // }, []);


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/*<NavigationContainer>*/}
            {/*    <StackNavigatior/>*/}
            {/*</NavigationContainer>*/}
            {/* <Register /> */}
            <RegisterNavigatior />
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
