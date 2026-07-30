import React, { useState, useEffect, useCallback, useContext, useLayoutEffect, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer, Time, Day } from 'react-native-gifted-chat';
import { ref, onValue, push, update, query, limitToLast } from 'firebase/database';
import { db } from '../../utils/FireBaseConfig';
import { MyUserContext } from '../../utils/MyContexts';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Theme from '../../styles/Theme';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [user] = useContext(MyUserContext);
    const route = useRoute();
    const navigation = useNavigation();
    const { partnerId, partnerName, partnerAvatar } = route.params;

    const conversationId = useMemo(() =>
        user.id < partnerId ? `${user.id}_${partnerId}` : `${partnerId}_${user.id}`
        , [user.id, partnerId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: partnerAvatar || null }}
                        style={styles.headerAvatar}
                    />
                    <View>
                        <Text style={styles.headerName}>{partnerName}</Text>
                        <Text style={styles.headerStatus}>Đang hoạt động</Text>
                    </View>
                </View>
            ),
            headerStyle: { backgroundColor: Theme.colors.surface, elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
            headerTitleAlign: 'left',
        });
    }, [navigation, partnerName, partnerAvatar]);

    useEffect(() => {
        const messagesRef = ref(db, `chats/${conversationId}/messages`);
        const q = query(messagesRef, limitToLast(50));

        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedMessages = Object.keys(data).map(key => ({
                    _id: key,
                    text: data[key].text,
                    createdAt: new Date(data[key].createdAt),
                    user: data[key].user,
                    sent: true,
                    received: true,
                }));

                Object.keys(data).forEach(key => {
                    const msg = data[key];
                    if (msg.user._id !== user.id && msg.read === false) {
                        update(ref(db, `chats/${conversationId}/messages/${key}`), { read: true });
                    }
                });

                formattedMessages.sort((a, b) => b.createdAt - a.createdAt);
                setMessages(formattedMessages);
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [conversationId, user.id]);

    const onSend = useCallback(async (newMessages = []) => {
        const msg = newMessages[0];
        const timestamp = Date.now();

        const messageData = {
            text: msg.text,
            createdAt: timestamp,
            read: false,
            user: {
                _id: user.id,
                name: `${user.last_name} ${user.first_name}`,
                avatar: user.avatar || null
            }
        };

        const newMessageKey = push(ref(db, `chats/${conversationId}/messages`)).key;
        const updates = {};
        updates[`chats/${conversationId}/messages/${newMessageKey}`] = messageData;
        updates[`chats/${conversationId}/metadata`] = {
            lastMessage: msg.text,
            updatedAt: timestamp,
            participants: {
                [user.id]: { name: `${user.last_name} ${user.first_name}`, avatar: user.avatar || null },
                [partnerId]: { name: partnerName, avatar: partnerAvatar || null }
            }
        };

        try {
            await update(ref(db), updates);
        } catch (error) {
            console.error("Lỗi gửi tin:", error);
        }
    }, [conversationId, user, partnerId, partnerName, partnerAvatar]);


    const renderBubble = useCallback((props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#1976D2',
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 15, borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                    marginBottom: 5
                },
                left: {
                    backgroundColor: Theme.colors.surface,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 15, borderTopLeftRadius: 15, borderBottomRightRadius: 15,
                    marginBottom: 5,
                    ...styles.shadow
                }
            }}
            textStyle={{
                right: { color: Theme.colors.surface, fontSize: 15 },
                left: { color: Theme.colors.text, fontSize: 15 }
            }}
        />
    ), []);

    const renderInputToolbar = useCallback((props) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={{ alignItems: 'center' }}
        />
    ), []);

    const renderComposer = useCallback((props) => (
        <Composer
            {...props}
            textInputStyle={styles.composer}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={Theme.colors.textMuted}
            multiline={true}
        />
    ), []);

    const renderSend = useCallback((props) => (
        <Send {...props} containerStyle={{ justifyContent: 'center', marginRight: 10 }}>
            <View style={styles.sendButton}>
                <Ionicons name="send" size={20} color={Theme.colors.surface} style={{ marginLeft: 2 }} />
            </View>
        </Send>
    ), []);

    const renderActions = useCallback(() => (
        <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add" size={28} color="#1976D2" />
        </TouchableOpacity>
    ), []);

    const renderTime = useCallback((props) => (
        <Time
            {...props}
            timeTextStyle={{
                right: { color: 'rgba(255,255,255,0.7)' },
                left: { color: Theme.colors.textMuted }
            }}
        />
    ), []);

    const scrollToBottomComponent = useCallback(() => (
        <Ionicons name="chevron-down" size={24} color={Theme.colors.textMuted} />
    ), []);


    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{ _id: user.id }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderSend={renderSend}
                // renderActions={renderActions}
                renderTime={renderTime}
                renderDay={(props) => <Day {...props} textStyle={{ color: Theme.colors.textMuted, fontWeight: '600' }} />}
                maxInputLength={200}
                alwaysShowSend
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                minInputToolbarHeight={60}
                showUserAvatar={false}
                showAvatarForEveryMessage={false}
                keyboardShouldPersistTaps="never"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB'
    },
    shadow: {
        shadowColor: Theme.colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -10,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: Theme.colors.surfaceMuted
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Theme.colors.text
    },
    headerStatus: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500'
    },
    inputToolbar: {
        backgroundColor: Theme.colors.surface,
        borderTopWidth: 0,
        marginHorizontal: 15,
        marginBottom: 10,
        marginTop: 5,
        borderRadius: 25,
        paddingVertical: 2,
        shadowColor: Theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    composer: {
        backgroundColor: '#F2F2F2',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 8,
        marginRight: 10,
        fontSize: 16,
        color: Theme.colors.text,
        minHeight: 35,
    },
    sendButton: {
        backgroundColor: '#1976D2',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.62,
        elevation: 4,
    },
    actionButton: {
        width: 40,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    }
});

export default Chat;