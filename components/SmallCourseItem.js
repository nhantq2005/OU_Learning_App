import { Image, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"
import { formatCurrency } from "../utils/Utils"
import { useNavigation } from "@react-navigation/native"


const SmallCourseItem = (course) => {
    const nav = useNavigation();
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
                        <Text style={{ fontSize: 13, color: '#1976D2', fontWeight: '600', marginRight: 2 }}>4.8</Text>
                        <Text style={{ fontSize: 13, color: '#FFD700' }}>★</Text>
                        <Text style={{ fontSize: 12, color: '#888', marginLeft: 2 }}>(120)</Text>

                        
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