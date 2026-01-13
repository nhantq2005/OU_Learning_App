import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper'; // Đã bỏ Avatar vì code dưới dùng Image
import { useNavigation } from '@react-navigation/native';
import {
    BookOpenCheck,
    CircleHelp,
    Info,
    KeyRound,
    LogOut,
    Moon,
    ChevronRight,
    UserPen,
    ShieldCheck
} from 'lucide-react-native';

import { MyUserContext } from '../utils/MyContexts';
// import Colors from '../styles/Colors'; // Bỏ comment nếu có file

const Account = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // --- Logout Function ---
    const logout = () => {
        dispatch({
            "type": "logout",
            "payload": null
        });
        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        // });
    }

    // --- HELPER COMPONENT: MENU ITEM ---
    const MenuItem = ({ icon: Icon, label, onPress, isLast, showToggle, toggleValue, onToggle }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={showToggle ? onToggle : onPress}
            style={[styles.menuItem, isLast && styles.menuItemLast]}
        >
            <View style={styles.menuIconContainer}>
                <Icon size={20} color="#1976D2" strokeWidth={2} />
            </View>
            <Text style={styles.menuLabel}>{label}</Text>

            {showToggle ? (
                <Switch
                    value={toggleValue}
                    onValueChange={onToggle}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={toggleValue ? "#1976D2" : "#f4f3f4"}
                />
            ) : (
                <ChevronRight size={20} color="#CBD5E1" />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* --- HEADER SECTION --- */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                        ) : (
                            // Đảm bảo đường dẫn ảnh đúng
                            <Image source={require('../assets/student.png')} style={styles.avatarImage} />
                        )}
                        <TouchableOpacity style={styles.editIconBadge} onPress={() => console.log('Edit Avatar')}>
                            <UserPen size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>
                        {user ? `${user.last_name} ${user.first_name}` : "Người dùng khách"}
                    </Text>
                    <Text style={styles.userEmail}>{user ? user.email : "guest@example.com"}</Text>

                    <Button
                        mode="text"
                        compact
                        labelStyle={{ color: '#1976D2', fontWeight: '600' }}
                        onPress={() => console.log('Edit Profile')}
                    >
                        Chỉnh sửa thông tin
                    </Button>
                </View>

                {/* --- SECTION 1: TÀI KHOẢN --- */}
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Tài khoản</Text>
                </View>
                <Surface style={styles.menuContainer} elevation={1}>
                    <MenuItem
                        icon={BookOpenCheck}
                        label="Khóa học của tôi"
                        onPress={() => navigation.navigate('MyCourses')}
                    />
                    <Divider style={styles.divider} />
                    <MenuItem
                        icon={KeyRound}
                        label="Đổi mật khẩu"
                        onPress={() => console.log('Change Password')}
                    />
                    <Divider style={styles.divider} />
                    <MenuItem
                        icon={ShieldCheck}
                        label="Bảo mật & Quyền riêng tư"
                        onPress={() => console.log('Privacy')}
                        isLast
                    />
                </Surface>

                {/* --- SECTION 2: CÀI ĐẶT ỨNG DỤNG --- */}
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Ứng dụng</Text>
                </View>
                <Surface style={styles.menuContainer} elevation={1}>
                    <MenuItem
                        icon={Moon}
                        label="Chế độ tối"
                        showToggle
                        toggleValue={isDarkMode}
                        onToggle={() => setIsDarkMode(!isDarkMode)}
                    />
                    <Divider style={styles.divider} />
                    <MenuItem
                        icon={CircleHelp}
                        label="Trợ giúp & Phản hồi"
                        onPress={() => console.log('Help')}
                    />
                    <Divider style={styles.divider} />
                    <MenuItem
                        icon={Info}
                        label="Về ứng dụng"
                        onPress={() => console.log('About')}
                        isLast
                    />
                </Surface>

                {/* --- LOGOUT BUTTON --- */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Phiên bản 1.0.0</Text>

            </ScrollView>
        </View>
    );
}

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    // --- Header Styles ---
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1976D2',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },

    // --- Menu Section Styles ---
    sectionTitleContainer: {
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 24,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    menuItemLast: {
        // Style riêng cho item cuối nếu cần
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#334155',
    },
    divider: {
        backgroundColor: '#F1F5F9',
        height: 1,
        marginLeft: 66,
    },

    // --- Logout Styles ---
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: 20,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
    versionText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
    },
});