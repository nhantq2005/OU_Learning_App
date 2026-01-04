import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import MyStyles from '../styles/MyStyles';

// Dữ liệu mẫu, bạn có thể thay bằng API
const users = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        lastMessage: 'Chào bạn, mình muốn hỏi về khóa học...',
        time: '10:30',
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
        time: '09:15',
    },
    {
        id: 3,
        name: 'Phạm Văn C',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        lastMessage: 'Khi nào có lớp mới vậy?',
        time: 'Hôm qua',
    },
];

const Message = ({ navigation }) => {
    const [selected, setSelected] = useState(null);
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F9FF', padding: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1976D2', marginBottom: 18, letterSpacing: 0.5 }}>Tin nhắn</Text>
            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: item.id === selected ? '#E3F2FD' : '#fff',
                            borderRadius: 18,
                            marginBottom: 12,
                            paddingVertical: 14,
                            paddingHorizontal: 10,
                            shadowColor: '#1976D2',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            elevation: item.id === selected ? 4 : 1,
                        }}
                        activeOpacity={0.85}
                        onPress={() => setSelected(item.id)}
                    >
                        <Image source={{ uri: item.avatar }} style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16, borderWidth: 2, borderColor: item.id === selected ? '#1976D2' : '#eee', backgroundColor: '#f5f6fa' }} />
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1976D2', marginBottom: 2 }}>{item.name}</Text>
                            <Text style={{ color: '#888', fontSize: 15, marginTop: 2, fontStyle: 'italic' }} numberOfLines={1}>{item.lastMessage}</Text>
                        </View>
                        <Text style={{ color: '#B0B0B0', fontSize: 13, marginLeft: 8 }}>{item.time}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Message;