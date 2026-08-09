import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./MainNavigation";
import AuthNavigation from "./AuthNavigation";

const AppNavigation = () => {
    const [user,] = useContext(MyUserContext);
    console.info("APP NAVIGATION - USER:", user);
    return (
        <NavigationContainer>
            {
                user === null ?
                    <AuthNavigation />
                    :
                    <MainNavigation />
            }
        </NavigationContainer>
    );
}

export default AppNavigation;