import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../components/ChatList';


import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const Home = () => {
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    try {
      const userRef = collection(db, 'users'); 
      const q = query(userRef, where("userId", "!=", user?.uid));
      const querySnapshot = await getDocs(q);


      let data = [];
        querySnapshot.forEach((doc) => {
            data.push({...doc.data()});
        });
     
        setUsers(data);
      
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />

      {loading ? (
        <View className="flex items-center justify-center" style={{ height: hp(50) }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : users.length > 0 ? (
        <ChatList currentUser ={user} users={users} />
      ) : (
        <View className="flex items-center justify-center" style={{ height: hp(50) }}>
          <Text className="text-gray-500 text-lg">No users found</Text>
        </View>
      )}

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50">
        <Text className="text-center">@Shivam</Text>
      </View>
    </View>
  );
};

export default Home;
