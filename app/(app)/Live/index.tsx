import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Sample data - replace with your actual data source
const LIVE_STREAMS = [
  {
    id: '1',
    title: 'Cooking Masterclass: Italian Pasta',
    creator: 'Chef Maria Rossi',
    viewers: 2453,
    image: 'https://via.placeholder.com/300',
    tags: ['Cooking', 'Italian'],
    duration: '45:22'
  },
  {
    id: '2',
    title: 'Late Night Lofi Beats',
    creator: 'Music Mood',
    viewers: 15783,
    image: 'https://via.placeholder.com/300',
    tags: ['Music', 'Lofi'],
    duration: '1:23:45'
  },
  {
    id: '3',
    title: 'NBA Highlights Discussion',
    creator: 'Sports Center',
    viewers: 8921,
    image: 'https://via.placeholder.com/300',
    tags: ['Sports', 'Basketball'],
    duration: '32:10'
  },
  {
    id: '4',
    title: 'Learn React Native in 2025',
    creator: 'Code Masters',
    viewers: 3542,
    image: 'https://via.placeholder.com/300',
    tags: ['Programming', 'Tutorial'],
    duration: '52:17'
  },
  {
    id: '5',
    title: 'Urban Photography Tips',
    creator: 'Visual Arts',
    viewers: 1896,
    image: 'https://via.placeholder.com/300',
    tags: ['Photography', 'Tutorial'],
    duration: '28:45'
  },
  {
    id: '6',
    title: 'Friday Game Night: Elden Ring',
    creator: 'GameStream',
    viewers: 12483,
    image: 'https://via.placeholder.com/300',
    tags: ['Gaming', 'RPG'],
    duration: '2:15:33'
  },
];

const LiveStreamsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredStreams, setFilteredStreams] = useState(LIVE_STREAMS);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = LIVE_STREAMS.filter(stream => 
        stream.title.toLowerCase().includes(text.toLowerCase()) ||
        stream.creator.toLowerCase().includes(text.toLowerCase()) ||
        stream.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredStreams(filtered);
      setIsLoading(false);
    }, 300);
  };

  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-gray-800 mb-4 rounded-xl overflow-hidden shadow-lg">
      <View className="relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-3 left-3 bg-red-600 px-2 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-white mr-1" />
          <Text className="text-white font-bold text-xs">LIVE</Text>
        </View>
        <View className="absolute bottom-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded-md flex-row items-center">
          <Feather name="eye" size={12} color="#FFFFFF" />
          <Text className="text-white font-medium text-xs ml-1">{formatViewerCount(item.viewers)}</Text>
        </View>
        <View className="absolute bottom-3 left-3 bg-black bg-opacity-70 px-2 py-1 rounded-md">
          <Text className="text-white font-medium text-xs">{item.duration}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-xl font-bold text-white">{item.title}</Text>
        <Text className="text-gray-400">{item.creator}</Text>
        <View className="flex-row flex-wrap mt-3">
          {item.tags.map((tag, index) => (
            <View 
              key={index} 
              className="bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-xs text-yellow-500">{tag}</Text>
            </View>
          ))}
        </View>
        <View className="flex-row justify-end items-center mt-2">
          <TouchableOpacity 
            className="bg-yellow-500 rounded-lg px-4 py-2"
          >
            <Text className="text-gray-900 font-bold">Watch Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Feather name="video-off" size={48} color="#9CA3AF" />
      <Text className="text-gray-400 mt-4 text-center font-medium">
        No live streams found matching "{searchQuery}"
      </Text>
      <TouchableOpacity 
        className="mt-4 px-4 py-2 bg-yellow-500 rounded-lg"
        onPress={() => setSearchQuery('')}
      >
        <Text className="text-gray-900 font-medium">Clear Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-4">
        <Text className="text-2xl font-bold text-white mb-3">Live Now</Text>
        <View className="flex-row items-center bg-gray-700 rounded-full px-4 py-2">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-white"
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
            <Text className="text-gray-400 mt-4">Finding streams...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStreams}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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