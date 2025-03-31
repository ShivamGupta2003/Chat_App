import { View, Text } from 'react-native';
import React from 'react';

export default function MessageItem({ message, currentUser }) {
  const isCurrentUser = currentUser?.userId === message?.userId;

  if (isCurrentUser) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginVertical: 5,
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            maxWidth: '75%',
            borderRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16 }}>{message.text}</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#777',
              alignSelf: 'flex-end',
              marginTop: 5,
            }}
          >
            {new Date(message.createdAt?.seconds * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: 5,
          marginHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            maxWidth: '75%',
            borderRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 0,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ color: '#000', fontSize: 16 }}>{message.text}</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#777',
              alignSelf: 'flex-end',
              marginTop: 5,
            }}
          >
            {new Date(message.createdAt?.seconds * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  }
}
