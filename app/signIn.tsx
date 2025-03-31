import { View, Text, Image, TextInput, TouchableOpacity, Pressable , Alert , } from 'react-native';
import React, { useRef , useState } from 'react';
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

export default function SignIn() {
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const {login, 
      resetPassword} = useAuth();

      const [resetLoading, setResetLoading] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const handleLogin =async() => {
      
       if(!emailRef.current || !passwordRef.current) {
        Alert.alert("Please fill in all fields");
        return;
        }
        setLoading(true);
        const response =await login(emailRef.current, passwordRef.current);
        setLoading(false);
        if(!response.success) {
     
          Alert.alert(response.error);
          return;
        }
        router.push('/home');
        Alert.alert("Login successful");
        return;


    }

    const handlePasswordReset = async () => {
      if (!emailRef.current) {
        Alert.alert("Please enter your email to reset password");
        return;
      }
    
      setResetLoading(true);
      try {
        const response = await resetPassword(emailRef.current); 
        if (!response.success) {
          console.log("Reset error:", response.error); // Add logging
          Alert.alert("Error", response.error);
        } else {
          Alert.alert("Success", "Password reset email sent! Check your inbox.");
        }
      } catch (error) {
        console.log("Unexpected error:", error); // Add logging
        Alert.alert("Error", "An unexpected error occurred");
      } finally {
        setResetLoading(false);
      }
    };

  return (
      <CustomKeyboardView inChat={false}>
      <StatusBar style="dark" />
      
      <View style={{ marginTop: hp(8), paddingHorizontal: wp(5) }} className="flex-1 gap-12">
        {/* SignIn image */}
        <View className="items-center">
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require('../assets/images/login.png')}
          />
        </View>

        {/* Form */}
        <View className="gap-10">
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
            Sign In
          </Text>
          <View className='gap-4'>

         

          {/* Email Input */}
          <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
            <Ionicons name="mail" size={hp(2.7)} color="gray" />
            <TextInput
             onChangeText={value => emailRef.current = value }
              style={{ fontSize: hp(2) }}

              className="flex-1 font-semibold text-neutral-700"
              placeholder="Email address"
              placeholderTextColor="gray"
              keyboardType="email-address"
            />
          </View>

          <View className='gap-3'>

          {/* Password Input */}
          <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl">
            <Ionicons name="lock-closed" size={hp(2.7)} color="gray" />
            <TextInput
             onChangeText={value => passwordRef.current = value }
              style={{ fontSize: hp(2) }}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
            />
          </View>
            {/* Forgot Password Link */}
            <View className="flex-row justify-start ms-4">
                                <TouchableOpacity onPress={handlePasswordReset} disabled={resetLoading}>
                                    <Text style={{ fontSize: hp(1.8) }} className="text-indigo-500 font-bold">
                                        {resetLoading ? "Sending..." : "Forgot Password?"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
  
  <View>
  {loading ? (
  <View className='flex-row justify-center'>
    <Loading size={hp(6)} />
  </View>
  ) : (
    <TouchableOpacity 
      onPress={handleLogin}
      style={{ height: hp(6.5) }}
      className="bg-indigo-500 rounded-xl justify-center items-center"
    > 
      <Text style={{ fontSize: hp(2.5) }} className="text-white font-bold">
        Sign In
      </Text>
    </TouchableOpacity>
  )}
</View>

         

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text style={{ fontSize: hp(1.8) }} className="text-neutral-500">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity> 
                <Pressable onPress={() => router.push('/signUp')}>

              <Text style={{ fontSize: hp(1.8) }} className="text-indigo-500 font-bold">
                Sign Up
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