import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';

// Sample data - replace with your actual data source
const LIVE_STREAMS = [
  {
    id: '1',
    title: 'Cooking Masterclass: Italian Pasta',
    creator: 'Chef Maria Rossi',
    viewers: 2453,
    image: 'https://via.placeholder.com/300',
    tags: ['Cooking', 'Italian'],
    duration: '45:22',
  },
  {
    id: '2',
    title: 'Late Night Lofi Beats',
    creator: 'Music Mood',
    viewers: 15783,
    image: 'https://via.placeholder.com/300',
    tags: ['Music', 'Lofi'],
    duration: '1:23:45',
  },
  {
    id: '3',
    title: 'NBA Highlights Discussion',
    creator: 'Sports Center',
    viewers: 8921,
    image: 'https://via.placeholder.com/300',
    tags: ['Sports', 'Basketball'],
    duration: '32:10',
  },
  {
    id: '4',
    title: 'Learn React Native in 2025',
    creator: 'Code Masters',
    viewers: 3542,
    image: 'https://via.placeholder.com/300',
    tags: ['Programming', 'Tutorial'],
    duration: '52:17',
  },
  {
    id: '5',
    title: 'Urban Photography Tips',
    creator: 'Visual Arts',
    viewers: 1896,
    image: 'https://via.placeholder.com/300',
    tags: ['Photography', 'Tutorial'],
    duration: '28:45',
  },
  {
    id: '6',
    title: 'Friday Game Night: Elden Ring',
    creator: 'GameStream',
    viewers: 12483,
    image: 'https://via.placeholder.com/300',
    tags: ['Gaming', 'RPG'],
    duration: '2:15:33',
  },
];

const LiveStreamsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredStreams, setFilteredStreams] = useState(LIVE_STREAMS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = LIVE_STREAMS.filter(
        (stream) =>
          stream.title.toLowerCase().includes(text.toLowerCase()) ||
          stream.creator.toLowerCase().includes(text.toLowerCase()) ||
          stream.tags.some((tag) => tag.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredStreams(filtered);
      setIsLoading(false);
    }, 300);
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity className="mb-4 overflow-hidden rounded-xl bg-gray-800 shadow-lg">
      <View className="relative">
        <Image source={{ uri: item.image }} className="h-48 w-full" resizeMode="cover" />
        <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-red-600 px-2 py-1">
          <View className="mr-1 h-2 w-2 rounded-full bg-white" />
          <Text className="text-xs font-bold text-white">LIVE</Text>
        </View>
        <View className="absolute bottom-3 right-3 flex-row items-center rounded-md bg-black bg-opacity-70 px-2 py-1">
          <Feather name="eye" size={12} color="#FFFFFF" />
          <Text className="ml-1 text-xs font-medium text-white">
            {formatViewerCount(item.viewers)}
          </Text>
        </View>
        <View className="absolute bottom-3 left-3 rounded-md bg-black bg-opacity-70 px-2 py-1">
          <Text className="text-xs font-medium text-white">{item.duration}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-xl font-bold text-white">{item.title}</Text>
        <Text className="text-gray-400">{item.creator}</Text>
        <View className="mt-3 flex-row flex-wrap">
          {item.tags.map((tag: any, index: number) => (
            <View key={index} className="mb-2 mr-2 rounded-full bg-gray-700 px-3 py-1">
              <Text className="text-xs text-yellow-500">{tag}</Text>
            </View>
          ))}
        </View>
        <View className="mt-2 flex-row items-center justify-end">
          <TouchableOpacity className="rounded-lg bg-yellow-500 px-4 py-2">
            <Text className="font-bold text-gray-900">Watch Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Feather name="video-off" size={48} color="#9CA3AF" />
      <Text className="mt-4 text-center font-medium text-gray-400">
        No live streams found matching "{searchQuery}"
      </Text>
      <TouchableOpacity
        className="mt-4 rounded-lg bg-yellow-500 px-4 py-2"
        onPress={() => setSearchQuery('')}>
        <Text className="font-medium text-gray-900">Clear Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 px-4 pb-4 pt-12">
        <Text className="mb-3 text-2xl font-bold text-white">Live Now</Text>
        <View className="flex-row items-center rounded-full bg-gray-700 px-4 py-2">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="ml-2 flex-1 text-base text-white"
            placeholder="Search streams, creators, or categories..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#EAB308" />
            <Text className="mt-4 text-gray-400">Finding streams...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStreams}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}
      </View>
    </View>
  );
};

export default LiveStreamsList;
