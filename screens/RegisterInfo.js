import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import MyStyles from "../styles/MyStyles";
import TextField from "../components/TextField";
import React, { use, useContext, useEffect, useState } from "react";
import { TextInput, Button, HelperText, Menu } from 'react-native-paper';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Apis, { endpoints } from "../utils/Apis";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { ClipboardType, Mail, MailCheck, ShieldUser, UserRoundPen } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RegisterContext } from "../utils/MyContexts";


const RegisterInfo = () => {
    const { registerData, updateRegisterData } = useContext(RegisterContext);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(registerData.gender || null);
    const [genderItems, setGenderItems] = useState([
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
    ]);
    const [user, setUser] = useState({})
    const nav = useNavigation();
    const info = [
        {
            'label': 'Họ và tên lót',
            'field': 'last_name',
            'leadingIcon': <UserRoundPen />
        },
        {
            'label': 'Tên',
            'field': 'first_name',
            'leadingIcon': <UserRoundPen />
        },
        {
            'label': 'Giới tính',
            'field': 'gender',
            'leadingIcon': <ShieldUser />
        },
        {
            'label': 'Email',
            'field': 'email',
            'leadingIcon': <MailCheck />
        }
    ]

    const picker = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setUser({ ...user, "avatar": res.assets[0] });
        } else {
            Alert.alert("Permission denied!");
        }
    }

    const validate = () => {
        for (let i of info) {
            if (i.field === 'gender') continue;

            if (!user[i.field] || user[i.field].trim() === '') {
                setErrorMsg(`${i.label} không được để trống`);
                return false;
            }

            if (i.field === 'email') {
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(user.email)) {
                setErrorMsg("Email không hợp lệ");
                return false;
            }
        }
        }


        

        setErrorMsg(null);
        return true;
    }



    const register = async () => {
        if (validate()) {
            try {
                setLoading(true);

                // Cập nhật thông tin vào RegisterContext trước khi gửi lên API
                updateRegisterData({ ...registerData, ...user });
                console.log(registerData);
                // Sử dụng registerData mới nhất để gửi lên API
                const dataToSend = { ...registerData, ...user };
                let form = new FormData();
                for (let key in dataToSend)
                    if (key === 'avatar') {
                        form.append(key, {
                            uri: dataToSend.avatar.uri,
                            name: dataToSend.avatar.fileName,
                            type: dataToSend.avatar.type || "image/jpeg"
                        });
                    } else
                        form.append(key, dataToSend[key]);

                console.info(dataToSend);

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    nav.navigate("Login");
                }
            } catch (ex) {
                console.error(ex);
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
                {/* Ô chọn ảnh đại diện */}
                <TouchableOpacity
                    onPress={picker}
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 55,
                        borderWidth: 2,
                        borderColor: '#ccc',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    {user.avatar ? (
                        <Image
                            source={{ uri: user.avatar.uri }}
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                    ) : (
                        <Text style={{ color: '#888' }}>Chọn ảnh đại diện</Text>
                    )}
                </TouchableOpacity>
                {/* ...existing code... */}
                {info.map(i =>
                    i.field !== "gender" ? (
                        <TextField key={i.field}
                            placeholder={i.label}
                            secureTextEntry={i.secureTextEntry}
                            left={i.leadingIcon}
                            value={user[i.field]}
                            onChangeText={t => setUser({ ...user, [i.field]: t })}
                        />
                    ) : (
                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            open={genderOpen}
                            setOpen={setGenderOpen}
                            value={genderValue}
                            setValue={(callback) => {
                                const value = callback(genderValue);
                                setGenderValue(value);
                                updateRegisterData({ gender: value });
                            }}
                            items={genderItems}
                            setItems={setGenderItems}
                            style={{ width: '90%', marginBottom: 12 }}
                            containerStyle={{ width: '90%' }}
                        />
                    )
                )}
                <HelperText type="error" visible={errorMsg}>
                    {errorMsg}
                </HelperText>
                <Button
                    mode="contained"
                    onPress={register}
                    style={[MyStyles.buttonText, MyStyles.button]}
                    labelStyle={{ fontSize: 18 }}>
                    Đăng ký
                </Button>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
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

export default RegisterInfo;