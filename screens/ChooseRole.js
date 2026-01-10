import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView, StatusBar } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { CircleArrowLeft, CheckCircle2 } from "lucide-react-native"; // Thêm icon check cho đẹp

import { RegisterContext } from "../utils/MyContexts";
import Colors from "../styles/Colors"; // Hoặc dùng cứng mã màu nếu chưa có file này

const { width } = Dimensions.get('window');

const ChooseRole = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const nav = useNavigation();
    const { registerData, updateRegisterData } = useContext(RegisterContext);

    // Màu chủ đạo
    const PRIMARY_COLOR = "#1976D2";

    const nextStep = () => {
        if (selectedRole) {
            updateRegisterData({ 
                role: selectedRole, 
                is_active: selectedRole === "teacher" ? false : true 
            });
            nav.navigate("RegisterAccount");
        } else {
            // Có thể dùng Toast hoặc Alert
            alert("Vui lòng chọn vai trò để tiếp tục!");
        }
    };

    useEffect(() => {
        // console.log("PUSH DATA: ", registerData);
    }, [registerData]);

    // Component thẻ chọn vai trò
    const RoleCard = ({ role, title, imageSource }) => {
        const isSelected = selectedRole === role;
        return (
            <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => setSelectedRole(role)}
                style={[
                    styles.card,
                    isSelected && styles.cardSelected
                ]}
            >
                {/* Icon Check ở góc khi được chọn */}
                {isSelected && (
                    <View style={styles.checkIcon}>
                        <CheckCircle2 size={24} color={PRIMARY_COLOR} fill="#E3F2FD" />
                    </View>
                )}
                
                <Image 
                    source={imageSource} 
                    style={styles.cardImage} 
                    resizeMode="contain" 
                />
                
                <Text style={[
                    styles.cardTitle,
                    isSelected && styles.cardTitleSelected
                ]}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header & Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => nav.goBack()} 
                    style={styles.backButton}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                    <CircleArrowLeft size={32} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Titles */}
                <View style={styles.titleContainer}>
                    <Text variant="headlineMedium" style={styles.headline}>Bạn là ai?</Text>
                    <Text style={styles.subHeadline}>Chọn vai trò của bạn để chúng tôi tối ưu trải nghiệm học tập.</Text>
                </View>

                {/* Role Selection Grid */}
                <View style={styles.gridContainer}>
                    <RoleCard 
                        role="teacher" 
                        title="Giảng viên" 
                        imageSource={require("../assets/teacher.png")} 
                    />
                    <RoleCard 
                        role="student" 
                        title="Sinh viên" 
                        imageSource={require("../assets/student.png")} 
                    />
                </View>
            </View>

            {/* Footer Button */}
            <View style={styles.footer}>
                <Button 
                    mode="contained" 
                    onPress={nextStep}
                    disabled={!selectedRole} // Disable nút nếu chưa chọn
                    style={[
                        styles.continueButton, 
                        !selectedRole && styles.disabledButton
                    ]}
                    labelStyle={styles.buttonLabel}
                    contentStyle={{ height: 56 }}
                >
                    Tiếp tục
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default ChooseRole;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 60,
        justifyContent: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingBottom: 50, // Đẩy nội dung lên trên một chút
    },
    titleContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    headline: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    subHeadline: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    // Card Styles
    card: {
        width: (width - 48 - 16) / 2, // Tính toán độ rộng: (Màn hình - Padding ngang - Gap) / 2
        aspectRatio: 0.85, // Tỉ lệ khung hình chữ nhật đứng nhẹ
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F1F5F9', // Viền xám nhạt mặc định
        // Shadow nhẹ
        elevation: 4,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        position: 'relative',
    },
    cardSelected: {
        borderColor: '#1976D2',
        backgroundColor: '#E3F2FD', // Nền xanh nhạt khi chọn
        elevation: 8,
        shadowColor: '#1976D2',
        shadowOpacity: 0.2,
    },
    cardImage: {
        width: '80%',
        height: '60%',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748B',
    },
    cardTitleSelected: {
        color: '#1976D2',
        fontWeight: '800',
    },
    checkIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    // Footer Styles
    footer: {
        padding: 24,
        backgroundColor: '#fff',
    },
    continueButton: {
        borderRadius: 16,
        backgroundColor: '#1976D2',
        elevation: 4,
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#CBD5E1', // Màu xám khi disable
        elevation: 0,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});