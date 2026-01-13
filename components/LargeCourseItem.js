import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Star, Clock, User } from 'lucide-react-native'; // Import icon vector
import Colors from "../styles/Colors"; // Giả sử bạn có file này

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6; // Card chiếm 75% màn hình (để scroll ngang đẹp)

const LargeCourseItem = ({ course }) => {
    const nav = useNavigation();

        const convertDuration = (miliseconds) => {
            let totalSeconds = Math.floor(miliseconds / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;
            if(hours>0)
                return `${hours} giờ ${minutes} phút ${seconds} giây`;
            else if(minutes>0)
                return `${minutes} phút ${seconds} giây`;
            else if(seconds>0)
                return `${seconds} giây`;
            return '0 giây';
        }

    // Format tiền tệ (Ví dụ)
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 500000);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => nav.navigate('CourseDetail', { courseId: course.id })}

            style={styles.container}
        >
            {/* 1. IMAGE SECTION */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: course.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Category Badge - Nổi trên ảnh */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{course.category.name}</Text>
                </View>
            </View>

            {/* 2. CONTENT SECTION */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {course.title}
                </Text>

                {/* Instructor */}
                <View style={styles.row}>
                    <User size={14} color="#666" style={{ marginRight: 4 }} />
                    <Text style={styles.instructor} numberOfLines={1}>
                        {course.instructor.last_name + " " + course.instructor.first_name}
                    </Text>
                </View>

                {/* Metrics: Rating & Duration */}
                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Star size={14} color="#FFD700" fill="#FFD700" style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{course.avg_rating.toFixed(1)}</Text>
                    </View>
                    
                    <View style={styles.separator} />

                    <View style={styles.metaItem}>
                        <Clock size={14} color="#666" style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{convertDuration(course.total_duration)}</Text>
                    </View>
                </View>

                {/* Price - Footer */}
                <View style={styles.footer}>
                    <Text style={styles.price}>{formattedPrice}</Text>
                    {/* Nút giả lập hoặc icon Add cart nếu cần */}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH, // Chiều rộng cố định để list đều nhau
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        marginVertical: 10,
        // Shadow iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Shadow Android
        elevation: 4,
        overflow: 'visible', // Để shadow hiện rõ
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150, // Tăng chiều cao ảnh
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    categoryBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)', // Nền đen mờ sang trọng
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a', // Đen dịu
        lineHeight: 22,
        marginBottom: 6,
        height: 44, // Giới hạn chiều cao cho 2 dòng text
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    instructor: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA', // Nền xám nhẹ cho thông số
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    metaSubText: {
        color: '#888',
        fontWeight: '400',
    },
    separator: {
        width: 1,
        height: 12,
        backgroundColor: '#ddd',
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2', // Màu chủ đạo (hoặc màu Cam #FF6B00)
    },
});

export default LargeCourseItem;