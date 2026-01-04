

import { View, Text } from "react-native";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from "expo";
import { ActivityIndicator, Button, SegmentedButtons } from "react-native-paper";
//GIÚP XOAY NGANG MÀN HÌNH KHI VÀO FULLSCREEN
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../utils/Apis";
import { useRoute } from "@react-navigation/native";
import TagItem from "../components/TagItem";
import ReviewView from "../components/ReviewView";
import { ScrollView } from "react-native";
import DetailView from "../components/DetailView";
import { formatCurrency } from "../utils/Utils";

const CourseDetail = () => {
    // Debug: log route params để kiểm tra truyền courseId
    ;
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    console.log('CourseDetail route.params:', route.params)
    const { courseId } = route.params || {};

    const [view, setView] = useState('details');
    const button = [
        { label: 'Chi tiết khóa học', value: 'details' },
        { label: 'Đánh giá', value: 'reviews', view: <ReviewView /> },
    ];

    const loadCourseDetails = async () => {
        try {
            setLoading(true);
            console.info("Loading details for courseId:", courseId);
            let res = await Apis.get(endpoints['course_detail'](courseId));
            setCurrentCourse(res.data);
            console.info("Course details loaded:", res.data);
        } catch (error) {
            setLoading(false);
            console.error("Failed to load course details:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (courseId) loadCourseDetails();
    }, [courseId]);

    const videoSource = currentCourse?.intro_video ?? '';


    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
    });

    // useEffect(() => {
    //     return () => {
    //         if (player && typeof player.pause === 'function') {
    //             player.pause();
    //         }
    //     };
    // }, [player]);



    useEvent(player, 'fullscreenChange', async () => {
        console.log('Fullscreen changed:', player.fullscreen);
        if (player.fullscreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    // Dữ liệu mẫu, bạn có thể thay bằng props hoặc API
    const course = {
        title: 'Lập trình React Native từ cơ bản đến nâng cao',
        description: 'Khóa học giúp bạn làm chủ React Native, xây dựng ứng dụng di động đa nền tảng chuyên nghiệp.',
        instructor: 'ThS. Dương Hữu Thành',
        price: '499.000đ',
        rating: 4.8,
        ratingCount: 120,
        image: 'https://img.freepik.com/premium-vector/online-education-concept-illustration_114360-6261.jpg?w=2000',
        duration: 120,
    };

    useEffect(() => {
        // Đăng ký sự kiện
        const subscription = player.addListener('fullscreenChange', async (data) => {
            // Lưu ý: data.fullscreen hoặc player.fullscreen tùy phiên bản expo-video
            if (player.fullscreen) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } else {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
        });

        // Cleanup function chuẩn (trả về void, không phải Promise)
        return () => {
            subscription.remove();
        };
    }, [player]);

    if (currentCourse === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2568acff" />
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#2568acff" />
                    <Text>Đang tải dữ liệu...</Text>
                </View>
            ) :
                <>
                    <VideoView style={{ width: '100%', height: 215, backgroundColor: '#000', borderRadius: 5, marginTop: 12 }} player={player} fullscreenOptions={{ enabled: true }} />
                    <View style={{ padding: 18 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#2568acff', marginBottom: 4 }}>{currentCourse.title}</Text>
                                <Text style={{ color: '#666', fontSize: 15, marginBottom: 6 }}>{currentCourse.instructor.last_name + " " + currentCourse.instructor.first_name}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 18, color: '#FF6B00', fontWeight: 'bold' }}>{formatCurrency(currentCourse.price)}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                    {/* <Text style={{ fontSize: 15, color: '#1976D2', fontWeight: '600', marginRight: 2 }}>{course.rating}</Text> */}
                                    <Text style={{ fontSize: 15, color: '#FFD700' }}>★</Text>
                                    {/* <Text style={{ fontSize: 13, color: '#888', marginLeft: 2 }}>({course.ratingCount})</Text> */}
                                </View>
                            </View>
                        </View>
                        <SegmentedButtons
                            value={view}
                            onValueChange={setView}
                            buttons={button}
                        />
                        {view === 'details' ? (
                            // <ScrollView style={{ flex: 1, marginTop: 12 }} >
                                <DetailView currentCourse={currentCourse} />
                           
                        ) : (
                            <ReviewView courseId={courseId} />
                        )}

                    </View>
                </>}
        </View>

    );
}


export default CourseDetail;

