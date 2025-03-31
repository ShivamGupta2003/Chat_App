import { View, TextInput, TouchableOpacity  , Alert, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { useAuth } from '@/context/authContext';
import { getRoomId } from '@/utlis/common';
import { collection, doc, setDoc, Timestamp, addDoc, onSnapshot, orderBy, query, DocumentData } from 'firebase/firestore';
import { db } from '@/firebaseConfig';


export default function ChatRoom() {
  const item = useLocalSearchParams();//sec user 
  const {user} = useAuth();// login user 


  const router = useRouter();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const textRef = useRef("");
  const inputRef = useRef<TextInput>(null);


  const scrollViewRef = useRef(null);
  useEffect(() => {
    createRoomIfNotExists();


    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
  
    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) =>{  
        return  doc.data() ;
      });
      setMessages([...allMessages]);
    });
  
      const KeyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow', updatescrollView
      )

      return ()=>{
    unsub();
    KeyboardDidShowListener.remove();

      }
  }, []);
  useEffect(()=>{
    updatescrollView();
  },[messages]);

  const updatescrollView=()=>{
    setTimeout(()=>{
      scrollViewRef?.current?.scrollToEnd({animated:true});
    }, 100)
  }

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId, 
      createdAt: Timestamp.fromDate(new Date()) 
    });
  };
  
  const handleSendMessage = async () => {
    try {
      let message = textRef.current.trim();
  
      if (!message) return;
  
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      textRef.current="";
      if(inputRef) inputRef?.current?.clear();
  
      const newDoc = await addDoc(messagesRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
      });
  
      console.log("New message ID:", newDoc.id);
    } catch (err) {
      Alert.alert("Message", err instanceof Error ? err.message : String(err));
    }
  };


 
  return (
    <CustomKeyboardView inChat={true}>
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ChatRoomHeader user={item} router={router} />

      <View className="h-[1%] border-b border-gray-300" />

      <View className="flex-1 justify-between bg-gray-100">
        <View className="flex-1">
          <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
        </View>

        <View className="mb-[1.7%] pt-[2%]">
          <View className="flex-row justify-between items-center mx-[1.5%] border border-gray-300 rounded-full bg-white p-2">
            <TextInput 
            ref = {inputRef}
            onChangeText={value => textRef.current = value }
              placeholder='Type a message...'
              className="flex-1 px-3 py-2 text-base h-10"
              multiline
             
              numberOfLines={2}
            />
            <TouchableOpacity onPress={handleSendMessage} className="bg-neutral-200 p-2 mr-[1%] rounded-full">
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    </CustomKeyboardView>
  );
}


