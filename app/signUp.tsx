import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function Register() {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");
    const [loading, setLoading] = useState(false);
    const {register} = useAuth(); 

    const handleRegister = async() => {
        if (!emailRef.current || !passwordRef.current || !confirmPasswordRef.current || !usernameRef.current || !profileRef.current) {
            Alert.alert( 'Sign Up ' ,"Please fill in all fields");
            return;
        }
        if (passwordRef.current !== confirmPasswordRef.current) {
            Alert.alert( 'Password  ',"Passwords do not match!");
            return;
        }
        setLoading(true);
        let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);
        setLoading(false);

      console.log('got result' , response);
      if(!response.success){
      
        Alert.alert('Sign Up', response.error);
        return;
      }
    };

    return (
     <CustomKeyboardView inChat={false}>

    
            <StatusBar style="dark" />
            <View style={{ marginTop: hp(8), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
                
                {/* Register Image */}
                <View className="items-center">
                    <Image
                        style={{ height: hp(19) }}
                        resizeMode="contain"
                        source={require('../assets/images/register.png')}
                    />
                </View>

                {/* Form */}
                <View className="gap-10">
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
                        Sign Up
                    </Text>
                    <View className="gap-4">

                        {/* Username Input */}
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Ionicons name="person" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => usernameRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Username"
                                placeholderTextColor="gray"
                            />
                        </View>

                        {/* Email Input */}
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Ionicons name="mail" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => emailRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Email address"
                                placeholderTextColor="gray"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Profile URL Input */}
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Ionicons name="image" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => profileRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Profile Image URL"
                                placeholderTextColor="gray"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Ionicons name="lock-closed" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => passwordRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Password"
                                placeholderTextColor="gray"
                                secureTextEntry
                            />
                        </View>

                        {/* Confirm Password Input */}
                        <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
                            <Ionicons name="lock-closed" size={hp(2.7)} color="gray" />
                            <TextInput
                                onChangeText={(value) => confirmPasswordRef.current = value}
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Confirm Password"
                                placeholderTextColor="gray"
                                secureTextEntry
                            />
                        </View>

                        {/* Register Button */}
                        <View>
                            {loading ? (
                                <View className="flex-row justify-center">
                                    <Loading size={hp(6)} />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    style={{ height: hp(6.5) }}
                                    className="bg-indigo-500 rounded-xl justify-center items-center"
                                >
                                    <Text style={{ fontSize: hp(2.5) }} className="text-white font-bold">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="text-neutral-500">
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity>
                                <Pressable onPress={() => router.push('/signIn')}>
                                    <Text style={{ fontSize: hp(1.8) }} className="text-indigo-500 font-bold">
                                        Sign In
                                    </Text>
                                </Pressable>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
            </CustomKeyboardView>
    );
}