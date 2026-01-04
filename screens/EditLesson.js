
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, Switch, Card, Divider } from 'react-native-paper';
import TextField from '../components/TextField';
import MyStyles from '../styles/MyStyles';
import Colors from '../styles/Colors';
import Spacing from '../styles/Spacing';
import { ArrowLeftCircle, Book, Coins, ImageDownIcon, ImagePlusIcon, Leaf, LetterText, MenuSquare, ShieldUser, Tag, Video } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Apis, { authApis, endpoints } from '../utils/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditLesson = () => {
    // const navigation = useNavigation();

    const [lesson, setLesson] = useState({});
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const courseId = 5;


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
                    } else {
                        formData.append(key, lesson[key]);
                    }
                }

                console.info("Sending FormData...");

                const token = await AsyncStorage.getItem("token");
                let res = await Apis.post(
                    endpoints['lessons'](courseId),
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (res.status === 201) {
                    Alert.alert("Thành công", "Tạo bài học thành công!");
                    console.log("Lesson created:", res.data);
                    // navigation.goBack(); 
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




    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background, paddingTop: 36 }}>
            <View style={{ alignItems: 'center', paddingHorizontal: 18 }}>
                <TouchableOpacity
                    // onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: 0, top: 0, padding: 8, zIndex: 10 }}
                >
                    <ArrowLeftCircle color={Colors.light.primary} size={36} />
                </TouchableOpacity>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.light.primary, marginBottom: Spacing.md, textAlign: 'center', letterSpacing: 0.5, marginTop: 8 }}>
                    Chỉnh sửa bài học
                </Text>
                <Divider style={{ marginBottom: Spacing.md }} />
                {info.map(i =>
                    <TextField key={i.field}
                        placeholder={i.label}
                        left={i.leadingIcon}
                        {...(i.field === 'description' ? { multiline: true, height: 150 } : {})}
                        value={lesson[i.field]}
                        onChangeText={t => setLesson({ ...lesson, [i.field]: t })}
                    />
                )}


                {/* Upload Image */}
                <TouchableOpacity
                    onPress={picker}
                    activeOpacity={0.7}
                    style={{
                        width: '100%',
                        height: 120,
                        borderRadius: 20,
                        borderWidth: 2.5,
                        borderColor: '#4F8EF7',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        elevation: 8,
                        shadowColor: '#4F8EF7',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        marginBottom: 18,
                    }}
                >



                    {lesson.thumbnail ? (
                        <Image
                            source={{ uri: lesson.thumbnail.uri }}
                            style={{ width: 110, height: 110, borderRadius: 55 }}
                        />
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ marginBottom: 6 }}>
                                <ImagePlusIcon color={'#4F8EF7'} size={38} />
                            </View>
                            <Text
                                style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                Chọn ảnh thumbnail
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                {/* Upload Video */}
                <TouchableOpacity
                    onPress={pickVideo}
                    activeOpacity={0.7}
                    style={{
                        width: '100%',
                        height: 120,
                        borderRadius: 20,
                        borderWidth: 2.5,
                        borderColor: '#F57C00',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        elevation: 8,
                        shadowColor: '#F57C00',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        marginBottom: 18,
                    }}
                >


                    {video ? (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#F57C00', fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 6 }}>
                                Video đã chọn
                            </Text>
                            <Text style={{ color: '#333', fontSize: 13, textAlign: 'center' }} numberOfLines={2} ellipsizeMode="middle">
                                {video.fileName || video.uri?.split('/').pop()}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ marginBottom: 6 }}>
                                <Video color={'#F57C00'} size={38} />
                            </View>
                            <Text
                                style={{ color: '#F57C00', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                Chọn video bài giảng
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Button
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    style={{ borderRadius: 12, marginTop: Spacing.md, backgroundColor: Colors.light.primary, elevation: 2, width: '100%', marginBottom: 50 }}
                    labelStyle={{ color: Colors.light.onPrimary, fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }}
                    onPress={createLesson}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Lưu thay đổi
                </Button>
            </View>
        </ScrollView >
    );
};

export default EditLesson;


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    container: { padding: 16 },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
});