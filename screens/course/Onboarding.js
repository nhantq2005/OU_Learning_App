import React, {useRef, useState} from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Animated,
    Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MaterialIcons} from '@expo/vector-icons';
import MyStyles from "../../styles/MyStyles";
import Spacing from "../../styles/Spacing";
import { useNavigation } from "@react-navigation/native";

const {width} = Dimensions.get("window");

const slides = [
    {
        id: 1,
        image: "https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic1_hvddev.png",
        title: "Học tập trực tuyến",
        subtitle: "Chúng tôi cung cấp các khóa học trực tuyến và các bài giảng được ghi hình!",
    },
    {
        id: 2,
        image: "https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic2_cjpu2a.png",
        title: "Học mọi lúc, mọi nơi",
        subtitle: "Tham dự hoặc xem trực tuyến các bài giảng để học tập linh hoạt.",
    },
    {
        id: 3,
        image: "https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic3_rhkm5r.png",
        title: "Bắt đầu học tập nào",
        subtitle: "",
    },
];
const Onboarding = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const nav = useNavigation();

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({index: currentIndex + 1});
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = async () => {
        await AsyncStorage.setItem("hasSeenIntro", "true");
        nav.replace("Login");
    };

    return (
        <View style={[{flex: 1, backgroundColor: "#F7F9FC",padding: Spacing.sm}, ]}>
            <TouchableOpacity
                onPress={finishOnboarding}
                style={{position: "absolute", top: 30, right: 20, zIndex: 10}}
            >
                <Text style={{color: "#A0A3B1", fontSize: 17}}>Bỏ qua</Text>
            </TouchableOpacity>
            <View style={{flex: 8}}>
                <Animated.FlatList
                    ref={flatListRef}
                    data={slides}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {x: scrollX}}}],
                        {useNativeDriver: false}
                    )}
                    onMomentumScrollEnd={(e) => {
                        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(idx);
                    }}
                    renderItem={({item}) => (
                        <View
                            style={{
                                width,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 30,
                            }}
                        >
                            <Image source={{uri: item.image}} style={{width: 250, height: 250}}/>
                            <Text style={{fontSize: 24, fontWeight: "600", marginBottom: 10}}>
                                {item.title}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: "#999",
                                    textAlign: "center",
                                    width: "75%",
                                }}
                            >
                                {item.subtitle}
                            </Text>
                        </View>
                    )}
                />
            </View>

            <View style={{flexDirection: "row",justifyContent:"space-between",  alignItems: "center",  flex: 1}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignSelf: "center",

                    }}
                >
                    {slides.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 24, 8],
                            extrapolate: "clamp",
                        });

                        const dotColor = scrollX.interpolate({
                            inputRange,
                            outputRange: ["#d0d3db", "#2D73FF", "#d0d3db"],
                            extrapolate: "clamp",
                        });

                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: dotColor,
                                    width: dotWidth,
                                    marginHorizontal: 4,
                                }}
                            />
                        );
                    })}
                </View>

                <TouchableOpacity
                    onPress={handleNext}
                    style={{
                        borderRadius: 30,
                        backgroundColor: "#2D73FF",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {currentIndex === slides.length - 1 ? (
                        <Text style={{color: "#fff", fontWeight: "600", padding:Spacing.md}}>Bắt đầu</Text>
                    ) : (
                        <MaterialIcons name="arrow-forward" size={32} color='#fff' style={{ padding:Spacing.sm }} />
                    )}
                </TouchableOpacity>
            </View>

        </View>
    );
}


export default Onboarding;