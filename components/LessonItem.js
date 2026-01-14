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

    useEffect(() => {
        console.log("Lesson item rendered:", lesson);
    }, [lesson]);

    return (
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
                    <TouchableOpacity onPress={() => deleteLesson(lesson.id)} style={{ padding: 4 }}>
                        <Trash size={20} color="#EF4444" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => nav.navigate('EditLesson', { lessonId: lesson.id })} style={{ padding: 4, marginLeft: 8 }}>
                        <Edit size={20} color="#1976D2" />
                    </TouchableOpacity>

                    {lesson.active ? (
                        <TouchableOpacity onPress={() => hideLesson(lesson.id)} style={{ padding: 4, marginLeft: 8 }}>
                            <Eye size={20} color="#4B5563" />
                        </TouchableOpacity>
                    ) : (
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