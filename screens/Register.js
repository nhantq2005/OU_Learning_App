import {View, Text, Image, TouchableOpacity} from "react-native";
import MyStyles from "../styles/MyStyles";
import TextField from "../components/TextField";
import React, {useState} from "react";
import {TextInput, Button} from 'react-native-paper';

const Register = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({})
    const info = [
        {
            'label': 'Họ',
            'field': 'last_name',
            'leadingIcon': 'card'
        },
        {
            'label': 'Tên',
            'field': 'first_name',
            'leadingIcon': 'card'
        },
        {
            'label': 'Email',
            'field': 'email',
            'leadingIcon': 'email'
        },
        {
            'label': 'Tên đăng nhập',
            'field': 'username',
            'leadingIcon': 'account'
        },
        {
            'label': 'Mật khẩu',
            'field': 'password',
            'icon': 'eye',
            'leadingIcon': 'lock',
            'secureTextEntry': isSecure
        },
        {
            'label': 'Nhập lại mật khẩu',
            'field': 'confirm',
            'icon': 'eye',
            'leadingIcon': 'lock',
            'secureTextEntry': isSecure
        }
    ]
    return (

        <View style={[MyStyles.center, MyStyles.background]}>
            <Image source={require('../assets/app_logo.png')} style={{width: 200, height: 200}}/>
            {info.map(i =>
                <TextField key={i.field}
                           placeholder={i.label}
                           secureTextEntry={i.secureTextEntry}
                           right={
                               i.field === 'password' && "confirm"
                                   ? <TextInput.Icon icon="eye" onPress={() => setIsSecure(!isSecure)}/>
                                   : null
                           }
                           left={
                               <TextInput.Icon icon={i.leadingIcon}/>
                           }
                           value={user[i.field]}
                           onChangeText={t => setUser({...user, [i.field]: t})}
                />
            )}
            <Button
                mode="contained"
                style={[MyStyles.buttonText, MyStyles.button]}
                labelStyle={{fontSize: 18}}>
                Đăng ký
            </Button>

            <View style={{flexDirection: 'row'}}>
                <Text>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => {
                    navigation.replace('Login')
                }}>
                    <Text>Đăng nhập</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Register;