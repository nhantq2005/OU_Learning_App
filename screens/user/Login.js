import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import { Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Eye, EyeOff, User, Lock } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/MyContexts";
import TextField from "../../components/components/TextField";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Theme from '../../styles/Theme';
const { width } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_IDS = {
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const hasGoogleOAuthConfig = Boolean(Platform.select({
    ios: GOOGLE_CLIENT_IDS.ios,
    android: GOOGLE_CLIENT_IDS.android,
    web: GOOGLE_CLIENT_IDS.web,
    default: false,
}));

const GoogleLoginButton = ({ loading, onAuthenticated, onError }) => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: GOOGLE_CLIENT_IDS.ios,
        androidClientId: GOOGLE_CLIENT_IDS.android,
        webClientId: GOOGLE_CLIENT_IDS.web,
        scopes: ['openid', 'profile', 'email'],
        selectAccount: true,
    });
    const handledResponse = useRef(null);

    useEffect(() => {
        if (!response || handledResponse.current === response) return;
        handledResponse.current = response;

        if (response.type === 'success') {
            const authentication = response.authentication;
            if (authentication?.accessToken || authentication?.idToken) {
                onAuthenticated(authentication);
            } else {
                onError('Google không trả về thông tin đăng nhập. Vui lòng thử lại.');
            }
        } else if (response.type === 'error') {
            onError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
    }, [response, onAuthenticated, onError]);

    return (
        <TouchableOpacity
            style={[styles.googleButton, (!request || loading) && styles.googleButtonDisabled]}
            onPress={() => promptAsync()}
            disabled={!request || loading}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Tiếp tục bằng Google</Text>
        </TouchableOpacity>
    );
};

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [isSecure, setIsSecure] = useState(true);
    const [user, setUser] = useState({});
    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();

    const handleGoogleLogin = async (authentication) => {
        try {
            setLoading(true);
            const access_token = authentication?.accessToken || null;
            const id_token = authentication?.idToken || null;
            console.log("Gửi lên server:", { access_token: access_token ? (access_token.substring(0, 10) + "...") : null, id_token: id_token ? (id_token.substring(0, 10) + "...") : null });

            let res = await Apis.post(endpoints['google_signin'], {
                access_token: access_token,
                id_token: id_token,
            });

            console.log("Server phản hồi", res.status);

            const djangoToken = res.data.access_token;
            await AsyncStorage.setItem('token', djangoToken);

            let userRes = await authApis(djangoToken).get(endpoints['current_user']);
            dispatch({ "type": "login", "payload": userRes.data });

        } catch (error) {
                console.error('Google login error:', error.response?.data || error.message || error);
                setErrorMsg('Đăng nhập Google thất bại.');
        } finally {
            setLoading(false);
        }
    };
    const PRIMARY_COLOR = Theme.colors.primary;

    const info = [
        {
            label: 'Tên đăng nhập',
            field: 'username',
            leadingIcon: <User color={Theme.colors.textMuted} size={20} />
        },
        {
            label: 'Mật khẩu',
            field: 'password',
            leadingIcon: <Lock color={Theme.colors.textMuted} size={20} />,
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
                console.log("Lỗi Login:", ex.message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.canvas} />
            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/app_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Chào mừng trở lại!</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục hành trình học tập</Text>
                </View>

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
                                    setErrorMsg(null);
                                }}
                                right={
                                    i.field === 'password' ? (
                                        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                                            {isSecure
                                                ? <EyeOff color={Theme.colors.textMuted} size={20} />
                                                : <Eye color={Theme.colors.primary} size={20} />
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

                {hasGoogleOAuthConfig && (
                    <>
                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
                            <View style={styles.line} />
                        </View>

                        <GoogleLoginButton
                            loading={loading}
                            onAuthenticated={handleGoogleLogin}
                            onError={setErrorMsg}
                        />
                    </>
                )}

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
        backgroundColor: Theme.colors.canvas,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 36,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 28,
    },
    logo: {
        width: 104,
        height: 104,
        marginBottom: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: Theme.colors.textMuted,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        marginBottom: 12,
    },
    textField: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.md,
    },
    forgotPassContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPassText: {
        color: Theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 10,
    },
    loginButton: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.radius.md,
        ...Theme.shadow,
    },
    loginButtonLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.surface,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Theme.colors.border,
    },
    dividerText: {
        marginHorizontal: 12,
        color: Theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.colors.surface,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        paddingVertical: 13,
        marginBottom: 30,
    },
    googleButtonDisabled: {
        opacity: 0.55,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: Theme.colors.textMuted,
        fontSize: 15,
    },
    registerLink: {
        color: Theme.colors.primary,
        fontWeight: '800',
        fontSize: 15,
    },
});

export default Login;
