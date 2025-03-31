// import { View, Text, ActivityIndicator } from 'react-native';
// import React from 'react';

// export default function StartPage() {
//   return (
//     <View className="flex-1 justify-center items-center">
//       <ActivityIndicator size="large" color="gray" />
//     </View>
//   );
// }


import { View, Image, ActivityIndicator } from 'react-native';
import React from 'react';

export default function StartPage() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Starter Image */}
      <Image 
        source={require('../assets/images/download.jpeg')}  // Replace with your image path
        className="w-40 h-40 mb-4"  // Adjust size as needed
        resizeMode="contain"
      />
      {/* Loading Indicator */}
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}
