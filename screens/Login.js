import { View, Text, Image, TouchableOpacity } from "react-native";
import MyStyles from "../styles/MyStyles";
import TextField from "../components/TextField";
import React, { use, useContext, useState } from "react";
import { TextInput, Button, HelperText, Divider } from 'react-native-paper';
import Spacing from "../styles/Spacing";
import axios from 'axios';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Eye, EyeOff, CircleUser, LockKeyhole, Lock } from 'lucide-react-native';
import Apis, { authApis, endpoints } from "../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../utils/MyContexts";
import { useNavigation } from "@react-navigation/native";


const Login = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({})
    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();
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

                let userRes = await authApis(res.data.access_token).get(endpoints['current_user']);
                dispatch({
                    "type": "login",
                    "payload": userRes.data
                });
                setErrorMsg(null);
                console.info("TAI KHOAN", user)

            } catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    const msg = "Tài khoản hoặc mật khẩu không đúng! Vui lòng thử lại.";
                    setErrorMsg(msg);
                } else {
                    setErrorMsg("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
                    console.error("Login error:", ex);
                }
                setLoading(false);
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
                        left={i.leadingIcon}
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
                    loading={loading}
                    disabled={loading}
                    mode="contained"
                    style={[MyStyles.buttonText, MyStyles.button]}
                    labelStyle={{ fontSize: 18 }}>
                    Đăng nhập
                </Button>
                <Divider style={{ marginBottom: Spacing.md }} />

                <View style={{ flexDirection: 'row', bottom: 5 }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => {
                        nav.navigate('ChooseRole');
                    }}>
                        <Text>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Login;