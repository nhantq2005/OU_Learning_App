import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";

import Message from "../screens/message/Message";
import Chat from "../screens/message/Chat";

const MessageNavigation = () => {
    const Stack = createNativeStackNavigator();
    const [user,]=useContext(MyUserContext);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    );
}

export default MessageNavigation;