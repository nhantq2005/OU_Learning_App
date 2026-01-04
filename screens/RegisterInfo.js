import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
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
import Spacing from "../styles/Spacing";


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
        const screenHeight = Dimensions.get('window').height;
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
                updateRegisterData({ ...registerData, ...user });
                console.log(registerData);
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
                    console.info("Registration successful:", res.data);
                    nav.navigate("Login");
                }
            } catch (ex) {  
                console.error(ex);
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
            extraScrollHeight={90}
            style={[{ flex: 1 }, MyStyles.background]}
            scrollEnabled={false}>
            <View style={[{ flex: 1, alignItems: 'center', height: screenHeight, justifyContent: 'center' }]}>
                <View style={{ position: 'relative', marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={picker}
                        activeOpacity={0.7}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            borderWidth: 2.5,
                            borderColor: '#4F8EF7',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            elevation: 8,
                            shadowColor: '#4F8EF7',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                        }}
                    >
                        {user.avatar ? (
                            <Image
                                source={{ uri: user.avatar.uri }}
                                style={{ width: 110, height: 110, borderRadius: 55 }}
                            />
                        ) : (
                            <View style={{ alignItems: 'center', maxWidth: 100 }}>
                                <View style={{ marginBottom: 6 }}>
                                    <ShieldUser color={'#4F8EF7'} size={38} />
                                </View>
                                <Text
                                    style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Chọn ảnh
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={picker}
                        activeOpacity={0.7}
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#fff',
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 4,
                        }}
                    >
                        <UserRoundPen color={'#1976D2'} size={24} />
                    </TouchableOpacity>
                </View>
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
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 20,
                                backgroundColor: 'white',
                                elevation: 8,
                                margin: Spacing.sm,
                                width: '100%',
                                zIndex: 1000,
                            }}
                        >
                            <View style={{ marginLeft: 10, marginRight: 8 }}>
                                <ShieldUser />
                            </View>
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
                                placeholder="Giới tính"
                                style={{
                                    borderWidth: 0,
                                    borderRadius: 20,
                                    paddingHorizontal: 16,
                                    fontSize: 16,
                                    height: 50,
                                }}
                                containerStyle={{ width: '85%' }}
                                dropDownContainerStyle={{
                                    borderRadius: 20,
                                    elevation: 8,
                                    zIndex: 1000,
                                    borderWidth: 0,
                                }}
                                textStyle={{ fontSize: 16 }}
                            />
                        </View>
                    )
                )}
                <HelperText type="error" visible={errorMsg}>
                    {errorMsg}
                </HelperText>
                <Button
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    onPress={register}
                    style={[MyStyles.buttonText, MyStyles.button]}
                    labelStyle={{ fontSize: 18 }}>
                    Đăng ký
                </Button>
                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                    <Text>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => {
                        nav.navigate(role === 'teacher' ? 'FillInfo' : 'Login');
                    }}>
                        <Text>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default RegisterInfo;