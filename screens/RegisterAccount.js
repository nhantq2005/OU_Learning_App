import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, StatusBar, SafeAreaView } from "react-native";
import { Button, HelperText, ProgressBar } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Eye, EyeOff, User, LockKeyhole, CircleArrowLeft } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";

import TextField from "../components/TextField"; // Đảm bảo component này hỗ trợ style prop
import { RegisterContext } from "../utils/MyContexts";
import Colors from "../styles/Colors"; // Hoặc dùng cứng mã màu

const { width } = Dimensions.get('window');

const RegisterAccount = () => {
    const [user, setUser] = useState({});
    const [isSecure, setIsSecure] = useState(true);
    const [errorMsg, setErrorMsg] = useState();
    const nav = useNavigation();
    const { updateRegisterData } = useContext(RegisterContext);

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
            leadingIcon: <LockKeyhole color="#64748B" size={20} />,
            secureTextEntry: isSecure
        },
        {
            label: 'Xác nhận mật khẩu',
            field: 'confirm',
            leadingIcon: <LockKeyhole color="#64748B" size={20} />,
            secureTextEntry: isSecure
        }
    ];

    const validate = () => {
        setErrorMsg(null); // Reset lỗi trước khi check

        if (!user.username || !user.password || !user.confirm) {
            setErrorMsg("Vui lòng điền đầy đủ thông tin!");
            return false;
        }

        if (user.username.length < 4) {
            setErrorMsg("Tên đăng nhập phải có ít nhất 4 ký tự!");
            return false;
        }

        if (user.password.length < 8) {
            setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự!");
            return false;
        }

        if (user.password !== user.confirm) {
            setErrorMsg("Mật khẩu xác nhận không khớp!");
            return false;
        }

        return true;
    }

    const handleNext = () => {
        if (validate()) {
            // Loại bỏ trường confirm trước khi lưu vào context
            const { confirm, ...userData } = user;
            updateRegisterData(userData);
            nav.navigate('RegisterInfo');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* --- HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <CircleArrowLeft size={28} color="#333" />
                </TouchableOpacity>
                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>Bước 2 trên 3</Text>
                    <ProgressBar progress={0.66} color={PRIMARY_COLOR} style={styles.progressBar} />
                </View>
            </View>

            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Thiết lập tài khoản</Text>
                    <Text style={styles.subtitle}>Tạo tên đăng nhập và mật khẩu để bảo vệ tài khoản của bạn.</Text>

                    {/* --- FORM --- */}
                    <View style={styles.formContainer}>
                        {info.map((i, index) => (
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
                                    autoCapitalize="none"
                                    right={
                                        (i.field === 'password' || i.field === 'confirm') ? (
                                            <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                                                {isSecure 
                                                    ? <EyeOff color="#64748B" size={20} /> 
                                                    : <Eye color={PRIMARY_COLOR} size={20} />
                                                }
                                            </TouchableOpacity>
                                        ) : null
                                    }
                                    style={styles.textField}
                                />
                                
                                {/* Hiển thị gợi ý mật khẩu dưới ô password đầu tiên */}
                                {i.field === 'password' && (
                                    <Text style={styles.passwordHint}>Mật khẩu phải có ít nhất 8 ký tự.</Text>
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
                        onPress={handleNext}
                        style={styles.nextButton}
                        labelStyle={styles.buttonLabel}
                        contentStyle={{ height: 50 }}
                    >
                        Tiếp tục
                    </Button>
                </View>

                {/* --- FOOTER --- */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => nav.navigate('Login')}>
                        <Text style={styles.loginLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Header
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
    // Content
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        flex: 1,
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
        lineHeight: 22,
        marginBottom: 30,
    },
    // Form
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
    passwordHint: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 6,
        marginLeft: 4,
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
    nextButton: {
        backgroundColor: '#1976D2',
        borderRadius: 14,
        elevation: 4,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginTop: 10,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
    },
    footerText: {
        color: '#64748B',
        fontSize: 15,
    },
    loginLink: {
        color: '#1976D2',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default RegisterAccount;