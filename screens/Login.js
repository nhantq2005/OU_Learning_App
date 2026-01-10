import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from "react-native";
import { Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import Apis, { authApis, endpoints } from "../utils/Apis";
import { MyUserContext } from "../utils/MyContexts";
import TextField from "../components/TextField"; // Đảm bảo component này hỗ trợ style prop
import MyStyles from "../styles/MyStyles";

const { width } = Dimensions.get('window');

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({});
    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();

    // Màu chủ đạo
    const PRIMARY_COLOR = "#1976D2";

    const info = [
        {
            label: 'Tên đăng nhập',
            field: 'username',
            leadingIcon: <User color="#64748B" size={20} />
        },
        {
            label: 'Mật khẩu',
            field: 'password',
            leadingIcon: <Lock color="#64748B" size={20} />,
            secureTextEntry: isSecure
        }
    ];

    const validate = () => {
        if (!user.username || !user.password) {
            setErrorMsg("Vui lòng nhập tên đăng nhập và mật khẩu!");
            return false;
        }
        return true;
    }

    const login = async () => {
        if (validate()) {
            try {
                setLoading(true);
                setErrorMsg(null);

                let res = await Apis.post(endpoints['login'], {
                    username: user.username,
                    password: user.password
                }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                AsyncStorage.setItem('token', res.data.access_token);

                let userRes = await authApis(res.data.access_token).get(endpoints['current_user']);
                dispatch({
                    "type": "login",
                    "payload": userRes.data
                });

            } catch (ex) {
                console.error(ex);
                if (ex.response && ex.response.status === 400) {
                    setErrorMsg("Tên đăng nhập hoặc mật khẩu không đúng.");
                } else {
                    setErrorMsg("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
                }
            } finally {
                setLoading(false);
            }
        }
    }

    const handleGoogleLogin = () => {
        // Xử lý logic đăng nhập Google ở đây (Firebase, Expo AuthSession, etc.)
        console.log("Login with Google pressed");
        alert("Tính năng đang phát triển!");
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    {/* Thay bằng logo của bạn */}
                    <Image 
                        source={require('../assets/app_logo.png')} 
                        style={styles.logo} 
                        resizeMode="contain" 
                    />
                    <Text style={styles.title}>Chào mừng trở lại!</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục hành trình học tập</Text>
                </View>

                {/* --- FORM --- */}
                <View style={styles.formContainer}>
                    {info.map(i => (
                        <View key={i.field} style={styles.inputWrapper}>
                            <TextField
                                placeholder={i.label}
                                secureTextEntry={i.secureTextEntry}
                                left={i.leadingIcon}
                                value={user[i.field]}
                                onChangeText={t => {
                                    setUser({ ...user, [i.field]: t });
                                    setErrorMsg(null); // Xóa lỗi khi người dùng gõ
                                }}
                                right={
                                    i.field === 'password' ? (
                                        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                                            {isSecure 
                                                ? <EyeOff color="#64748B" size={20} /> 
                                                : <Eye color="#1976D2" size={20} />
                                            }
                                        </TouchableOpacity>
                                    ) : null
                                }
                                style={styles.textField}
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.forgotPassContainer} onPress={() => console.log('Forgot Password')}>
                        <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {errorMsg && (
                        <HelperText type="error" visible={true} style={styles.errorText}>
                            {errorMsg}
                        </HelperText>
                    )}

                    <Button
                        onPress={login}
                        loading={loading}
                        disabled={loading}
                        mode="contained"
                        style={styles.loginButton}
                        labelStyle={styles.loginButtonLabel}
                        contentStyle={{ height: 50 }}
                    >
                        Đăng nhập
                    </Button>
                </View>

                {/* --- SOCIAL LOGIN DIVIDER --- */}
                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
                    <View style={styles.line} />
                </View>

                {/* --- GOOGLE BUTTON --- */}
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
                    <Image 
                        source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} 
                        style={styles.googleIcon} 
                    />
                    <Text style={styles.googleText}>Tiếp tục bằng Google</Text>
                </TouchableOpacity>

                {/* --- FOOTER --- */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => nav.navigate('ChooseRole')}>
                        <Text style={styles.registerLink}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    // Header
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
    },
    // Form
    formContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    textField: {
        // Thêm style tùy chỉnh cho TextField của bạn nếu cần
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
    },
    forgotPassContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPassText: {
        color: '#1976D2',
        fontWeight: '600',
        fontSize: 14,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: '#1976D2',
        borderRadius: 14,
        elevation: 4,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    // Google Button
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        paddingVertical: 12,
        marginBottom: 30,
        // Shadow nhẹ
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#64748B',
        fontSize: 15,
    },
    registerLink: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default Login;