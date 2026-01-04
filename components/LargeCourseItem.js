import {Text, Searchbar, Avatar, Button, Card} from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import Colors from "../styles/Colors"
import {TouchableOpacity, View, Image} from "react-native";
import Spacing from '../styles/Spacing';
import { useNavigation } from '@react-navigation/native';

const LargeCourseItem = ({course}) => {
    const nav = useNavigation()
    return (
        <>
        <TouchableOpacity
            activeOpacity={0.85}
            style={{
                marginVertical: 10,
                alignSelf: 'center',
                borderRadius: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 5,
                backgroundColor: Colors.light.surface,
                marginRight: Spacing.sm
            }}

            onPress={() => nav.navigate('CourseDetail', { courseId: course.id }) }
        >
            <Card style={{
                backgroundColor: Colors.light.surface,
                borderRadius: 18,
                overflow: 'hidden',
                elevation: 0,
                padding:5
            }}>
                <Card.Cover
                    source={{ uri: course.image }}
                    style={{
                        width: '100%',
                        height: 120,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        
                    }}
                />
                <Card.Content style={{ paddingVertical: 12, paddingHorizontal: 10 }}>
                    <Text style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>{course.category.name}</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#222', marginBottom: 4 }} numberOfLines={1} ellipsizeMode="tail">
                        {course.title}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>{course.instructor.last_name + " " + course.instructor.first_name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Image source={require('../assets/star.png')} style={{ width: 16, height: 16, marginRight: 4 }} />
                        <Text style={{ color: '#444', fontSize: 13 }}>4.5 (2000) | <Text style={{ color: '#1976D2' }}>20 giờ 45 phút</Text></Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
        </>
    )
}

export default LargeCourseItem;