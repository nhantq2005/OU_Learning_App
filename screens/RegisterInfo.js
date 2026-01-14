import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView, StatusBar, Alert } from "react-native";
import { Button, HelperText, ProgressBar } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { User, Mail, Shield, Camera, CircleArrowLeft } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from "react-native-dropdown-picker";

import TextField from "../components/TextField";
import { RegisterContext } from "../utils/MyContexts";
import Apis, { endpoints } from "../utils/Apis";

const { width, height } = Dimensions.get('window');

const RegisterInfo = () => {
    const { registerData, updateRegisterData } = useContext(RegisterContext);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [user, setUser] = useState({});
    const nav = useNavigation();

    const [genderOpen, setGenderOpen] = useState(false);
    const [genderValue, setGenderValue] = useState(registerData.gender || null);
    const [genderItems, setGenderItems] = useState([
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
    ]);

    const PRIMARY_COLOR = "#1976D2";

    const info = [
        {
            label: 'Họ và tên lót',
            field: 'last_name',
            leadingIcon: <User color="#64748B" size={20} />
        },
        {
            label: 'Tên',
            field: 'first_name',
            leadingIcon: <User color="#64748B" size={20} />
        },
        {
            label: 'Giới tính',
            field: 'gender',
            leadingIcon: <Shield color="#64748B" size={20} />
        },
        {
            label: 'Email',
            field: 'email',
            leadingIcon: <Mail color="#64748B" size={20} />
        }
    ];

    const picker = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!res.canceled) {
                setUser({ ...user, "avatar": res.assets[0] });
            }
        } else {
            Alert.alert("Quyền truy cập bị từ chối!", "Vui lòng cấp quyền truy cập thư viện ảnh để tiếp tục.");
        }
    }

    const validate = () => {
        setErrorMsg(null);
        
        if (!user.avatar) {
             setErrorMsg("Vui lòng chọn ảnh đại diện.");
             return false;
        }

        for (let i of info) {
            if (i.field === 'gender') {
                if (!genderValue) {
                    setErrorMsg("Vui lòng chọn giới tính.");
                    return false;
                }
                continue;
            }

            if (!user[i.field] || user[i.field].trim() === '') {
                setErrorMsg(`${i.label} không được để trống.`);
                return false;
            }

            if (i.field === 'email') {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(user.email)) {
                    setErrorMsg("Email không hợp lệ.");
                    return false;
                }
            }
        }
        return true;
    }

    const register = async () => {
        if (validate()) {
            try {
                setLoading(true);
                
                const finalData = { ...registerData, ...user, gender: genderValue };

                let form = new FormData();
                for (let key in finalData) {
                    if (key === 'avatar') {
                        form.append(key, {
                            uri: finalData.avatar.uri,
                            name: finalData.avatar.fileName || `avatar_${Date.now()}.jpg`,
                            type: finalData.avatar.mimeType || "image/jpeg"
                        });
                    } else {
                        form.append(key, finalData[key]);
                    }
                }

                console.info("Sending Data:", finalData);

                let res = await Apis.post(endpoints['register'], form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.status === 201) {
                    Alert.alert(
                        "Đăng ký thành công!",
                        "Chào mừng bạn đến với ứng dụng.",
                        [
                            { 
                                text: "OK", 
                                onPress: () => {
                                    const nextScreen = registerData.role === 'teacher' ? 'FillInfo' : 'Login';
                                    nav.reset({
                                        index: 0,
                                        routes: [{ name: nextScreen, params: { id: res.data.id } }],
                                    });
                                } 
                            }
                        ]
                    );
                }
            } catch (ex) {
                console.error(ex);
                if (ex.response) {
                     setErrorMsg(`Lỗi đăng ký: ${ex.response.data?.message || 'Vui lòng thử lại.'}`);
                } else {
                    setErrorMsg("Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <CircleArrowLeft size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>Bước 3 trên 3</Text>
                    <ProgressBar progress={1} color={PRIMARY_COLOR} style={styles.progressBar} />
                </View>
            </View>

            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Hoàn tất hồ sơ</Text>
                    <Text style={styles.subtitle}>Cập nhật thông tin cá nhân để mọi người có thể nhận ra bạn.</Text>

                    <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={picker} activeOpacity={0.8} style={styles.avatarWrapper}>
                            {user.avatar ? (
                                <Image source={{ uri: user.avatar.uri }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <User color="#94A3B8" size={50} />
                                    <Text style={styles.avatarText}>Thêm ảnh</Text>
                                </View>
                            )}
                            <View style={styles.cameraBadge}>
                                <Camera color="#fff" size={16} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        {info.map((i) => (
                            <View key={i.field} style={styles.inputWrapper}>
                                {i.field !== 'gender' ? (
                                    <TextField
                                        placeholder={i.label}
                                        left={i.leadingIcon}
                                        value={user[i.field]}
                                        onChangeText={t => {
                                            setUser({ ...user, [i.field]: t });
                                            setErrorMsg(null);
                                        }}
                                        style={styles.textField}
                                        keyboardType={i.field === 'email' ? 'email-address' : 'default'}
                                    />
                                ) : (
                                    <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
                                        <View style={styles.dropdownIcon}>
                                            <Shield color="#64748B" size={20} />
                                        </View>
                                        <DropDownPicker
                                            open={genderOpen}
                                            value={genderValue}
                                            items={genderItems}
                                            setOpen={setGenderOpen}
                                            setValue={setGenderValue}
                                            setItems={setGenderItems}
                                            placeholder="Chọn giới tính"
                                            style={styles.dropdown}
                                            dropDownContainerStyle={styles.dropdownContainer}
                                            textStyle={styles.dropdownText}
                                            listMode="SCROLLVIEW"
                                            zIndex={1000}
                                            zIndexInverse={3000}
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {errorMsg && (
                        <View style={styles.errorContainer}>
                            <HelperText type="error" visible={true} style={styles.errorText}>
                                {errorMsg}
                            </HelperText>
                        </View>
                    )}

                    <Button
                        mode="contained"
                        onPress={register}
                        loading={loading}
                        disabled={loading}
                        style={styles.registerButton}
                        labelStyle={styles.buttonLabel}
                        contentStyle={{ height: 50 }}
                    >
                        Hoàn tất đăng ký
                    </Button>
                </View>
                
              <View style={{height: 100}} /> 

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    backButton: {
        marginRight: 20,
    },
    stepContainer: {
        flex: 1,
    },
    stepText: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E2E8F0',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 30,
        lineHeight: 22,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#E2E8F0',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    avatarText: {
        marginTop: 8,
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '600',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1976D2',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    textField: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dropdownWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        height: 58, 
    },
    dropdownIcon: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        height: 56,
        paddingLeft: 0, 
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#E2E8F0',
        borderRadius: 12,
        marginTop: 4,
        elevation: 3,
    },
    dropdownText: {
        fontSize: 16,
        color: '#1E293B',
    },
    errorContainer: {
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        padding: 4,
        marginBottom: 20,
    },
    errorText: {
        fontSize: 13,
        textAlign: 'center',
        color: '#EF4444',
    },
    registerButton: {
        backgroundColor: '#1976D2',
        borderRadius: 14,
        elevation: 4,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default RegisterInfo;