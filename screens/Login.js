import { View, Text, Image, TouchableOpacity } from "react-native";
import MyStyles from "../styles/MyStyles";
import TextField from "../components/TextField";
import React, { useState } from "react";
import { TextInput, Button } from 'react-native-paper';
import Spacing from "../styles/Spacing";
import axios from 'axios';


const Login = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({})
    const info = [{
        'label': 'Tên đăng nhập',
        'field': 'username',
        'leadingIcon': 'account'
    }, {
        'label': 'Mật khẩu',
        'field': 'password',
        'icon': 'eye',
        'leadingIcon': 'lock',
        'secureTextEntry': isSecure
    }]



    const getCategories = async () => {
        try {
            const response = await axios.get('http://0.0.0.0:8000/categories');
            console.log("Danh sách category:", response.data);
            return response.data; // Trả về danh sách category
        } catch (error) {
            console.error("Lỗi khi lấy danh sách category:", error);
            throw error; // Đẩy lỗi ra ngoài để nơi gọi hàm có thể xử lý
        }
    };

    return (

        <View style={[MyStyles.center, MyStyles.background]}>
            <Image source={require('../assets/app_logo.png')} style={{ width: 300, height: 200 }} />
            {info.map(i =>
                <TextField key={i.field}
                    placeholder={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={
                        i.field === 'password'
                            ? <TextInput.Icon icon="eye" onPress={() => setIsSecure(!isSecure)} />
                            : null
                    }
                    left={
                        <TextInput.Icon icon={i.leadingIcon} />
                    }
                    value={user[i.field]}
                    onChangeText={t => setUser({ ...user, [i.field]: t })}
                />
            )}

            <Button mode="contained" style={MyStyles.button} labelStyle={MyStyles.buttonText}>
                Đăng nhập
            </Button>
            <Text style={MyStyles.text}>Hoặc đăng nhập bằng</Text>
            <TouchableOpacity onPress={() => console.log('Pressed')} style={{
                backgroundColor: '#fff',
                padding: 10,
                alignSelf: 'center',
                borderRadius: 40
            }}
            >
                <Image
                    source={require('../assets/google.png')}
                    style={{ width: 50, height: 50, backgroundColor: 'white' }}
                />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', position: "absolute", bottom: 10, }}>
                <Text>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => {
                    navigation.replace('Register')
                }}>
                    <Text>Đăng ký</Text>

                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Login;