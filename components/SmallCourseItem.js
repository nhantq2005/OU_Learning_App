import {Text, Searchbar, Avatar, Button, Card} from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import Colors from "../styles/Colors"
import {TouchableOpacity, View, Image} from "react-native";

const SmallCourseItem = () => {
    return (
        <TouchableOpacity activeOpacity={0.7} style={[MyStyles.card]}>
            <Card style={{backgroundColor:Colors.light.surface}}>
                <Card.Cover style={{width: "100%"}} source={{uri: 'https://picsum.photos/700'}}/>
                <Card.Content>
                    <Text style={[MyStyles.title,{color:"#FF6B00"}]} variant="titleSmall">Công nghệ thông tin</Text>
                    <Text style={[MyStyles.title,{fontWeight:"bold"}]} variant="titleLarge" numberOfLines={1} ellipsizeMode="tail">Các công nghệ lập trình hiện đại</Text>
                    <Text style={MyStyles.title} variant="bodyMedium">ThS. Dương Hữu Thành</Text>
                    <View style={[MyStyles.row,{alignItems:"center"}]}>
                        <Image source={require('../assets/star.png')} style={{width:16,height:16}}/>
                        <Text style={MyStyles.title} >4.5 (2000) | 20 giờ 45 phút</Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}

export default SmallCourseItem