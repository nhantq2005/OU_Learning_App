import { CheckCircle2 } from "lucide-react-native";
import { Image, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
const { width } = Dimensions.get('window');

const RoleCard = ({ role, title, imageSource, selectedRole, setSelectedRole }) => {

      const PRIMARY_COLOR = "#1976D2";
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

    export default RoleCard;


    const styles = StyleSheet.create({
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

    });

    