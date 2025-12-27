import { View, Text, Image, TouchableOpacity } from "react-native";
import MyStyles from "../styles/MyStyles";
import TextField from "../components/TextField";
import React, { useState } from "react";
import { TextInput, Button, HelperText } from 'react-native-paper';
import Spacing from "../styles/Spacing";
import axios from 'axios';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Eye, EyeOff, CircleUser, LockKeyhole, Lock } from 'lucide-react-native';
import Apis, { endpoints } from "../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({})
    const iconColor = "black";
    const iconSize = 20;
    const info = [
        {
            label: 'Tên đăng nhập',
            field: 'username',
            leadingIcon: <CircleUser />
        },
        {
            label: 'Mật khẩu',
            field: 'password',
            leadingIcon: <LockKeyhole />,
            secureTextEntry: isSecure
        }]



    const validate = () => {
        if (!user.username || !user.password) {
            setErrorMsg("Vui lòng nhập đầy đủ thông tin!");
            return false;
        }
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                console.info(user);
                let res = await Apis.post(endpoints['login'], {
                    username: user.username,
                    password: user.password
                },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    });

                console.info(res.data);
                AsyncStorage.setItem('token', res.data.access_token);

                setTimeout(async () => {

                    let user = await authApis(res.data.access_token).get(endpoints['current_user']);
                    console.info(user.data);

                    // dispatch({
                    //     "type": "login",
                    //     "payload": user.data
                    // });
                }, 500);
                setErrorMsg(null);
                console.info(user)
            } catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    // Nếu backend trả về thông báo lỗi rõ ràng
                    const msg ="Tài khoản hoặc mật khẩu không đúng! Vui lòng thử lại.";
                    setErrorMsg(msg);
                } else {
                    setErrorMsg("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
                }
            } finally {
                setLoading(false);
            }
        }
    }


    return (

        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={20}
            style={[{ flex: 1 }, MyStyles.background]}
        >
            <View style={[{ flex: 1, alignItems: 'center' }]}>
                <Image source={require('../assets/app_logo.png')} style={{ width: 200, height: 150 }} />
                {info.map(i =>
                    <TextField key={i.field}
                        placeholder={i.label}
                        secureTextEntry={i.secureTextEntry}
                        // Truyền icon bên trái vào
                        left={i.leadingIcon}

                        // Xử lý icon ẩn/hiện mật khẩu bên phải
                        right={
                            i.field === 'password' || i.field === "confirm"
                                ? (
                                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                                        {isSecure
                                            ? <EyeOff color={iconColor} size={iconSize} />
                                            : <Eye color={iconColor} size={iconSize} />
                                        }
                                    </TouchableOpacity>
                                )
                                : null
                        }

                        value={user[i.field]}
                        onChangeText={t => setUser({ ...user, [i.field]: t })}
                    />
                )}
                <HelperText type="error" visible={errorMsg}>
                    {errorMsg}
                </HelperText>
                <Button
                    onPress={login}
                    mode="contained"
                    style={[MyStyles.buttonText, MyStyles.button]}
                    labelStyle={{ fontSize: 18 }}>
                    Đăng nhập
                </Button>

                <View style={{ flexDirection: 'row', bottom: 5 }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => {
                        // nav.navigate('Login');
                    }}>
                        <Text>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Login;