import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Star, Clock, User } from 'lucide-react-native'; 
import Theme from '../../styles/Theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6; 

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

    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 500000);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => nav.navigate('CourseDetail', { courseId: course.id })}

            style={styles.container}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: course.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{course.category?.name || 'Khóa học'}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {course.title}
                </Text>

                <View style={styles.row}>
                    <User size={14} color={Theme.colors.textMuted} style={{ marginRight: 5 }} />
                    <Text style={styles.instructor} numberOfLines={1}>
                        {`${course.instructor?.last_name || ''} ${course.instructor?.first_name || ''}`.trim()}
                    </Text>
                </View>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Star size={14} color={Theme.colors.warning} fill={Theme.colors.warning} style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{Number(course.avg_rating || 0).toFixed(1)}</Text>
                    </View>
                    
                    <View style={styles.separator} />

                    <View style={styles.metaItem}>
                        <Clock size={14} color={Theme.colors.textMuted} style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{convertDuration(course.total_duration)}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>{formattedPrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.md,
        marginRight: 14,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 158,
        borderTopLeftRadius: Theme.radius.md,
        borderTopRightRadius: Theme.radius.md,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(23,32,51,0.78)',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: Theme.radius.pill,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    content: {
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
        lineHeight: 22,
        marginBottom: 8,
        height: 44,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    instructor: {
        color: Theme.colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surfaceMuted,
        paddingVertical: 8,
        paddingHorizontal: 9,
        borderRadius: 10,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 11,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    metaSubText: {
        color: Theme.colors.textMuted,
        fontWeight: '400',
    },
    separator: {
        width: 1,
        height: 12,
        backgroundColor: Theme.colors.border,
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 17,
        fontWeight: '800',
        color: Theme.colors.primary,
    },
});

export default LargeCourseItem;
