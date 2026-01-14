
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ScrollView, View, TouchableOpacity, Image,
    StyleSheet, Dimensions, Platform
} from 'react-native';
import { Text, Button, Switch, Card, Divider } from 'react-native-paper';
import TextField from '../components/TextField';
import MyStyles from '../styles/MyStyles';
import Colors from '../styles/Colors';
import Spacing from '../styles/Spacing';
import { ArrowLeftCircle, ImagePlusIcon, Video, ChevronLeft, Leaf, LetterText, ImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Apis, { authApis, endpoints } from '../utils/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const EditLesson = () => {
    const navigation = useNavigation();

    const [lesson, setLesson] = useState({});
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const courseId = route.params?.courseId;
    const lessonId = route.params?.lessonId;


    const info = [
        {
            'label': 'Tên bài học',
            'field': 'name',
            'leadingIcon': <Leaf />
        },
        {
            'label': 'Mô tả',
            'field': 'description',
            'leadingIcon': <LetterText />
        }
    ]



    const picker = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
            if (!res.canceled)
                setLesson({ ...lesson, "thumbnail": res.assets[0] });
        } else {
            Alert.alert("Permission denied!");
        }
    };

    const pickVideo = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
            if (!res.canceled)
                setLesson({ ...lesson, "video": res.assets[0] });
        } else {
            Alert.alert("Permission denied!");
        }
    };

    const submitCourse = async () => {
        console.info("Submitting course:", lesson);
    }

    const validate = () => {
        if (!lesson.name || !lesson.description) {
            Alert.alert("Vui lòng điền đầy đủ thông tin!");
            return false;
        }

        if (!lesson.thumbnail) {
            Alert.alert("Vui lòng chọn ảnh thumbnail!");
            return false;
        }
        if (!lesson.video) {
            Alert.alert("Vui lòng chọn video bài học!");
            return false;
        }
        return true;
    }

    const createLesson = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const formData = new FormData();
                for (let key in lesson) {
                    if (key === 'thumbnail') {
                        formData.append('thumbnail', {
                            uri: lesson.thumbnail.uri,
                            name: lesson.thumbnail.fileName || 'image.jpg',
                            type: lesson.thumbnail.mimeType || 'image/jpeg'
                        });
                    } else if (key === 'video') {
                        formData.append('video', {
                            uri: lesson.video.uri,
                            name: lesson.video.fileName || 'video.mp4',
                            type: lesson.video.mimeType || 'video/mp4'
                        });
                        formData.append('duration', lesson.video.duration);
                    } else {
                        formData.append(key, lesson[key]);
                    }
                }

                console.info("Sending FormData...");

                const token = await AsyncStorage.getItem("token");
                let res = await authApis(token).post(
                    endpoints['lessons'](courseId),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (res.status === 201) {
                    Alert.alert("Thành công", "Tạo bài học thành công!");
                    console.log("Lesson created:", res.data);
                    navigation.goBack();
                }
            } catch (ex) {
                if (ex.response) {
                    console.error("Lỗi chi tiết từ Server:", ex.response.data);
                    Alert.alert("Lỗi", JSON.stringify(ex.response.data));
                } else {
                    console.error("Lỗi khác:", ex.message);
                }
                console.error(ex);
                Alert.alert("Lỗi", "Không thể tạo bài học. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
    }

    const updateLesson = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const formData = new FormData();
                for (let key in lesson) {
                    if (key === 'thumbnail' && lesson.thumbnail?.uri?.startsWith('file://')) {
                        formData.append('thumbnail', {
                            uri: lesson.thumbnail.uri,
                            name: lesson.thumbnail.fileName || 'image.jpg',
                            type: lesson.thumbnail.mimeType || 'image/jpeg'
                        });
                    } else if (key === 'video' && lesson.video?.uri?.startsWith('file://')) {
                        formData.append('video', {
                            uri: lesson.video.uri,
                            name: lesson.video.fileName || 'video.mp4',
                            type: lesson.video.mimeType || 'video/mp4'
                        });
                        formData.append('duration', lesson.video.duration);
                    } else {
                        formData.append(key, lesson[key]);
                    }
                }

                console.info("Sending FormData...");
                const token = await AsyncStorage.getItem("token");
                let res = await authApis(token).patch(
                    endpoints['lesson_detail'](lessonId),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (res.status === 200) {
                    Alert.alert("Thành công", "Cập nhật bài học thành công!");
                    console.log("Lesson updated:", res.data);
                    navigation.goBack();
                }
            } catch (ex) {
                if (ex.response) {
                    console.error("Lỗi chi tiết từ Server:", ex.response.data);
                    Alert.alert("Lỗi", JSON.stringify(ex.response.data));
                } else {
                    console.error("Lỗi khác:", ex.message);
                }
                console.error(ex);
                Alert.alert("Lỗi", "Không thể cập nhật bài học. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
    }


    const loadLessonDetails = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['lesson_detail'](lessonId));
            if (res.status === 200) {
                setLesson(res.data);
            }
        } catch (ex) {
            console.error("Failed to load lesson details:", ex);
        }
    };

    useEffect(() => {
        if (lessonId) {
            loadLessonDetails();
        }
    }, [lessonId]);


    useEffect(() => {
        console.log("Current lesson data:", courseId);
    }, []);


    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color={Colors.light.primary} size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa bài học</Text>
                <View style={{ width: 40 }} /> 
            </View>

            <View style={styles.formContainer}>
                <View style={styles.card}>
                    {info.map((i, index) => (
                        <View key={i.field} style={styles.inputWrapper}>
                            <TextField
                                placeholder={i.label}
                                left={i.leadingIcon}
                                {...(i.field === 'description' ? { multiline: true, height: 120 } : {})}
                                value={lesson[i.field]}
                                onChangeText={t => setLesson({ ...lesson, [i.field]: t })}
                                style={styles.textField}
                            />
                            {index !== info.length - 1 && <View style={styles.fieldSpacer} />}
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Nội dung đính kèm</Text>

                <View style={styles.uploadRow}>
                    <TouchableOpacity
                        onPress={picker}
                        style={[styles.uploadBox, { borderColor: '#E0E0E0' }]}
                    >
                        {lesson.thumbnail ? (
                            <Image
                                source={{ uri: lesson.thumbnail.uri || lesson.thumbnail }}
                                style={styles.previewImage}
                            />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <ImagePlus color={Colors.light.primary} size={28} />
                                <Text style={styles.uploadText}>Ảnh bìa</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={pickVideo}
                        style={[styles.uploadBox, { borderColor: '#E0E0E0' }]}
                    >
                        <View style={styles.uploadPlaceholder}>
                            <Video color={video ? '#4CAF50' : '#F57C00'} size={28} />
                            <Text style={[styles.uploadText, video && { color: '#4CAF50' }]}>
                                {video ? 'Đã chọn video' : 'Video bài giảng'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {video && (
                    <View style={styles.videoInfoCard}>
                        <Text style={styles.videoFileName} numberOfLines={1}>
                            📄 {video.fileName || video.uri?.split('/').pop()}
                        </Text>
                    </View>
                )}

                <Button
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                    labelStyle={styles.submitButtonLabel}
                    onPress={lessonId ? updateLesson : createLesson}
                    contentStyle={{ height: 56 }}
                >
                    Lưu thay đổi
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    formContainer: {
        paddingHorizontal: 18,
        marginTop: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 24,
        alignItems: 'center',
    },
    inputWrapper: {
        width: '100%',
    },
    fieldSpacer: {
        height: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 12,
        marginLeft: 4,
    },
    uploadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    uploadBox: {
        width: (width - 50) / 2,
        height: 120,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    videoInfoCard: {
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    videoFileName: {
        fontSize: 13,
        color: '#2E7D32',
        fontWeight: '500',
    },
    submitButton: {
        borderRadius: 14,
        marginTop: 10,
        backgroundColor: '#4F8EF7',
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textTransform: 'none',
    },
});

export default EditLesson;