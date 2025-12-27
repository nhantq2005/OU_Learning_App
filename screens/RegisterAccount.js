import { Image, Text, TouchableOpacity, View } from "react-native";
import TextField from "../components/TextField";

import { Eye, EyeOff, CircleUser, LockKeyhole, Lock } from 'lucide-react-native';
import { useContext, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, HelperText } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { RegisterContext } from "../utils/MyContexts";
import { Dimensions } from 'react-native';

const RegisterAccount = () => {

    const [user, setUser] = useState({});
    const [isSecure, setIsSecure] = useState(true);
    const [errorMsg, setErrorMsg] = useState();
    const nav = useNavigation();
    const screenHeight = Dimensions.get('window').height;
    const { registerData, updateRegisterData } = useContext(RegisterContext);
    // const nav = useNavigation()


    // Icon nên có màu và kích thước cụ thể để dễ nhìn
    const iconColor = "black";
    const iconSize = 20;

    const info = [
        {
            'label': 'Tên đăng nhập',
            'field': 'username',
            'leadingIcon': <CircleUser color={iconColor} size={iconSize} />
        },
        {
            'label': 'Mật khẩu',
            'field': 'password',
            'leadingIcon': <LockKeyhole color={iconColor} size={iconSize} />,
            'secureTextEntry': isSecure
        },
        {
            'label': 'Nhập lại mật khẩu',
            'field': 'confirm',
            'leadingIcon': <Lock color={iconColor} size={iconSize} />,
            'secureTextEntry': isSecure
        }
    ]


    const validate = () => {
        if (user['password'] !== user['confirm']) {
            setErrorMsg("Mật khẩu không khớp!");
            return false;
        }

        if (!user['username'] || !user['password'] || !user['confirm']) {
            setErrorMsg("Vui lòng điền đầy đủ thông tin!");
            return false;
        }

        if (!user.password || user.password.length < 8) {
            setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự!");
            return false;
        }

        setErrorMsg(null);
        return true;
    }


    return (
        <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={10}
            style={[{ flex: 1 }, MyStyles.background]}
            scrollEnabled={false}
        >
            <View style={[{ flex: 1, height: screenHeight, alignItems: 'center', justifyContent: 'center' }]}>
                <Image source={require('../assets/app_logo.png')} style={{ width: 200, height: 200 }} />
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
                        capitalize="none"
                    />
                )}
                <HelperText type="error" visible={errorMsg}>
                    {errorMsg}
                </HelperText>
                <Button
                    mode="contained"
                    style={[MyStyles.buttonText, MyStyles.button]}
                    labelStyle={{ fontSize: 18 }}
                    onPress={() => {
                        if (validate()) {
                            // Tạo bản sao user không có trường confirm
                            const { confirm, ...userWithoutConfirm } = user;
                            updateRegisterData(userWithoutConfirm);
                            console.log("REGISTER DATA: ", registerData);
                            nav.navigate('RegisterInfo');
                        }
                    }}>
                    Tiếp tục
                </Button>

                <View style={{ flexDirection: 'row', bottom: 25, position: 'absolute' }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => {
                        nav.navigate('Login');
                    }}>
                        <Text>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default RegisterAccount;