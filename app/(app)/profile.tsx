


import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/profileHeader';
import { useAuth } from "../../context/authContext";

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const item = useLocalSearchParams();
    const { profileUrl, username: initialUsername, email } = item;

    const [newUsername, setNewUsername] = useState(user?.username || initialUsername || "");
    const [loading, setLoading] = useState(false);

    const handleUpdateUsername = async () => {
        if (!user || !user.uid) return;
        if (!newUsername.trim()) {
            alert("Username cannot be empty");
            return;
        }
        
        setLoading(true);
        try {
            await updateUser({
                displayName: newUsername,
                username: newUsername
            });
            alert("Username updated successfully!");
        } catch (error) {
            console.error("Error updating username:", error);
            alert("Failed to update username");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ChatRoomHeader user={item} router={router} />

            {/* Profile Image */}
            <View className="items-center mt-16">
                <Image
                    source={{ uri: profileUrl || user?.profileUrl }}
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                    contentFit="cover"
                    transition={500}
                />
                <Text className="text-xl font-bold mt-4">{user?.displayName || user?.username || "Unknown User"}</Text>
                <Text className="text-gray-500">{user?.email || email || "No email available"}</Text>
            </View>

            {/* Update Username */}
            <View className="mt-6 px-4">
                <TextInput
                    className="border p-2 rounded-md"
                    placeholder="Enter new username"
                    value={newUsername}
                    onChangeText={setNewUsername}
                />
                <TouchableOpacity 
                    className="bg-blue-500 p-3 rounded-md mt-3 items-center"
                    onPress={handleUpdateUsername}
                    disabled={loading}
                >
                    <Text className="text-white font-bold">{loading ? "Updating..." : "Update Username"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}