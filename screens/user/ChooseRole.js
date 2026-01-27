import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView, StatusBar } from "react-native";
import { Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { CircleArrowLeft, CheckCircle2 } from "lucide-react-native";
import { RegisterContext } from "../../utils/MyContexts";
import RoleCard from "../../components/components/RoleCard";


const ChooseRole = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const nav = useNavigation();
    const { registerData, updateRegisterData } = useContext(RegisterContext);

    const nextStep = () => {
        if (selectedRole) {
            updateRegisterData({ 
                role: selectedRole, 
                is_active: selectedRole === "teacher" ? false : true 
            });
            nav.navigate("RegisterAccount");
        } else {
            alert("Vui lòng chọn vai trò để tiếp tục!");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
                <View style={styles.titleContainer}>
                    <Text variant="headlineMedium" style={styles.headline}>Bạn là ai?</Text>
                    <Text style={styles.subHeadline}>Chọn vai trò của bạn để chúng tôi tối ưu trải nghiệm học tập.</Text>
                </View>

                <View style={styles.gridContainer}>
                    <RoleCard 
                        role="teacher" 
                        title="Giảng viên" 
                        imageSource={require("../../assets/teacher.png")}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                    />
                    <RoleCard 
                        role="student" 
                        title="Sinh viên" 
                        imageSource={require("../../assets/student.png")}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button 
                    mode="contained" 
                    onPress={nextStep}
                    disabled={!selectedRole}
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
        paddingBottom: 50,
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
        backgroundColor: '#CBD5E1',
        elevation: 0,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});