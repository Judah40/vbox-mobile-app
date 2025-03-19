import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export interface MediaItem {
  id: number;
  postId: string;
  userId: number;
  content: string;
  thumbnailUrl: string;
  bannerUrl: string;
  caption: string;
  location: string;
}

interface SearchListRenderProps {
  data: MediaItem[];
  onCardPress?: (item: MediaItem) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

const SearchListRender: React.FC<SearchListRenderProps> = ({ data, onCardPress }) => {
  const renderCard = ({ item }: { item: MediaItem }) => {
    return (
      <TouchableOpacity 
        onPress={() => onCardPress && onCardPress(item)}
        activeOpacity={0.9}
        className="w-full"
      >
        <View className="mx-4 my-3 rounded-2xl overflow-hidden bg-gray-800 shadow">
          <Image 
            source={{ uri: item.bannerUrl || item.thumbnailUrl }} 
            className="w-full h-48"
            resizeMode="cover"
          />
          
          <View className="p-4">
            {/* Caption - Main title */}
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.caption}</Text>
            
            {/* User ID indicator */}
            <View className="flex-row items-center mt-2">
              <View className="h-6 w-6 rounded-full bg-indigo-100 items-center justify-center mr-2">
                <Text className="text-xs text-indigo-600 font-medium">#{item.userId}</Text>
              </View>
              
              {/* Post ID */}
              <Text className="text-xs text-gray-500">Post ID: {item.postId.substring(0, 8)}</Text>
              <View className='flex-1 items-end'>
              <FontAwesome name="play-circle" size={24} color="red" />
                </View>
            </View>
            
            {/* Content preview */}
            <Text className="text-sm text-gray-400 mt-2 mb-3" numberOfLines={2}>
              {item.content}
            </Text>
            
            {/* Bottom row with location */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-500">📍</Text>
                <Text className="text-xs font-medium text-yellow-500 ml-1">{item.location}</Text>
              </View>
              
              {/* Visual indicator of ID */}
              <View className="bg-gray-100 px-2 py-1 rounded-md">
                <Text className="text-xs text-gray-600">ID: {item.id}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.postId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </View>
  );
};

export default SearchListRender;