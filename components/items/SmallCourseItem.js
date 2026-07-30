import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../../utils/Utils';
import Theme from '../../styles/Theme';

const SmallCourseItem = (course) => {
    const nav = useNavigation();
    const instructor = `${course.instructor?.last_name || ''} ${course.instructor?.first_name || ''}`.trim();

    return (
        <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => nav.navigate('CourseDetail', { courseId: course.id })}
            style={styles.card}
        >
            <Image source={{ uri: course.image }} style={styles.image} />

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {course.title}
                </Text>
                <Text style={styles.instructor} numberOfLines={1}>
                    {instructor}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.rating}>
                        <Star size={13} color={Theme.colors.warning} fill={Theme.colors.warning} />
                        <Text style={styles.ratingText}>{Number(course.avg_rating || 0).toFixed(1)}</Text>
                    </View>
                    <Text style={styles.price}>{formatCurrency(course.price)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Theme.colors.surface,
        padding: 10,
        borderRadius: Theme.radius.md,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
    },
    image: {
        width: 104,
        height: 92,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 5,
    },
    instructor: {
        fontSize: 13,
        color: Theme.colors.textMuted,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Theme.colors.warningSoft,
        borderRadius: Theme.radius.pill,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: {
        color: '#A65B00',
        fontWeight: '800',
        fontSize: 12,
    },
    price: {
        fontSize: 15,
        color: Theme.colors.primary,
        fontWeight: '800',
    },
});

export default SmallCourseItem;
