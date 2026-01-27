import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Surface, Text } from "react-native-paper"
import { formatCurrency } from "../../utils/Utils"
import { useNavigation } from "@react-navigation/native"
import { useContext } from "react"
import { MyUserContext } from "../../utils/MyContexts"
import { Trash, Edit, Eye, EyeOff } from 'lucide-react-native';


const SmallCourseItem = (course) => {
    const nav = useNavigation();
    const [user,] = useContext(MyUserContext);
    return (
        <TouchableOpacity
        onPress={() => nav.navigate('CourseDetail', { courseId: course.id })}
         style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 14,
            marginBottom: 10,
            marginRight: 14,
            elevation: 4,
            shadowColor: '#1976D2',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
        }}>
            <Image
                source={{ uri: course.image }}
                style={{ width: 100, height: 80, borderRadius: 10, resizeMode: 'cover' }}
        
            />
            <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1976D2', marginBottom: 2 }} numberOfLines={2} ellipsizeMode="tail">
                    {course.title}
                </Text>
                <Text style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 4 }} numberOfLines={1}>
                    {course.instructor.last_name + " " + course.instructor.first_name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6fa', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 13, color: '#1976D2', fontWeight: '600', marginRight: 2 }}>{course.avg_rating.toFixed(1)}</Text>
                        <Text style={{ fontSize: 13, color: '#FFD700' }}>★</Text>

                        
                    </View>
                    <Text style={{ fontSize: 15, color: '#FF6B00', fontWeight: 'bold', marginRight: 10 }}>
                        {formatCurrency(course.price)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SmallCourseItem

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