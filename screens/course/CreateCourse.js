import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, Switch, Card, Divider, Modal, Portal } from 'react-native-paper';
import TextField from '../../components/components/TextField';
import MyStyles from '../../styles/MyStyles';
import Colors from '../../styles/Colors';
import Spacing from '../../styles/Spacing';
import { ArrowLeftCircle, Book, Coins, Delete, ImageDownIcon, ImagePlusIcon, LetterText, MenuSquare, ShieldUser, Tag, Video, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Apis, { authApis, endpoints } from '../../utils/Apis';
import { MyUserProvider } from '../../utils/providers/MyUserProvider';
import { MyUserContext } from '../../utils/MyContexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CheckCircle } from 'lucide-react-native';

const CreateCourse = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const courseId = route.params?.courseId || null;
    const [course, setCourse] = useState({});
    const [video, setVideo] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [value, setValue] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user,] = useContext(MyUserContext);


    const loadCourseDetails = async (id) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            let res = await authApis(token).get(endpoints['course_detail'](id));
            console.info("Course details:", res.data);
            setCourse(res.data);
            if (res.data.tags && Array.isArray(res.data.tags)) {
                const tagIds = res.data.tags.map(tag => tag.id);
                setSelectedTags(tagIds);
            } else {
                setSelectedTags(res.data.tags_id || []);
            }

            const catValue = res.data.category?.id || res.data.category_id || res.data.category;
            setValue(catValue);
            setLoading(false);
        } catch (ex) {
            console.error("Failed to load course details:", ex);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (courseId) {
            loadCourseDetails(courseId);
            console.log("Editing course ID:", courseId);
        }
    }, [courseId]);



    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            const mapped = res.data.results.map(cat => ({
                label: cat.name || cat.title || cat.label || `Danh mục ${cat.id}`,
                value: cat.id
            }));
            setCategories(mapped);
        } catch (ex) {
            console.error("Failed to load categories:", ex);
        }
    }

    const loadTags = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['tags']);
            console.info("TAGS RES", res.data);
            const mapped = (res.data || []).map(tag => ({
                label: tag.name || tag.title || `Tag ${tag.id}`,
                value: tag.id
            }));
            setTags(mapped);
            setLoading(false);
        } catch (ex) {
            console.error("Failed to load tags:", ex);
            setLoading(false);
        }
    }

    const info = [
        {
            'label': 'Tên khóa học',
            'field': 'title',
            'leadingIcon': <Book />
        },
        {
            'label': 'Mô tả',
            'field': 'description',
            'leadingIcon': <LetterText />
        },
        {
            'label': 'Giá (VNĐ)',
            'field': 'price',
            'leadingIcon': <Coins />
        }
    ]
    const picker = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setCourse({ ...course, "image": res.assets[0] });
        } else {
            Alert.alert("Permission denied!");
        }
    }

    const pickVideo = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos });
            if (!res.canceled)
                setCourse({ ...course, "intro_video": res.assets[0] });
            console.info("Picked video:", res);
            setDuration(res.assets[0].duration);
        } else {
            Alert.alert("Permission denied!");
        }
    };

    const validate = () => {
        if (!course.title || course.title.trim().length === 0) {
            Alert.alert("Vui lòng nhập tên khóa học!");
            return false;
        }

        if (course.price && (isNaN(Number(course.price)) || Number(course.price) < 0)) {
            Alert.alert("Giá khóa học phải là một số hợp lệ!");
            return false;
        }

        return true;
    }


    const createCourse = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('instructor_id', user.id);
                formData.append('duration', duration || 0);
                for (let key in course) {
                    if (key === 'tags_id') {
                        if (selectedTags && selectedTags.length > 0) {
                            selectedTags.forEach(tagId => {
                                formData.append('tags_id', tagId);
                            });
                        }
                    } else if (key === 'image') {
                        formData.append('image', {
                            uri: course.image.uri,
                            name: course.image.fileName || 'image.jpg',
                            type: course.image.mimeType || 'image/jpeg'
                        });
                    } else if (key === 'intro_video') {
                        formData.append('intro_video', {
                            uri: course.intro_video.uri,
                            name: course.intro_video.fileName || 'video.mp4',
                            type: course.intro_video.mimeType || 'video/mp4'
                        });
                    } else {
                        formData.append(key, course[key]);
                    }
                }


                console.info("Sending FormData...");

                const token = await AsyncStorage.getItem("token");
                let res = await authApis(token).post(endpoints['courses'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (res.status === 201) {
                    Alert.alert("Thành công", `Khóa học "${course.title}" đã được tạo và đang chờ duyệt.`);
                    console.log("Course created:", res.data);
                    navigation.goBack();
                }
            } catch (ex) {
                if (ex.response) {
                    console.error("Lỗi chi tiết từ Server:", ex.response.data);
                    Alert.alert("Lỗi", JSON.stringify(ex.response.data)); 
                } else {
                    console.error("Lỗi khác:", ex);
                }
                console.error(ex);
                Alert.alert("Lỗi", "Không thể tạo khóa học. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
    }

    const updateCourse = async () => {
        if (validate()) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('title', course.title);
                formData.append('description', course.description);
                formData.append('price', course.price);
                formData.append('category_id', value); 
                formData.append('duration', duration || course.duration || 0);
                if (selectedTags && selectedTags.length > 0) {
                    selectedTags.forEach(tagId => {
                        formData.append('tags_id', tagId);
                    });
                }

                if (course.image && typeof course.image === 'object' && course.image.uri) {
                    let localUri = course.image.uri;
                    let filename = localUri.split('/').pop();

                    let match = /\.(\w+)$/.exec(filename);
                    let type = match ? `image/${match[1]}` : `image/jpeg`;

                    formData.append('image', {
                        uri: localUri,
                        name: filename,
                        type: course.image.mimeType || type
                    });
                }

                if (course.intro_video && typeof course.intro_video === 'object' && course.intro_video.uri) {
                    let localUri = course.intro_video.uri;
                    let filename = localUri.split('/').pop();
                    let match = /\.(\w+)$/.exec(filename);
                    let type = match ? `video/${match[1]}` : `video/mp4`;

                    formData.append('intro_video', {
                        uri: localUri,
                        name: filename,
                        type: course.intro_video.mimeType || type
                    });
                }

                console.info("Updating Course ID:", courseId);


                console.info("Sending FormData...");

                const token = await AsyncStorage.getItem("token");
                let res = await authApis(token).patch(endpoints['course_detail'](course.id), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (res.status === 200) {
                    Alert.alert("Thành công", `Khóa học "${course.title}" đã được tạo và đang chờ duyệt.`);
                    console.log("Course created:", res.data);
                    navigation.goBack(); 
                }
            } catch (ex) {
                if (ex.response) {
                    console.error("Lỗi chi tiết từ Server:", ex.response.data);
                    Alert.alert("Lỗi", JSON.stringify(ex.response.data)); 
                } else {
                    console.error("Lỗi khác:", ex);
                }
                console.error(ex);
                Alert.alert("Lỗi", "Không thể tạo khóa học. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
    }



    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigation.goBack(); 
    }


    const submitCourse = async () => {
        console.info("Submitting course:", course);
    }

    useEffect(() => {
        loadCategories();
        loadTags();
        console.log(categories);
        console.log("TAGS", tags);
    }, []);

    useEffect(() => {
        console.log("VALUE", value);
        console.log("SELECTED TAGS", selectedTags);
    }, [value, selectedTags]);

    return (<>
        <ScrollView style={{ flex: 1, backgroundColor: Colors.light.background, paddingTop: 15 }}>
            <View style={{ alignItems: 'center', paddingHorizontal: 18 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', left: 0, top: 0, padding: 8, zIndex: 10 }}
                >
                    <ArrowLeftCircle color={Colors.light.primary} size={36} />
                </TouchableOpacity>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.light.primary, marginBottom: Spacing.md, textAlign: 'center', letterSpacing: 0.5, marginTop: 8 }}>
                    Chỉnh sửa khóa học
                </Text>
                <Divider style={{ marginBottom: Spacing.sm }} />
                {info.map(i =>
                    <TextField key={i.field}
                        placeholder={i.label}
                        left={i.leadingIcon}
                        {...(i.field === 'price' ? { keyboardType: 'numeric' } : {})}
                        {...(i.field === 'description' ? { multiline: true, height: 150 } : {})}
                        value={course[i.field]}
                        onChangeText={t => {
                            if (i.field === 'price') {
                                setCourse({ ...course, price: t === '' ? '' : Number(t) });
                            } else {
                                setCourse({ ...course, [i.field]: t });
                            }
                        }}
                    />
                )}

                <View style={{ width: '100%', marginBottom: 12, }}>
                    <Dropdown
                        style={[styles.dropdown, {
                            borderRadius: 20,
                            backgroundColor: 'white',
                            elevation: 8,
                            marginVertical: Spacing.sm,
                            width: '100%',
                        }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categories}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Danh mục' : '...'}
                        searchPlaceholder="Tìm kiếm..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setCourse({ ...course, "category_id": item.value });
                            setValue(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <MenuSquare color="black" size={20} style={styles.icon} />
                        )}
                    />
                </View>

                <View style={{ width: '100%', marginBottom: 12, }}>
                    <MultiSelect
                        style={[styles.dropdown, {
                            borderRadius: 20,
                            backgroundColor: 'white',
                            elevation: 8,
                            marginBottom: Spacing.sm,
                            width: '100%',
                        }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={tags}
                        labelField="label"
                        valueField="value"
                        placeholder="Nhãn"
                        value={selectedTags}
                        search
                        searchPlaceholder="Tìm kiếm..."
                        onChange={item => {
                            setSelectedTags(item);
                            setCourse({ ...course, "tags_id": selectedTags });
                        }}
                        renderLeftIcon={() => (
                            <Tag color="black" size={20} style={styles.icon} />
                        )}
                        renderSelectedItem={(item, unSelect) => (
                            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                <View style={[styles.selectedStyle, { borderColor: 'black', borderWidth: 1 }]}>
                                    <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                    <X color="red" size={17} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

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



                    {course.image ? (
                        <Image
                            source={{ uri: course.image.uri }}
                            style={{ width: 110, height: 110, borderRadius: 55 }}
                        />
                    ) : (
                        <View style={{ alignItems: 'center', maxWidth: 100 }}>
                            <View style={{ marginBottom: 6 }}>
                                <ImagePlusIcon color={'#4F8EF7'} size={38} />
                            </View>
                            <Text
                                style={{ color: '#4F8EF7', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                Chọn ảnh
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

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
                        <View style={{ alignItems: 'center', maxWidth: 100 }}>
                            <View style={{ marginBottom: 6 }}>
                                <Video color={'#F57C00'} size={38} />
                            </View>
                            <Text
                                style={{ color: '#F57C00', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                Chọn video
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Button
                    loading={loading}
                    disabled={loading}
                    mode="contained"
                    style={{ borderRadius: 12, marginTop: Spacing.md, backgroundColor: Colors.light.primary, elevation: 2, width: '100%', marginBottom: 50 }}
                    labelStyle={{ color: Colors.light.onPrimary, fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }}
                    onPress={courseId ? updateCourse : createCourse}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Lưu thay đổi
                </Button>
            </View>
        </ScrollView >

    </>
    );
};

export default CreateCourse;


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
        fontWeight: 'bold',
    },
});

