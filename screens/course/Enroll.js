import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { Button, Modal, Portal, PaperProvider, Surface, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft, User, ShieldCheck, CheckCircle2, CreditCard } from 'lucide-react-native';
import { authApis, endpoints } from '../../utils/Apis';
import Theme from '../../styles/Theme';
const Colors = {
    primary: '#1976D2',
    background: '#F5F7FA',
    text: '#1E293B',
    success: '#4CAF50',
    white: Theme.colors.surface,
    gray: '#64748B',
    lightGray: '#E2E8F0'
};

const Enroll = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { course } = route.params;

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        nav.navigate("MyCourses"); 
         nav.goBack();
    };

    const handleEnroll = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).post(endpoints['enroll'], {
                course: course.id
            });
            
            console.info("Enroll success:", res.data);
            showModal(); 
        } catch (error) {
            console.error("Failed to enroll:", error);
            alert("Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const saveTransaction = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).post(endpoints['transactions'], {
                course: course.id,
                amount: course.price,
                status: 'success'
            });
        } catch (error) {
            console.error("Failed to save transaction:", error);
        }
    };

    const enrollCourse = async () => {
        await handleEnroll();
        await saveTransaction();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Xác nhận đăng ký</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <View style={styles.content}>
                    
                    <Surface style={styles.card} elevation={2}>
                        <Image source={{ uri: course.image }} style={styles.courseImage} />
                        
                        <View style={styles.cardContent}>
                            <Text style={styles.courseTitle}>{course.title}</Text>
                            
                            <View style={styles.instructorRow}>
                                <User size={16} color={Colors.gray} />
                                <Text style={styles.instructorName}>
                                    {course.instructor.last_name} {course.instructor.first_name}
                                </Text>
                            </View>

                            <Divider style={styles.divider} />

                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Học phí:</Text>
                                <Text style={styles.priceValue}>{formatPrice(course.price)}</Text>
                            </View>
                        </View>
                    </Surface>

                    <View style={styles.trustSection}>
                        <View style={styles.trustItem}>
                            <ShieldCheck size={20} color={Colors.primary} />
                            <Text style={styles.trustText}>Thanh toán an toàn</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <CreditCard size={20} color={Colors.primary} />
                            <Text style={styles.trustText}>Truy cập trọn đời</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.bottomBar} elevation={4}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                        <Text style={styles.totalPrice}>{formatPrice(course.price)}</Text>
                    </View>
                    
                    <Button
                        mode="contained"
                        loading={loading}
                        disabled={loading}
                        onPress={enrollCourse}
                        style={styles.enrollButton}
                        labelStyle={styles.buttonLabel}
                        contentStyle={{ height: 50 }}
                    >
                        Thanh toán & Vào học
                    </Button>
                </View>

                <Portal>
                    <Modal 
                        visible={visible} 
                        onDismiss={hideModal} 
                        contentContainerStyle={styles.modalContainer}
                        dismissable={false}
                    >
                        <View style={styles.modalContent}>
                            <CheckCircle2 size={64} color={Colors.success} style={{ marginBottom: 16 }} />
                            <Text style={styles.modalTitle}>Đăng ký thành công!</Text>
                            <Text style={styles.modalSubTitle}>
                                Chúc mừng bạn đã tham gia khóa học. Hãy bắt đầu học ngay nhé!
                            </Text>
                            <Button 
                                mode="contained" 
                                onPress={hideModal} 
                                style={styles.modalButton}
                            >
                                Bắt đầu học ngay
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.white,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    // Content
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    courseImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        lineHeight: 28,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    instructorName: {
        fontSize: 14,
        color: Colors.gray,
        fontWeight: '500',
    },
    divider: {
        backgroundColor: Colors.lightGray,
        height: 1,
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 16,
        color: Colors.gray,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    trustSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#E3F2FD', 
        padding: 16,
        borderRadius: 12,
    },
    trustItem: {
        alignItems: 'center',
        gap: 8,
    },
    trustText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
    },
    bottomBar: {
        padding: 20,
        paddingBottom: 30,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E53935',
    },
    enrollButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    modalContainer: {
        backgroundColor: Theme.colors.surface,
        margin: 30,
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
    },
    modalContent: {
        alignItems: 'center',
        width: '100%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: 10,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubTitle: {
        fontSize: 14,
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        width: '100%',
    },
});

export default Enroll;