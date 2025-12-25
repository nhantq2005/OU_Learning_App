import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import Register from "./screens/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { TextField } from './components/TextField';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './screens/Home';

import Spacing from "./styles/Spacing";
import { use, useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

const StackNavigatior = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />

        </Stack.Navigator>
    )
}





export default function App() {
    const [cate, setCate] = useState([])

const fetchData = async () => {
    try {
        const res = await axios.get(
            "http://192.168.113.105:8000/categories/"
        );
        setCate(res.data.results);
        console.log("RAW DATA:", res.data);
    } catch (err) {
        console.log("ERROR:", err.message);
    }
};

useEffect(() => {
    fetchData();
}, []);


    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            {/*<NavigationContainer>*/}
            {/*    <StackNavigatior/>*/}
            {/*</NavigationContainer>*/}
            <Home />
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
