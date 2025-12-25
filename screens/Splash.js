import {View, Image, Animated} from "react-native";
import MyStyles from "../styles/MyStyles";
import {useEffect, useRef} from "react";



const Splash = ({navigation}) => {
    const fadeAnimation = useRef(new Animated.Value(0)).current; // Giá trị opacity ban đầu = 0

    useEffect(() => {
        Animated.timing(fadeAnimation, {
            toValue: 1,         // Fade đến opacity = 1
            duration: 1000,     // 1 giây
            useNativeDriver: true,
        }).start(() => {
            navigation.replace("Onboarding");
        });
    }, [fadeAnimation]);
    return (
        <View style={[MyStyles.center,{backgroundColor:"white"}]}>
            <Animated.Image
                source={require('../assets/logo.png')}
                style={{ width: 350, height: 350, opacity: fadeAnimation }}
                resizeMode="contain"
            />
        </View>
    )
}

export default Splash;