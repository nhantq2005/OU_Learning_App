import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../styles/Theme';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: 'learn-online',
        image: 'https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic1_hvddev.png',
        eyebrow: 'HỌC THÔNG MINH',
        title: 'Học theo cách của bạn',
        subtitle: 'Khám phá các khóa học trực tuyến và bài giảng được chọn lọc cho hành trình của riêng bạn.',
    },
    {
        id: 'learn-anywhere',
        image: 'https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic2_cjpu2a.png',
        eyebrow: 'LINH HOẠT',
        title: 'Học mọi lúc, mọi nơi',
        subtitle: 'Xem lại bài giảng, theo dõi tiến độ và duy trì nhịp học dù bạn đang ở bất cứ đâu.',
    },
    {
        id: 'start-now',
        image: 'https://res.cloudinary.com/duk4u0tsp/image/upload/v1765481099/pic3_rhkm5r.png',
        eyebrow: 'SẴN SÀNG BỨT PHÁ',
        title: 'Bắt đầu hành trình mới',
        subtitle: 'Mỗi bài học nhỏ hôm nay là một bước gần hơn tới mục tiêu lớn của bạn.',
    },
];

const Onboarding = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const nav = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const finishOnboarding = async () => {
        await AsyncStorage.setItem('hasSeenIntro', 'true');
        nav.replace('Login');
    };

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            finishOnboarding();
            return;
        }

        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.canvas} />

            <View style={styles.topBar}>
                <View style={styles.brandMark}>
                    <Text style={styles.brandText}>OU</Text>
                </View>
                <Text style={styles.brandName}>OU Learning</Text>
                <TouchableOpacity onPress={finishOnboarding} hitSlop={12} style={styles.skipButton}>
                    <Text style={styles.skipText}>Bỏ qua</Text>
                </TouchableOpacity>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                style={styles.carousel}
                data={slides}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                    setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
                }}
                renderItem={({ item, index }) => (
                    <View style={styles.slide}>
                        <View style={[styles.artworkFrame, index === 1 && styles.artworkFrameTeal]}>
                            <View style={[styles.artworkGlow, index === 1 && styles.artworkGlowTeal]} />
                            <Image source={{ uri: item.image }} style={styles.artwork} resizeMode="contain" />
                        </View>

                        <View style={styles.copy}>
                            <Text style={[styles.eyebrow, index === 1 && styles.eyebrowTeal]}>{item.eyebrow}</Text>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footerCard}>
                <View style={styles.footerRow}>
                    <View>
                        <Text style={styles.stepLabel}>BƯỚC {currentIndex + 1} / {slides.length}</Text>
                        <View style={styles.dots}>
                            {slides.map((_, index) => {
                                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                                const dotWidth = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [8, 28, 8],
                                    extrapolate: 'clamp',
                                });
                                const dotColor = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [Theme.colors.border, Theme.colors.primary, Theme.colors.border],
                                    extrapolate: 'clamp',
                                });

                                return <Animated.View key={index} style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]} />;
                            })}
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleNext} activeOpacity={0.86} style={styles.nextButton}>
                        <Text style={styles.nextLabel}>{currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp tục'}</Text>
                        <ArrowRight size={19} color={Theme.colors.surface} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Theme.colors.canvas,
    },
    topBar: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    brandMark: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
        backgroundColor: Theme.colors.primary,
        ...Theme.shadow,
    },
    brandText: {
        color: Theme.colors.surface,
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    brandName: {
        marginLeft: 9,
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '800',
        flex: 1,
    },
    skipButton: {
        paddingVertical: 8,
        paddingLeft: 12,
    },
    skipText: {
        color: Theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '700',
    },
    carousel: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingBottom: 24,
    },
    artworkFrame: {
        width: Math.min(width - 72, 304),
        height: Math.min(width - 72, 304),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.primarySoft,
        borderRadius: 46,
        borderWidth: 1,
        borderColor: '#DCE2FF',
        overflow: 'hidden',
        marginBottom: 42,
    },
    artworkFrameTeal: {
        backgroundColor: Theme.colors.secondarySoft,
        borderColor: '#C7F3EB',
    },
    artworkGlow: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#DDE3FF',
        transform: [{ translateX: 64 }, { translateY: -70 }],
    },
    artworkGlowTeal: {
        backgroundColor: '#C7F3EB',
    },
    artwork: {
        width: '86%',
        height: '86%',
    },
    copy: {
        alignItems: 'center',
        maxWidth: 340,
    },
    eyebrow: {
        color: Theme.colors.primary,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    eyebrowTeal: {
        color: Theme.colors.secondary,
    },
    title: {
        color: Theme.colors.text,
        fontSize: 29,
        lineHeight: 36,
        fontWeight: '900',
        letterSpacing: -0.8,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        color: Theme.colors.textMuted,
        fontSize: 15,
        lineHeight: 23,
        textAlign: 'center',
    },
    footerCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 18,
        paddingVertical: 15,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stepLabel: {
        color: Theme.colors.textMuted,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.9,
        marginBottom: 8,
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 8,
    },
    dot: {
        height: 8,
        borderRadius: Theme.radius.pill,
        marginRight: 5,
    },
    nextButton: {
        minWidth: 124,
        height: 48,
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    nextLabel: {
        color: Theme.colors.surface,
        fontSize: 14,
        fontWeight: '800',
    },
});

export default Onboarding;
