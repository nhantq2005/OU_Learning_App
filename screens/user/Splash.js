import {View, Image, Animated} from "react-native";
import MyStyles from "../../styles/MyStyles";
import {useEffect, useRef} from "react";
import { useNavigation } from "@react-navigation/native";



const Splash = ({}) => {
    const navigation = useNavigation();
    const fadeAnimation = useRef(new Animated.Value(0)).current; 

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 1,         
            duration: 1000,     
            useNativeDriver: true,
        }).start(() => {
            navigation.replace("Onboarding");
        });
    }, [fadeAnimation]);
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9FC'}}>
            <Animated.Image
                source={require('../../assets/logo.png')}
                style={{ width: 350, height: 350, opacity: fadeAnimation }}
                resizeMode="contain"
            />
        </View>
    )
}

export default Splash;