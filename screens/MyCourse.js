import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { authApis, endpoints } from '../utils/Apis';
import { MyUserContext } from '../utils/MyContexts';
import SmallCourseItem from '../components/SmallCourseItem';

// Lấy chiều rộng màn hình để tính toán tỷ lệ
const { width } = Dimensions.get('window');

const MyCourse = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const loadMyCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['my_courses']);
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to load courses:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadTeacherCourses = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['teacher_courses'](user.id));
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to load teacher courses:", error);
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
        if (user.role === 'teacher')
            loadTeacherCourses();
        else
            loadMyCourses();
    }, []);

    // Helper: Màu sắc cho badge trạng thái
    const getStatusColor = (status) => {
        if (status === 'Hoàn thành') return { bg: '#E8F5E9', text: '#2E7D32' }; // Xanh lá nhạt
        return { bg: '#E3F2FD', text: '#1565C0' }; // Xanh dương nhạt
    };

    const renderCourseItem = ({ item }) => {
        const statusColors = getStatusColor(item.status);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => // Navigate trực tiếp trong Stack hiện tại
                    nav.navigate('CourseDetail', { courseId: item.id })}
            >
                <Surface style={styles.card} elevation={2}>
                    {/* Hình ảnh bên trái */}
                    <Image source={{ uri: item.image }} style={styles.cardImage} />

                    {/* Nội dung bên phải */}
                    <View style={styles.cardContent}>
                        {/* Badge trạng thái */}
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                            <Text style={[styles.statusText, { color: statusColors.text }]}>
                                {item.status || "Đang học"}
                            </Text>
                        </View>

                        <Text numberOfLines={2} style={styles.courseTitle}>
                            {item.title}
                        </Text>

                        <View style={styles.instructorContainer}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // Icon giảng viên
                                style={styles.instructorIcon}
                            />
                            <Text numberOfLines={1} style={styles.instructorName}>
                                {item.instructor.first_name || item.instructor}
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            contentStyle={{ height: 36 }}
                            onPress={() => nav.navigate('LessonDetail', { courseId: item.id })}
                        >
                            Tiếp tục học
                        </Button>
                    </View>
                </Surface>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Khóa học của tôi</Text>
                <Text style={styles.headerSubtitle}>Tiếp tục hành trình kiến thức 👋</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator animating={true} color="#1565C0" size="large" />
                </View>
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderCourseItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Image
                                source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/empty-box-4085812-3385481.png' }}
                                style={{ width: 200, height: 200, opacity: 0.8 }}
                            />
                            <Text style={{ color: '#999', marginTop: 10 }}>Bạn chưa đăng ký khóa học nào.</Text>
                        </View>
                    }
                />
            )}

            {user.role === 'teacher' && (
                <FAB
                    icon="plus"
                    style={styles.fab}
                    color="#fff"
                    onPress={() => nav.navigate('CreateCourse')}
                />
            )}
        </View>
    );
};

export default MyCourse;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Màu nền sáng hiện đại (Off-white)
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#F5F7FA',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
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
        paddingBottom: 80, // Để tránh bị FAB che mất item cuối
    },
    // --- Card Styles ---
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        // Hiệu ứng đổ bóng nhẹ
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3, // Android shadow
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
    actionButton: {
        borderRadius: 8,
        backgroundColor: '#2563EB', // Màu xanh hiện đại hơn #1976D2
        alignSelf: 'flex-start',
    },
    actionButtonLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginVertical: 6,
        marginHorizontal: 12,
    },
    // --- FAB Styles ---
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 10,
        backgroundColor: '#2563EB',
        borderRadius: 50,
        elevation: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    }
});