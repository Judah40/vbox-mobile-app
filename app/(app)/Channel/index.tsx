import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

// Sample data for always-live channels
const LIVE_CHANNELS = [
  {
    id: '1',
    name: 'Culinary Network',
    category: 'Cooking',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 358700,
    description: '24/7 cooking masterclasses from world-renowned chefs',
    isVerified: true,
    currentlyWatching: 4823,
  },
  {
    id: '2',
    name: 'MusicVerse',
    category: 'Music',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 892300,
    description: 'Non-stop music from around the globe, live performances 24/7',
    isVerified: true,
    currentlyWatching: 12694,
  },
  {
    id: '3',
    name: 'GamersHub',
    category: 'Gaming',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 1245000,
    description: 'Round-the-clock gaming content from top streamers',
    isVerified: true,
    currentlyWatching: 31527,
  },
  {
    id: '4',
    name: 'FitLife',
    category: 'Fitness',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 426500,
    description: 'Live workouts and fitness classes streaming all day',
    isVerified: false,
    currentlyWatching: 2853,
  },
  {
    id: '5',
    name: 'TechTalk',
    category: 'Technology',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 739800,
    description: 'Latest tech news, reviews and tutorials streaming 24/7',
    isVerified: true,
    currentlyWatching: 5691,
  },
  {
    id: '6',
    name: 'ArtStudio',
    category: 'Art',
    logo: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500',
    followers: 287400,
    description: 'Watch artists create masterpieces in real-time',
    isVerified: false,
    currentlyWatching: 1873,
  },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const LiveChannelsList = () => {
  const renderChannelItem = ({ item }: any) => (
    <TouchableOpacity className="mb-6 overflow-hidden rounded-xl bg-gray-800 shadow-lg">
      {/* Cover Image */}
      <View className="relative">
        <Image source={{ uri: item.coverImage }} className="h-32 w-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-red-600 px-2 py-1">
          <View className="mr-1 h-2 w-2 rounded-full bg-white" />
          <Text className="text-xs font-bold text-white">24/7</Text>
        </View>
        <View className="absolute bottom-3 right-3 flex-row items-center rounded-md bg-black bg-opacity-70 px-2 py-1">
          <Feather name="eye" size={12} color="#FFFFFF" />
          <Text className="ml-1 text-xs font-medium text-white">
            {formatNumber(item.currentlyWatching)} watching
          </Text>
        </View>
      </View>

      {/* Channel Info */}
      <View className="p-4">
        {/* Channel Header */}
        <View className="flex-row">
          <Image
            source={{ uri: item.logo }}
            className="h-14 w-14 rounded-full border-2 border-gray-700"
          />
          <View className="ml-3 flex-1 justify-center">
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-white">{item.name}</Text>
              {item.isVerified && (
                <View className="ml-2 h-4 w-4 items-center justify-center rounded-full bg-yellow-500">
                  <Feather name="check" size={12} color="#000" />
                </View>
              )}
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-400">{item.category}</Text>
              <Text className="mx-2 text-gray-500">•</Text>
              <Text className="text-sm text-gray-400">
                {formatNumber(item.followers)} followers
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text className="mt-3 text-sm text-gray-400">{item.description}</Text>

        {/* Action Buttons */}
        <View className="mt-4 flex-row">
          <TouchableOpacity className="mr-2 flex-1 items-center rounded-lg bg-yellow-500 px-4 py-2">
            <Text className="font-bold text-gray-900">Watch</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-center rounded-lg bg-gray-700 px-4 py-2">
            <Feather name="bell" size={16} color="#EAB308" />
            <Text className="ml-1 font-bold text-yellow-500">Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Featured Channels</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="mr-1 text-yellow-500">View All</Text>
          <Feather name="chevron-right" size={18} color="#EAB308" />
        </TouchableOpacity>
      </View>
      <Text className="mt-1 text-gray-400">Always streaming, always live</Text>
    </View>
  );

  return (
    <View className="bg-gray-900 px-4 pb-4 pt-6">
      <FlatList
        data={LIVE_CHANNELS}
        renderItem={renderChannelItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

export default LiveChannelsList;
