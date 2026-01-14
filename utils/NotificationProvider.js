import { useContext, useEffect, useState } from "react";
import { MyUserContext, NotificationContext } from "./MyContexts";
import { ref, onValue } from 'firebase/database';
import { db } from './FireBaseConfig';

export const NotificationProvider = ({ children }) => {
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [user, ] = useContext(MyUserContext);

   useEffect(() => {
        if (!user || !user.id) {
            setUnreadTotal(0);
            return;
        }

        const chatsRef = ref(db, 'chats');
        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const data = snapshot.val();
            let total = 0;

            if (data) {
                Object.values(data).forEach(chat => {
                    if (chat.metadata?.participants && chat.metadata.participants.hasOwnProperty(user.id)) {
                        if (chat.messages) {
                            Object.values(chat.messages).forEach(msg => {
                                const senderId = msg.user?._id || msg.senderId;
                                if (senderId && String(senderId) !== String(user.id) && msg.read === false) {
                                    total++;
                                }
                            });
                        }
                    }
                });
            }
            console.log('🔔 Total unread messages:', total);
            setUnreadTotal(total);
        });

        return () => unsubscribe();
    }, [user]);
    return (
        <NotificationContext.Provider value={unreadTotal}>
            {children}
        </NotificationContext.Provider>
    );
};