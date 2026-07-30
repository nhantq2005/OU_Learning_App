import React, { useState, useEffect, useContext, use } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, Alert } from "react-native";
import { useVideoPlayer, VideoView } from 'expo-video';
import { ActivityIndicator, SegmentedButtons, Divider, FAB } from "react-native-paper";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation, useRoute } from "@react-navigation/native";
import { ListVideo, FileText } from "lucide-react-native";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import LessonsView from "../../components/views/LessonsView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/MyContexts";
import MyStyles from "../../styles/MyStyles";
import Theme from '../../styles/Theme';

const LessonDetail = () => {
    const route = useRoute();
    const courseId = route.params?.id;
    const nav = useNavigation();

    const [lessonId, setLessonId] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('list');
    const [user,] = useContext(MyUserContext);
    const [isCompleted, setIsCompleted] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const loadLessons = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let url = `${endpoints['lessons'](courseId)}?limit=15&offset=${offset}`;
            let res = await authApis(token).get(url);
            setHasNext(res.data.next !== null);

            if(offset ===0)
                setLessons(res.data.results);
            else
                setLessons([...lessons, ...res.data.results]);
        } catch (error) {
            console.error("Failed to load lessons:", error);
        } finally {
            setLoading(false);
        }
    }

    const loadLessonDetails = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['lesson_detail'](id));
            setCurrentLesson(res.data);
        } catch (error) {
            console.error("Failed to load lesson details:", error);
        }
    }

    const completeLesson = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(endpoints['complete_lesson'](id));
            console.log("Lesson marked as complete.", id);
        } catch (error) {
            console.error("Failed to mark lesson as complete:", error);
        }
    }


    const deleteLesson = async (lessonId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa mục này không?",
                [
                    { text: "Hủy", style: "cancel" },
                    {
                        text: "Đồng ý", onPress: async () => {
                            try {
                                await authApis(token).delete(endpoints['lesson_detail'](lessonId));
                                setLessons((prevLessons) => prevLessons.filter(c => c.id !== lessonId));
                                if (lessonId === lessonId) {
                                    setLessonId(null);
                                    setCurrentLesson(lessons.length > 0 ? lessons[0] : null);
                                }
                            } catch (err) {
                                console.error(err);
                                Alert.alert("Lỗi", "Không thể xóa bài học.");
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Failed to delete lesson:", error);
        }
    }

    const hideLesson = async (lessonId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(endpoints['hide_lesson'](lessonId));
            setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, active: false } : l));
        } catch (error) {
            console.error("Failed to hide lesson:", error);
        }
    }

    const unhideLesson = async (lessonId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(endpoints['unhide_lesson'](lessonId));
            setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, active: true } : l));
        } catch (error) {
            console.error("Failed to unhide lesson:", error);
        }
    }

    useEffect(() => {
        loadLessons();
    }, [courseId]);

    useEffect(() => {
        if (lessons.length > 0 && !lessonId) {
            setLessonId(lessons[0].id);
        }
    }, [lessons]);

    useEffect(() => {
        if (lessonId) {
            setIsCompleted(false);
            loadLessonDetails(lessonId);
        }
    }, [lessonId]);

        useEffect(() => {
            if (offset > 0) {
                loadCourses(offset);
            }
        }, [offset]);

    
    const loadMore = () => {
        if (hasNext && !loading) {
            setOffset(offset + 15);
        }
    }

    const videoSource = currentLesson?.video ?? '';
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play(); 
    });

    useEffect(() => {
        const subscription = player.addListener('fullscreenChange', async ({ fullscreen }) => {
            if (fullscreen) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } else {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        });
        return () => {
            subscription.remove();
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
    }, [player]);

   useEffect(() => {
        if (!player) return;

        const interval = setInterval(() => {
            const current = player.currentTime;
            const duration = player.duration;
            console.log(`Current Time: ${current}, Duration: ${duration}`);

            if (duration > 0 && !isCompleted && lessonId) {
                if ((current / duration) >= 0.7) {
                    console.log("✅ Interval Trigger: Done!");
                    setIsCompleted(true);
                    completeLesson(lessonId);
                }
            }
        }, 1000); 

        return () => clearInterval(interval);
    }, [player, lessonId, isCompleted]);

    const buttons = [
        {
            value: 'list',
            label: 'Danh sách bài',
            icon: ({ color }) => <ListVideo size={18} color={color} />
        },
        {
            value: 'details',
            label: 'Mô tả',
            icon: ({ color }) => <FileText size={18} color={color} />
        },
    ];

    if (loading && lessons.length === 0) {
        return (
            <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text style={styles.loadingText}>Đang tải nội dung...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.colors.text} />

            <View style={styles.videoContainer}>
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    contentFit="contain"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.lessonTitle}>
                        {currentLesson?.name || "Đang tải tiêu đề..."}
                    </Text>
                </View>

                <SegmentedButtons
                    value={view}
                    onValueChange={setView}
                    buttons={buttons}
                    density="medium"
                    style={styles.tabs}
                    theme={{ colors: { secondaryContainer: '#E3F2FD', onSecondaryContainer: '#1976D2' } }}
                />

                <Divider style={{ marginBottom: 10, backgroundColor: '#E0E0E0' }} />

                <View style={styles.tabContent}>
                    {view === 'list' ? (
                        <LessonsView
                            lessons={lessons}
                            currentLessonId={lessonId}
                            onPressLesson={(id) => { setLessonId(id); loadLessons(); }}
                            deleteLesson={deleteLesson}
                            hideLesson={hideLesson}
                            unhideLesson={unhideLesson}
                            refresh={() => loadLessons()}
                            loadMore={loadMore}
                            loading={loading}
                        />
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.descriptionBox}>
                                <Text style={styles.descriptionTitle}>Nội dung bài học</Text>
                                <Text style={styles.descriptionText}>
                                    {currentLesson?.description || "Chưa có mô tả cho bài học này."}
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </View>
            </View>
            {user.role === 'teacher' && (
                <FAB
                    icon="plus"
                    style={MyStyles.fab}
                    color={Theme.colors.surface}
                    onPress={() => nav.navigate('EditLesson', {  courseId: courseId })}
                />
            )}
        </View>
    );
}

export default LessonDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', 
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#64748B',
        fontSize: 14,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: Theme.colors.text,
        elevation: 4, 
    },
    video: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        marginBottom: 16,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        lineHeight: 28,
    },
    tabs: {
        marginBottom: 16,
    },
    tabContent: {
        flex: 1,
    },
    descriptionBox: {
        backgroundColor: Theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
    },
});