import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { Text, Searchbar, Badge, TouchableRipple, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Dữ liệu mẫu mở rộng
const users = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        lastMessage: 'Chào bạn, mình muốn hỏi về khóa học React Native nâng cao thì lộ trình thế nào?',
        time: '10:30',
        unread: 2,
        isOnline: true,
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        lastMessage: 'Cảm ơn bạn đã hỗ trợ!',
        time: '09:15',
        unread: 0,
        isOnline: false,
    },
    {
        id: 3,
        name: 'Phạm Văn C',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        lastMessage: 'Khi nào có lớp mới vậy?',
        time: 'Hôm qua',
        unread: 1,
        isOnline: true,
    },
    {
        id: 4,
        name: 'Lê Thị D',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        lastMessage: 'Đã gửi file bài tập ạ.',
        time: 'Thứ 2',
        unread: 0,
        isOnline: false,
    },
];

const Message = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const renderItem = ({ item }) => (
        <TouchableRipple
            onPress={() => console.log('Chat with', item.name)}
            rippleColor="rgba(25, 118, 210, 0.1)"
            style={styles.chatItem}
        >
            <View style={styles.row}>
                {/* Avatar & Online Status */}
                <View style={styles.avatarContainer}>
                    <Avatar.Image size={56} source={{ uri: item.avatar }} />
                    {item.isOnline && <View style={styles.onlineIndicator} />}
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.timeText, item.unread > 0 && styles.timeTextActive]}>
                            {item.time}
                        </Text>
                    </View>
                    
                    <View style={styles.messageRow}>
                        <Text 
                            style={[styles.lastMessage, item.unread > 0 && styles.lastMessageBold]} 
                            numberOfLines={1}
                        >
                            {item.lastMessage}
                        </Text>
                        
                        {item.unread > 0 && (
                            <Badge size={20} style={styles.badge}>{item.unread}</Badge>
                        )}
                    </View>
                </View>
            </View>
        </TouchableRipple>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header Title */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>
                {/* <IconButton icon="square-edit-outline" iconColor="#1976D2" size={24} onPress={() => {}} /> */}
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm kiếm tin nhắn..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor="#94A3B8"
                />
            </View>

            {/* Chat List */}
            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default Message;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchBar: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        height: 46,
        elevation: 0,
    },
    searchInput: {
        fontSize: 15,
        minHeight: 0, // Fix lỗi chiều cao input trên Android
    },
    listContent: {
        paddingBottom: 20,
    },
    chatItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    timeTextActive: {
        color: '#1976D2',
        fontWeight: '600',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 15,
        color: '#64748B',
        flex: 1,
        marginRight: 16,
    },
    lastMessageBold: {
        color: '#1E293B',
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#1976D2',
        color: '#fff',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 92, // Thụt vào thẳng hàng với text (Avatar width 56 + Margin 16 + Padding 20)
    },
});

