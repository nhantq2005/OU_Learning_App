import { Edit, Eye, EyeOff } from "lucide-react-native";
import { Trash } from "lucide-react-native/icons";
import { useContext, useEffect } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { MyUserContext } from "../utils/MyContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../utils/Apis";
import { useNavigation } from "@react-navigation/native";

const LessonItem = ({ lesson, onPressLesson, currentLessonId, deleteLesson, hideLesson, unhideLesson }) => {

    const [user,] = useContext(MyUserContext);
    const nav = useNavigation();

    // const deleteLesson = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         Alert.alert(
    //             "Xác nhận", // Tiêu đề
    //             "Bạn có chắc chắn muốn xóa mục này không?", // Nội dung
    //             [
    //                 { text: "Hủy", style: "cancel" },
    //                 { text: "Đồng ý", onPress: async () => await authApis(token).delete(endpoints['lesson_detail'](lesson.id)) }
    //             ]
    //         );

    //     } catch (error) {
    //         console.error("Failed to delete lesson:", error);
    //     }
    // }

    // const hideLesson = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         await authApis(token).post(endpoints['hide_lesson'](lesson.id));
    //     } catch (error) {
    //         console.error("Failed to hide lesson:", error);
    //     }
    // }

    // const unhideLesson = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem("token");
    //         await authApis(token).post(endpoints['unhide_lesson'](lesson.id));
    //     } catch (error) {
    //         console.error("Failed to unhide lesson:", error);
    //     }
    // }

    useEffect(() => {
        console.log("Lesson item rendered:", lesson);
    }, [lesson]);

    return (
        // <TouchableOpacity
        //     onPress={() => nav.navigate('CourseDetail', { courseId: lesson.id })} // Sửa course.id thành lesson.id nếu cần
        //     style={{
        //         flexDirection: 'row', // Xếp ngang
        //         width: '100%',
        //         backgroundColor: '#fff',
        //         padding: 10,
        //         borderRadius: 14,
        //         marginBottom: 10,
        //         // Shadow
        //         elevation: 4,
        //         shadowColor: '#1976D2',
        //         shadowOffset: { width: 0, height: 2 },
        //         shadowOpacity: 0.12,
        //         shadowRadius: 6,
        //         alignItems: 'center', // Canh giữa theo trục dọc
        //     }}>

        //     {/* PHẦN 1: ẢNH (Kích thước cố định, không dùng flex) */}
        //     <Image
        //         source={{ uri: lesson.thumbnail || 'https://via.placeholder.com/100' }} // Thêm fallback ảnh nếu lỗi
        //         style={{ 
        //             width: 80, // Giảm size chút cho cân đối
        //             height: 60, 
        //             borderRadius: 10, 
        //             resizeMode: 'cover' 
        //         }}
        //     />

        //     {/* PHẦN 2: CHỮ (Dùng Flex: 1 để chiếm hết khoảng trống ở giữa) */}
        //     <View style={{ flex: 1, marginHorizontal: 12, justifyContent: 'center' }}>
        //         <Text 
        //             style={{ fontSize: 15, fontWeight: 'bold', color: '#1976D2' }} 
        //             numberOfLines={2} 
        //             ellipsizeMode="tail"
        //         >
        //             {lesson.name}
        //         </Text>
        //     </View>

        //     {/* PHẦN 3: ICONS (Không dùng flex, width tự động theo nội dung) */}
        //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        //         {/* Dùng TouchableOpacity bọc icon để bấm được */}
        //         <TouchableOpacity onPress={() => console.log('Delete')} style={{ padding: 4 }}>
        //             <Trash size={20} color="#EF4444" />
        //         </TouchableOpacity>

        //         <TouchableOpacity onPress={() => console.log('Edit')} style={{ padding: 4, marginLeft: 8 }}>
        //             <Edit size={20} color="#1976D2" />
        //         </TouchableOpacity>

        //         {/* Demo logic ẩn hiện mắt */}
        //         <TouchableOpacity style={{ padding: 4, marginLeft: 8 }}>
        //              <Eye size={20} color="#4B5563" />
        //         </TouchableOpacity>
        //     </View>

        // </TouchableOpacity>





        <TouchableOpacity
            onPress={() => onPressLesson(lesson.id)}
            style={{
                padding: 15,
                borderBottomWidth: 1,
                borderColor: '#eee',
                backgroundColor: lesson.id === currentLessonId ? '#e3f2fd' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{ uri: lesson.thumbnail }}
                    style={{ width: 40, height: 40, borderRadius: 5, resizeMode: 'cover', marginRight: 15 }}

                />
                <Text style={{
                    fontWeight: lesson.id === currentLessonId ? 'bold' : 'normal',
                    color: lesson.id === currentLessonId ? '#2568acff' : '#000'
                }}>
                    {lesson.name}
                </Text>
            </View>
            {user.role === 'teacher' && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Dùng TouchableOpacity bọc icon để bấm được */}
                    <TouchableOpacity onPress={() => deleteLesson(lesson.id)} style={{ padding: 4 }}>
                        <Trash size={20} color="#EF4444" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => nav.navigate('EditLesson', { lessonId: lesson.id })} style={{ padding: 4, marginLeft: 8 }}>
                        <Edit size={20} color="#1976D2" />
                    </TouchableOpacity>

                    {/* Demo logic ẩn hiện mắt */}
                    {lesson.active ? (
                        // Nếu đang hiện (Active) -> Bấm vào gọi HIDE
                        <TouchableOpacity onPress={() => hideLesson(lesson.id)} style={{ padding: 4, marginLeft: 8 }}>
                            <Eye size={20} color="#4B5563" />
                        </TouchableOpacity>
                    ) : (
                        // Nếu đang ẩn (Inactive) -> Bấm vào gọi UNHIDE
                        <TouchableOpacity onPress={() => unhideLesson(lesson.id)} style={{ padding: 4, marginLeft: 8 }}>
                            <EyeOff size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>

    );
};

export default LessonItem;