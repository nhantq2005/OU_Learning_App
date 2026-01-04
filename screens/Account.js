import { Image, TouchableOpacity, View } from 'react-native'
import Colors from '../styles/Colors';
import { Button, Card, Text } from 'react-native-paper';
import TextButton from '../components/TextButton';
import MyStyles from '../styles/MyStyles';
import { BookOpenCheck, CircleQuestionMark, Info, KeyRound, Sun } from 'lucide-react-native';
import { MyUserContext } from '../utils/MyContexts';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

const Account = () => {
    // ĐỔI MẬT KHÂẨU
    //ĐĂNG XUẤT
    //ĐỔI THÔNG TIN
    //BẬT LIGHT DARRK
    const [user, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();

    const logout = () => {
        dispatch({
            "type": "logout",
            "payload": null
        });
        console.info("Logged out", user);
        navigation.replace("Login");

    }



    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background, padding: 12, paddingTop: 30 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                <Image source={require('../assets/student.png')} style={[MyStyles.avartar, { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#1976D2', marginBottom: 10 }]} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 6, color: Colors.light.textPrimary }}>{user ? `${user.last_name} ${user.first_name}` : "Người dùng"}</Text>
                <Text style={{ fontSize: 15, color: Colors.light.textSecondary, marginBottom: 18 }}>{user ? user.email : "email@example.com"}</Text>
                <Button mode="contained" style={{ borderRadius: 16, backgroundColor: '#1976D2', marginBottom: 5, paddingHorizontal: 18, paddingVertical: 2, elevation: 2 }} labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Đổi thông tin cá nhân</Button>
            </View>

            <View style={{ backgroundColor: '#f5f6fa', borderRadius: 14, padding: 10, marginBottom: 5, elevation: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.textPrimary, marginBottom: 10 }}>Tài khoản</Text>
                <TextButton content="Đổi mật khẩu" icon={<KeyRound color="#1976D2" />} />
                <TextButton content="Khóa học của tôi" icon={<BookOpenCheck color="#1976D2" />} />
            </View>

            <View style={{ backgroundColor: '#f5f6fa', borderRadius: 14, padding: 10, marginBottom: 18, elevation: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.light.textPrimary, marginBottom: 10 }}>Cài đặt & Hỗ trợ</Text>
                <TextButton content="Giao diện" icon={<Sun color="#1976D2" />} />
                <TextButton content="Trợ giúp & Phản hồi" icon={<CircleQuestionMark color="#1976D2" />} />
                <TextButton content="Về ứng dụng" icon={<Info color="#1976D2" />} />
            </View>

            <Button mode="outlined"
                style={{
                    borderRadius: 16, borderColor: '#FF6B00',
                    backgroundColor: '#fff', marginTop: 8, width: '100%',
                    borderWidth: 2, paddingVertical: 4
                }}
                labelStyle={{ color: '#FF6B00', fontWeight: 'bold', fontSize: 16 }}
                onPress={logout}
            >
                Đăng xuất
            </Button>
        </View>
    );
}

export default Account;