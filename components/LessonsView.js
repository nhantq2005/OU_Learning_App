// FILE: components/LessonsView.js
import { Edit, Eye, EyeOff, Trash } from 'lucide-react-native';
import React from 'react';
import { FlatList, TouchableOpacity, Text, View, Image } from 'react-native';
import LessonItem from './LessonItem';
import { Snackbar } from 'react-native-paper';

const LessonsView = ({ lessons, onPressLesson, currentLessonId }) => {
    // Kiểm tra an toàn: nếu lessons không phải mảng thì trả về null hoặc mảng rỗng
    const safeLessons = Array.isArray(lessons) ? lessons : [];
    const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
    const [msg, setMsg] = React.useState("");

    return (
        <>
        <FlatList
            data={safeLessons}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <LessonItem lesson={item} onPressLesson={onPressLesson} currentLessonId={currentLessonId} />
            //     <TouchableOpacity 
            //         onPress={() => onPressLesson(item.id)} 
            //         style={{ 
            //             padding: 15, 
            //             borderBottomWidth: 1, 
            //             borderColor: '#eee',
            //             backgroundColor: item.id === currentLessonId ? '#e3f2fd' : '#fff',
            //             flexDirection: 'row',
            //             justifyContent: 'space-between',
            //         }}
            //     >
            //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            //                     <Image
            //                         source={{ uri: item.thumbnail }}
            //                         style={{ width: 40, height: 40, borderRadius: 5, resizeMode: 'cover', marginRight: 15 }}
                    
            //                     />
            //         <Text style={{ 
            //             fontWeight: item.id === currentLessonId ? 'bold' : 'normal',
            //             color: item.id === currentLessonId ? '#2568acff' : '#000'
            //         }}>
            //             {item.name}
            //         </Text>
            //         </View>
            //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            //     {/* Dùng TouchableOpacity bọc icon để bấm được */}
            //     <TouchableOpacity onPress={() => console.log('Delete')} style={{ padding: 4 }}>
            //         <Trash size={20} color="#EF4444" />
            //     </TouchableOpacity>
                
            //     <TouchableOpacity onPress={() => console.log('Edit')} style={{ padding: 4, marginLeft: 8 }}>
            //         <Edit size={20} color="#1976D2" />
            //     </TouchableOpacity>

            //     {/* Demo logic ẩn hiện mắt */}
            //     <TouchableOpacity style={{ padding: 4, marginLeft: 8 }}>
            //          <Eye size={20} color="#4B5563" />
            //     </TouchableOpacity>
            //                     <TouchableOpacity style={{ padding: 4, marginLeft: 8 }}>
            //          <EyeOff size={20} color="#4B5563" />
            //     </TouchableOpacity>
            // </View>
            //     </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{padding: 20, textAlign: 'center'}}>Chưa có bài học nào.</Text>}
        />
        <Snackbar
        visible={  visibleSnackbar}
        // onDismiss={onDismissSnackBar}
        // action={{
        //   label: 'Undo',
        //   onPress: () => {
        //     // Do something
        //   },
        // }}
        >
        { msg}
      </Snackbar>
        </>
    );
};

// QUAN TRỌNG: Phải có dòng này để file kia import được
export default LessonsView;