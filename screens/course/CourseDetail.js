import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from "expo";
import { ActivityIndicator, SegmentedButtons, Divider, Surface } from "react-native-paper";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import ReviewView from "../../components/views/ReviewView";
import DetailView from "../../components/views/DetailView";
import { formatCurrency } from "../../utils/Utils";
import { Star, User, Clock, MessageCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/MyContexts";
import StudentView from "../../components/views/StudentView";
import Theme from '../../styles/Theme';

const { width } = Dimensions.get('window');

const CourseDetail = () => {
    const route = useRoute();
    const { courseId } = route.params || {};
    const [user,] = useContext(MyUserContext);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('details');
    const nav = useNavigation();
    const loadCourseDetails = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['course_detail'](courseId));
            setCurrentCourse(res.data);
            console.log("Course Details:", res.data);
        } catch (error) {
            console.error("Failed to load course details:", error);
        } finally {
            setLoading(false);
        }
    }


    const loadStudents = async () => {
        if (user.role !== 'teacher') return;
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['course_students'](courseId));
            console.log("Course Students:", res.data);
        } catch (error) {
            console.error("Failed to load course students:", error);
        }
    }

    useEffect(() => {
        if (courseId) {
            loadCourseDetails();
            loadStudents();
        }
        console.log("Course ID:", currentCourse);
    }, [courseId]);

    const videoSource = currentCourse?.intro_video ?? '';

    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
    });


    useEffect(() => {
        const subscription = player.addListener('fullscreenChange', async () => {
            if (player.fullscreen) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } else {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        });
        return () => subscription.remove();
    }, [player]);


    if (loading || !currentCourse) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={{ marginTop: 10, color: Theme.colors.textMuted }}>Đang tải khóa học...</Text>
            </View>
        );
    }

    const buttons = [
        { label: 'Chi tiết', value: 'details', showSelectedCheck: true },
        { label: 'Đánh giá', value: 'reviews', showSelectedCheck: true },
        ...(user.role === 'teacher' ? [{ label: 'Sinh viên', value: 'students', showSelectedCheck: true }] : [])
    ];



    return (


        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Theme.colors.text} />

            <View style={styles.videoContainer}>
                <VideoView
                    style={styles.video}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                />
            </View>

            <Surface style={styles.contentSurface} elevation={0}>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{currentCourse.title}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.instructorInfo}>
                            <User size={16} color={Theme.colors.textMuted} />
                            <Text style={styles.instructorName}>
                                {currentCourse.instructor.last_name} {currentCourse.instructor.first_name}
                            </Text>
                            {user.role === 'student' && (
                                <TouchableOpacity
                                    style={styles.messageButton}
                                    onPress={() => {
                                        nav.replace('Chat', {
                                            partnerId: currentCourse.instructor.id,
                                            partnerName: `${currentCourse.instructor.last_name} ${currentCourse.instructor.first_name}`,
                                            partnerAvatar: currentCourse.instructor.avatar
                                        })

                                    }}
                                >
                                    <MessageCircle size={16} color={Theme.colors.surface} style={{ marginRight: 6 }} />
                                    <Text style={styles.messageButtonText}>Nhắn tin</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{(currentCourse.avg_rating || 0).toFixed(1)}</Text>
                            <Star size={14} color={Theme.colors.warning} fill={Theme.colors.warning} />
                        </View>
                    </View>

                    <Text style={styles.price}>{formatCurrency(currentCourse.price)}</Text>
                </View>

                <Divider style={{ marginVertical: 16 }} />

                <SegmentedButtons
                    value={view}
                    onValueChange={setView}
                    buttons={buttons}
                    density="medium"
                    style={styles.tabs}
                    theme={{ colors: { secondaryContainer: Theme.colors.primarySoft, onSecondaryContainer: Theme.colors.primary } }}
                />

                <View style={styles.viewContainer}>
                    {view === 'students' && user.role === 'teacher' ? (
                        <StudentView courseId={courseId} />
                    ) : view === 'details' ? (
                        <DetailView currentCourse={currentCourse} />
                    ) : (
                        <ReviewView courseId={courseId} />
                    )}

                </View>
            </Surface>
        </View>
    );
}



export default CourseDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.canvas,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        width: '100%',
        height: width * (9 / 16),
        backgroundColor: Theme.colors.text,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    contentSurface: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderTopLeftRadius: Theme.radius.lg,
        borderTopRightRadius: Theme.radius.lg,
        marginTop: -18,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
        minHeight: 500,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 8,
        lineHeight: 30,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 5,
        ...Theme.shadow,
    },
    messageButtonText: {
        color: Theme.colors.surface,
        fontWeight: '700',
        fontSize: 14,
    },
    instructorName: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        fontWeight: '600',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.warningSoft,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#A65B00',
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.primary,
    },
    tabs: {
        marginBottom: 20,
    },
    viewContainer: {
        flex: 1,
    }
});
