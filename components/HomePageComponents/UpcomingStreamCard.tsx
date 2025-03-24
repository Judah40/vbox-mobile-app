import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

interface UpcomingStreamProps {
  title?: string;
  date?: string;
  time?: string;
  gameName?: string;
  hostName?: string;
  thumbnailUrl?: string;
  onPress?: () => void;
}

const UpcomingStreamCard: React.FC<UpcomingStreamProps> = ({
  title = "WEEKEND TOURNAMENT FINALS",
  date = "SAT, MAR 29",
  time = "8:00 PM",
  gameName = "Fortnite",
  hostName = "GamerPro99",
  thumbnailUrl = "https://example.com/stream-thumbnail.jpg",
  onPress,
}) => {
  return (
    <View className="flex-1">
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.9}
        className="bg-red-500 rounded-2xl shadow-2xl">
        <ImageBackground
          source={{ uri: thumbnailUrl }}
          defaultSource={require('~/assets/backgrounds/bg.jpg')} // Fallback image
          className="h-56 w-full overflow-hidden"
          imageStyle={{ opacity: 0.85 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
            className="h-full w-full"
          >
            {/* Top notification badge */}
            <View className="absolute top-4 left-4 flex-row items-center rounded-full bg-red-600 px-3 py-1.5">
              <View className="mr-2 h-2 w-2 rounded-full bg-white" />
              <Text className="text-xs font-bold text-white">UPCOMING</Text>
            </View>
            
            {/* Game title badge */}
            <View className="absolute top-4 right-4 flex-row items-center rounded-full bg-gray-800/80 px-3 py-1.5">
              <FontAwesome5 name="gamepad" size={12} color="#FFD700" className="mr-1" />
              <Text className="ml-1 text-xs font-medium text-gray-100">{gameName}</Text>
            </View>
            
            {/* Content */}
            <View className="absolute bottom-0 w-full p-4">
              {/* Stream title */}
              <Text className="mb-2 text-xl font-bold text-white shadow-sm">{title}</Text>
              
              {/* Date and time */}
              <View className="mb-4 flex-row items-center">
                <View className="mr-3 flex-row items-center">
                  <FontAwesome5 name="calendar-alt" size={12} color="#FFD700" className="mr-1" />
                  <Text className="ml-1 text-sm text-gray-100">{date}</Text>
                </View>
                <View className="flex-row items-center">
                  <FontAwesome5 name="clock" size={12} color="#FFD700" className="mr-1" />
                  <Text className="ml-1 text-sm text-gray-100">{time}</Text>
                </View>
              </View>
              
              {/* Host info and action button */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="h-8 w-8 rounded-full bg-gray-600" />
                  <View className="ml-2">
                    <Text className="text-xs text-gray-300">Hosted by</Text>
                    <Text className="text-sm font-medium text-white">{hostName}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  className="flex-row items-center rounded-full bg-yellow-500 px-4 py-2"
                  onPress={() => {/* Handle reminder */}}
                >
                  <Ionicons name="notifications" size={14} color="#000" />
                  <Text className="ml-1 text-xs font-bold text-gray-900">SET REMINDER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default UpcomingStreamCard;