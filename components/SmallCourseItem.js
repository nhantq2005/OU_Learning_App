import {Text, Searchbar, Avatar, Button, Card} from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import Colors from "../styles/Colors"
import {TouchableOpacity, View, Image} from "react-native";

const SmallCourseItem = () => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={{
                marginVertical: 10,
                alignSelf: 'center',
                width: '88%', // Giảm width xuống cho phù hợp
                borderRadius: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 5,
                backgroundColor: Colors.light.surface,
            }}
        >
            <Card style={{
                backgroundColor: Colors.light.surface,
                borderRadius: 18,
                overflow: 'hidden',
                elevation: 0,
            }}>
                <Card.Cover
                    source={{ uri: 'https://picsum.photos/700' }}
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
                    <Text style={{ color: '#FF6B00', fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>Công nghệ thông tin</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#222', marginBottom: 4 }} numberOfLines={1} ellipsizeMode="tail">
                        Các công nghệ lập trình hiện đại
                    </Text>
                    <Text style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>ThS. Dương Hữu Thành</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Image source={require('../assets/star.png')} style={{ width: 16, height: 16, marginRight: 4 }} />
                        <Text style={{ color: '#444', fontSize: 13 }}>4.5 (2000) | <Text style={{ color: '#1976D2' }}>20 giờ 45 phút</Text></Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}

export default SmallCourseItem