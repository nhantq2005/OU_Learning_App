import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { authApis, endpoints } from '../../utils/Apis';
import { MyUserContext } from '../../utils/MyContexts';
import SmallCourseItem from '../../components/items/SmallCourseItem';
import { Edit, Eye, EyeOff, Trash } from 'lucide-react-native';
import CourseItem from '../../components/items/CourseItem';
import MyStyles from '../../styles/MyStyles';
import Theme from '../../styles/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';


const MyCourse = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    const loadMyCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let url = `${endpoints['my_courses']}?limit=20&offset=${offset}`;
            let res = await authApis(token).get(url);
            setHasNext(res.data.next !== null);
            if (offset === 0) {
                setCourses(res.data.results);
            } else {
                setCourses([...courses, ...res.data.results]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (offset > 0) {
            loadMyCourses();
        }
    }, [offset]);

        const loadMore = () => {
        if (hasNext && !loading) {
            setOffset(offset + 20);
        }
    }


    const loadTeacherCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let url = `${endpoints['teacher_courses'](user.id)}?limit=20&offset=${offset}`;
            let res = await authApis(token).get(url);
            setHasNext(res.data.next !== null);
            if (offset === 0) {
                setCourses(res.data.results);
            } else {
                setCourses([...courses, ...res.data.results]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user.role === 'teacher')
            loadTeacherCourses();
        else
            loadMyCourses();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setOffset(0);
        if (user.role === 'teacher')
            loadTeacherCourses();
        else
            loadMyCourses();
    }, []);

    const getStatusColor = (status) => {
        if (status === 'Hoàn thành') return { bg: '#E8F5E9', text: '#2E7D32' }; 
        return { bg: '#E3F2FD', text: '#1565C0' }; 
    };

    const deleteCourse = async (courseId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa khóa học này không?",
                [
                    { text: "Hủy", style: "cancel" },
                    {
                        text: "Đồng ý", onPress: async () => {
                            try {
                                await authApis(token).delete(endpoints['course_detail'](courseId));
                                setCourses((prevCourses) => prevCourses.filter(c => c.id !== courseId));
                            } catch (err) {
                                console.error(err);
                                Alert.alert("Lỗi", "Không thể xóa bài học.");
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Failed to delete course:", error);
        }
    }

    const hideCourse = async (courseId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(endpoints['hide_course'](courseId));
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, active: false } : c));
        } catch (error) {
            console.error("Failed to hide course:", error);
        }
    }

    const unhideCourse = async (courseId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await authApis(token).post(endpoints['unhide_course'](courseId));
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, active: true } : c));
        } catch (error) {
            console.error("Failed to unhide course:", error);
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Khóa học của tôi</Text>
                <Text style={styles.headerSubtitle}>Tiếp tục hành trình kiến thức 👋</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator animating={true} color={Theme.colors.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <CourseItem course={item} deleteCourse={deleteCourse} hideCourse={hideCourse} unhideCourse={unhideCourse} />}
                    contentContainerStyle={styles.listContainer}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.colors.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Image
                                source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/empty-box-4085812-3385481.png' }}
                                style={{ width: 200, height: 200, opacity: 0.8 }}
                            />
                            <Text style={{ color: Theme.colors.textMuted, marginTop: 10 }}>Bạn chưa đăng ký khóa học nào.</Text>
                        </View>
                    }
                />
            )}

            {user.role === 'teacher' && (
                <FAB
                    icon="plus"
                    style={MyStyles.fab}
                    color={Theme.colors.surface}
                    onPress={() => nav.navigate('CreateCourse')}
                />
            )}
        </SafeAreaView>
    );
};

export default MyCourse;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.canvas,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: Theme.colors.canvas,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Theme.colors.text,
        letterSpacing: -0.4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Theme.colors.textMuted,
        marginTop: 4,
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 80,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardImage: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
        lineHeight: 22,
    },
    instructorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    instructorIcon: {
        width: 14,
        height: 14,
        tintColor: '#94A3B8',
        marginRight: 4,
    },
    instructorName: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    }
});
