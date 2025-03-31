import { View, Text, Platform } from "react-native";
import React from 'react';
import {useRouter} from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from "expo-image";
import { blurhash } from"../utlis/common";
import { useAuth } from "../context/authContext";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { MenuItem } from "./CustomMenuItems";
import { Ionicons } from "@expo/vector-icons";


const isIOS = Platform.OS === 'ios';

export default function HomeHeader() {
    const { top } = useSafeAreaInsets();
    const {user , logout} = useAuth();
    const router = useRouter();
    const handleProfile = () => {
        router.push({
            pathname: "/profile",
            params: {
                profileUrl: user?.profileUrl,
                username: user?.username,
                email: user?.email
            }
        });
    };
    const handleLogout = async() => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
       
    };

    
    return (
        <View style={{ paddingTop: isIOS ? top : top + 15 }} className="flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow">
            <View>

          
            <Text style={{ fontSize: hp(2.7) }} className="font-medium text-white">
                Chats
            </Text>
            </View>
            <View>

            <Menu>
    <MenuTrigger >
    <Image
    style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
    source={user?.profileUrl}
    placeholder={blurhash}
    transition={500}
  />
  </MenuTrigger>
    <MenuOptions  customStyles={
        {
            optionsContainer: {
                backgroundColor: 'white',
                width: wp(40),
                borderRadius: 10,
                padding: 0,
                marginTop: 28,
                marginRight: 10,
                marginLeft: -25,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            },
            optionWrapper:{
                paddingVertical: hp(1.5),
            },
            optionTouchable:{
                activeOpacity: 70
            }
        }
    } 
    >
        <MenuItem  
        text="Profile" 
        action={handleProfile}
        value={null}
        icon= {<Ionicons name="person" size={hp(2.7)} color="gray" />}
        />
       <Divider />
   
        <MenuItem  
        text="Sign Out" 
        action={handleLogout}
        value={null}
        icon= {<Ionicons name="log-out-outline" size={hp(2.7)} color="gray" />}
        />
    </MenuOptions>
  </Menu>
</View>

        </View>
    );
}


const Divider = () => (
    <View className="p-[1px] bg-gray-200" 
    />
);