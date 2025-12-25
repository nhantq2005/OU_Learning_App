import {View, Image} from 'react-native'
import {Text, Searchbar} from 'react-native-paper'
import MyStyles from "../styles/MyStyles";
import {useState} from "react";
import SmallCourseItem from "../components/SmallCourseItem";
import ChipCustom from "../components/ChipCustom";

const Home = () => {
    const [search, setSearch] = useState('');
    return (
        <View style={[ MyStyles.background]}>
            <View style={[MyStyles.row, {width: "100%", alignItems: "center", justifyContent: "space-between"}]}>
                <Text>Xin chào, Nhân</Text>
                <Image source={{uri: "https://i.pinimg.com/736x/fc/5f/0e/fc5f0e02b07c3065c0958b3f54e3dec5.jpg"}}
                       style={[MyStyles.avartar, {justifyContent: 'space-between', alignItems: 'center'}]}/>
            </View>
            <Searchbar
                placeholder="Search"
                onChangeText={setSearch}
                value={search}
                style={{backgroundColor:"#FFFFFF", borderRadius:15}}
            />
            <Text style={[MyStyles.title, {fontWeight: "bold", fontSize: 30}]}>Khóa học phổ biến</Text>
            <ChipCustom />
            <SmallCourseItem/>
        </View>
    )
}

export default Home;