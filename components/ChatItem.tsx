
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { blurhash } from "../utlis/common";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from "../firebaseConfig";
import { getRoomId } from "../utlis/common";

export default function ChatItem({ item, router, noBorder, currentUser }) {  
    const [lastMessage, setLastMessage] = useState(undefined);
    const [lastMessageTime, setLastMessageTime] = useState("");

    useEffect(() => {
        if (!currentUser || !item) return; // Prevent running if data is missing

        let roomId = getRoomId(currentUser.userId, item.userId);
        const messagesRef = collection(db, "rooms", roomId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map((doc) => doc.data());
            let latestMessage = allMessages[0] || null;
            setLastMessage(latestMessage);

            // Extract and format time
            if (latestMessage?.createdAt) {
                const date = latestMessage.createdAt.toDate(); // Convert Firestore Timestamp
                const formattedTime = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric', 
                    minute: 'numeric', 
                    hour12: true 
                }).format(date);
                setLastMessageTime(formattedTime);
            } else {
                setLastMessageTime("");
            }
        });

        return () => unsub(); // Ensure cleanup function is always returned
    }, [currentUser, item]);

    const openChatRoom = () => {
        router.push({
            pathname: "/chatRoom",
            params: item,
        });
    };

    const renderLastMessage = () => {
        if (typeof lastMessage === 'undefined') return 'Loading...';
        if (lastMessage) {
            if (currentUser?.userId === lastMessage?.userId) 
                return `You: ${lastMessage?.text}`;
            return lastMessage?.text;
        } else {
            return 'Say Hi 👋';
        }
    };

    return (
        <TouchableOpacity 
            onPress={openChatRoom}
            className={`flex-row items-center justify-between mx-4 gap-3 mb-4 pb-2 ${
                noBorder ? "" : "border-b border-neutral-200"
            }`}
        >
            {/* Profile Image */}
            <Image 
                source={item.profileUrl} 
                style={{ height: 56, width: 56, borderRadius: 28 }} 
                contentFit="cover"
                placeholder={blurhash}
                transition={300}
            />

            {/* Chat Content */}
            <View className="flex-1">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold">{item?.username || "Unknown"}</Text>
                    <Text className="text-xs text-gray-500">{lastMessageTime || "Now"}</Text> {/* Last Message Time */}
                </View>
                <Text className="text-sm text-gray-500 mt-1">{renderLastMessage()}</Text> {/* Last Message */}
            </View>
        </TouchableOpacity>
    );
}
