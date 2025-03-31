import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Entypo, Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(2) }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={hp(4)} color="#373737" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(1.5) }}>
              <Image
                source={{ uri: user?.profileUrl }}
                style={{ height: hp(4.5), width: hp(4.5), borderRadius: 100 }}
              />
              <Text style={{ fontSize: hp(2.5), color: '#373737', fontWeight: '500' }}>
                {user?.username}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(4), marginRight: wp(3) }}>
            <TouchableOpacity onPress={() => console.log('Audio Call Pressed')}>
              <Feather name="phone" size={hp(3)} color="#373737" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Video Call Pressed')}>
              <Feather name="video" size={hp(3)} color="#373737" />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
}
