import { View, StyleSheet } from "react-native";
import { Button, Text, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Tag } from "lucide-react-native"; // npm install lucide-react-native
import { useContext } from "react";
import { MyUserContext } from "../utils/MyContexts";

const DetailView = ({ currentCourse }) => {
    const nav = useNavigation();
    const [user,]= useContext(MyUserContext);

    return (
        <View style={styles.container}>
            {/* Tags Section */}
            {currentCourse.tags && currentCourse.tags.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Tag size={18} color="#1976D2" />
                        <Text style={styles.sectionTitle}>Từ khóa</Text>
                    </View>
                    <View style={styles.tagContainer}>
                        {currentCourse.tags.map(tag => (
                            <Chip 
                                key={tag.id} 
                                mode="flat" 
                                style={styles.chip}
                                textStyle={{ color: '#1565C0', fontSize: 13 }}
                            >
                                #{tag.name}
                            </Chip>
                        ))}
                    </View>
                </View>
            )}

            {/* Description Section (Uncomment if needed) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả khóa học</Text>
                <Text style={styles.description}>{currentCourse.description}</Text>
            </View>

            {/* Enroll Button */}
            <View style={styles.actionContainer}>
                <Button
                    mode="contained"
                    contentStyle={{ height: 50 }}
                    style={styles.enrollButton}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    icon="login"
                    onPress={() =>
                        currentCourse.is_enrolled || user.role === 'teacher'
                            ? nav.replace('LessonDetail', { id: currentCourse.id })
                            : nav.replace('Enroll', { course: currentCourse })
                    }
                >
                    {currentCourse.is_enrolled || user.role === 'teacher' ? 'Vào học ngay' : 'Đăng ký học ngay'}
                </Button>
                <Text style={styles.note}>Truy cập trọn đời • Cấp chứng chỉ</Text>
            </View>
        </View>
    );
}

export default DetailView;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#424242',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#E3F2FD', // Xanh rất nhạt
        borderRadius: 20,
    },
    description: {
        fontSize: 15,
        color: '#424242',
        lineHeight: 24,
    },
    actionContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    enrollButton: {
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#1976D2',
        marginBottom: 8,
        elevation: 4,
    },
    note: {
        fontSize: 12,
        color: '#9E9E9E',
    }
});