import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./TabNavigation";
import AuthNavigation from "./AuthNavigation";




const AppNavigation = () => {
    // Lấy user từ Context
    const [user,] = useContext(MyUserContext);
    console.info("APP NAVIGATION - USER:", user);
    return (
        <NavigationContainer>
            {
                user === null ?
                    <AuthNavigation />
                    : 
                    <TabNavigation />
            }
        </NavigationContainer>
    );
}

export default AppNavigation;