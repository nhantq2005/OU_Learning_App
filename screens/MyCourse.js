import React from 'react';
import { View, FlatList, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MyStyles from '../styles/MyStyles';

// Dữ liệu mẫu, bạn có thể thay bằng API
const courses = [
    {
        id: 1,
        title: 'Lập trình React Native',
        instructor: 'ThS. Dương Hữu Thành',
        image: 'https://img.freepik.com/premium-vector/online-education-concept-illustration_114360-6261.jpg?w=2000',
        status: 'Đang học',
    },
    {
        id: 2,
        title: 'Thiết kế UI/UX',
        instructor: 'Nguyễn Văn B',
        image: 'https://img.freepik.com/premium-vector/online-education-concept-illustration_114360-6261.jpg?w=2000',
        status: 'Hoàn thành',
    },
    {
        id: 3,
        title: 'Python cơ bản',
        instructor: 'Trần Thị C',
        image: 'https://img.freepik.com/premium-vector/online-education-concept-illustration_114360-6261.jpg?w=2000',
        status: 'Đang học',
    },
];

const MyCourse = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#F0F4FF', padding: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1565C0', marginBottom: 22, letterSpacing: 0.5 }}>Khóa học của tôi</Text>
            <FlatList
                data={courses}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            borderRadius: 22,
                            marginBottom: 18,
                            padding: 14,
                            shadowColor: '#1565C0',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.12,
                            shadowRadius: 12,
                            elevation: 4,
                            borderWidth: 1.5,
                            borderColor: '#E3EAFD',
                            position: 'relative',
                        }}
                    >
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: 90, height: 90, borderRadius: 16, marginRight: 18, backgroundColor: '#e3eafc', borderWidth: 2, borderColor: '#B3D1FF' }}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 6,
                                    left: 6,
                                    backgroundColor: item.status === 'Hoàn thành' ? '#167F71CC' : '#FF6B00CC',
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{item.status}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1565C0', marginBottom: 2, letterSpacing: 0.2 }}>{item.title}</Text>
                            <Text style={{ color: '#5C6BC0', fontSize: 16, marginBottom: 4 }}>{item.instructor}</Text>
                        </View>
                        <Button
                            mode="contained"
                            style={{
                                borderRadius: 10,
                                backgroundColor: '#1976D2',
                                height: 40,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                shadowColor: '#1976D2',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.18,
                                shadowRadius: 6,
                                elevation: 2,
                                minWidth: 90,
                            }}
                            labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.2 }}
                            onPress={() => {}}
                        >
                            Vào học
                        </Button>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </View>
    );
};

export default MyCourse;