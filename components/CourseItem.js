import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { authApis, endpoints } from '../utils/Apis';
import { MyUserContext } from '../utils/MyContexts';
import SmallCourseItem from '../components/SmallCourseItem';
import { Edit, Eye, EyeOff, Trash } from 'lucide-react-native';


const CourseItem = ({ course, deleteCourse, hideCourse, unhideCourse }) => {

    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    const getStatusColor = (status) => {
        if (status === 'Hoàn thành') return { bg: '#E8F5E9', text: '#2E7D32' }; 
        return { bg: '#E3F2FD', text: '#1565C0' }; 
    };

        const statusColors = getStatusColor(course.status);
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => 
                nav.navigate('CourseDetail', { courseId: course.id })}
        >
            <Surface style={styles.card} elevation={2}>
               
                <Image source={{ uri: course.image }} style={styles.cardImage} />
               
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <View style={styles.cardContent}>
                       
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                                <Text style={[styles.statusText, { color: statusColors.text }]}>
                                    {course.status || "Đang học"}
                                </Text>
                            </View>

                            {user.role === 'teacher' && (
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <TouchableOpacity onPress={() => deleteCourse(course.id)} style={{ padding: 4 }}>
                                        <Trash size={20} color="#EF4444" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => nav.navigate('CreateCourse', { courseId: course.id })} style={{ padding: 4, marginLeft: 8 }}>
                                        <Edit size={20} color="#1976D2" />
                                    </TouchableOpacity>

                                    {course.active ? (
                                        <TouchableOpacity onPress={() => hideCourse(course.id)} style={{ padding: 4, marginLeft: 8 }}>
                                            <EyeOff size={20} color="#4B5563" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={() => unhideCourse(course.id)} style={{ padding: 4, marginLeft: 8 }}>
                                            <Eye size={20} color="#4B5563" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>

                        <Text numberOfLines={2} style={styles.courseTitle}>
                            {course.title}
                        </Text>

                        <View style={styles.instructorContainer}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // Icon giảng viên
                                style={styles.instructorIcon}
                            />
                            <Text numberOfLines={1} style={styles.instructorName}>
                                {course.instructor.first_name || course.instructor}
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            contentStyle={{ height: 36 }}
                            onPress={() => nav.navigate('LessonDetail', { courseId: course.id })}
                        >
                            Tiếp tục học
                        </Button>
                    </View>


                </View>
            </Surface>
        </TouchableOpacity>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', 
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
        paddingBottom: 80, 
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
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
    actionButton: {
        borderRadius: 8,
        backgroundColor: '#2563EB', 
        alignSelf: 'flex-start',
    },
    actionButtonLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginVertical: 6,
        marginHorizontal: 12,
    },
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

export default CourseItem;