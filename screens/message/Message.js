import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
    ActivityIndicator, TextInput, StatusBar, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../utils/FireBaseConfig';
import { MyUserContext } from '../../utils/MyContexts';
import moment from 'moment';
import 'moment/locale/vi';
import { MessageCircleOff } from 'lucide-react-native';
import Theme from '../../styles/Theme';
moment.locale('vi');

const Message = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user,] = useContext(MyUserContext);
    const nav = useNavigation();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const chatsRef = ref(db, 'chats');
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const loadedConversations = Object.keys(data)
                    .map(key => {
                        const chatData = data[key];
                        let unreadCount = 0;
                        if (chatData.messages) {
                            Object.values(chatData.messages).forEach(msg => {
                                const senderId = msg.user?._id || msg.senderId;
                                if (senderId !== user.id && msg.read === false) {
                                    unreadCount++;
                                }
                            });
                        }
                        return {
                            id: key,
                            ...chatData.metadata,
                            unreadCount: unreadCount
                        };
                    }).filter(chat => chat.participants && chat.participants.hasOwnProperty(user.id));

                loadedConversations.sort((a, b) => b.updatedAt - a.updatedAt);
                setConversations(loadedConversations);
            } else {
                setConversations([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user.id]);

    const renderItem = ({ item }) => {
        const partnerId = Object.keys(item.participants).find(uid => uid !== String(user.id));
        const partnerData = item.participants[partnerId];

        if (!partnerData) return null;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.itemContainer}
                onPress={() => nav.navigate('Chat', {
                    partnerId: parseInt(partnerId),
                    partnerName: partnerData.name,
                    partnerAvatar: partnerData.avatar
                })}
            >
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: partnerData.avatar }}
                        style={styles.avatar}
                    />
                
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Text style={styles.name} numberOfLines={1}>{partnerData.name}</Text>
                        <Text style={styles.time}>
                            {item.updatedAt ? moment(item.updatedAt).fromNow(true) : ''}
                        </Text>
                    </View>

                    <View style={styles.bottomRow}>
                        <Text numberOfLines={1} style={styles.lastMessage}>
                            {item.lastMessage}
                        </Text>
                        {item.unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.surface} />

            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Tin nhắn</Text>

                {/* <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        placeholderTextColor={Theme.colors.textMuted}
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View> */}
            </View>

            <View style={styles.container}>
                {conversations.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MessageCircleOff size={64} color={Theme.colors.textMuted} />
                        <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
                        <Text style={styles.emptySubText}>Hãy bắt đầu kết nối với mọi người ngay!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Message;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: Theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Theme.colors.text,
    },
    container: {
        flex: 1,
        backgroundColor: Theme.colors.surface
    },
    listContent: {
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
    },
    loadingText: {
        marginTop: 10,
        color: Theme.colors.textMuted,
        fontSize: 14,
    },

    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E1E4E8',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: Theme.colors.surface,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontWeight: '700',
        fontSize: 17,
        color: '#1a1a1a',
        flex: 1,
        marginRight: 10,
    },
    time: {
        fontSize: 12,
        color: Theme.colors.textMuted,
        fontWeight: '500',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastMessage: {
        fontSize: 15,
        color: Theme.colors.textMuted,
        flex: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50,
    },

    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: Theme.colors.textMuted,
    },
    badge: {
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        paddingHorizontal: 5,
    },
    badgeText: {
        color: Theme.colors.surface,
        fontSize: 11,
        fontWeight: 'bold',
    },
});