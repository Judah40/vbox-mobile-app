import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define types for the data
interface MediaItem {
  id: number;
  caption: string;
  content: string;
  location: string;
  thumbnailUrl: string;
  bannerUrl: string;
  likeCount: number;
  commentCount: number;
  postId: string;
}

type Data = {
  [tag: string]: Array<{
    id: number;
    postId: string;
    content: string;
    thumbnailUrl: string;
    bannerUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
    location: string;
  }>;
};

interface EntertainmentAppProps {
  data: Data;
}
const EntertainmentApp: React.FC<EntertainmentAppProps> = ({ data }) => {
  // Handler for search
  const handleSearch = (text: string): void => {
    console.log('Searching for:', text);
    // Implement search logic here
  };

  // Media item component
  const MediaCard: React.FC<{ item: MediaItem }> = ({ item }) => {
    const router = useRouter();

    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item);
          router.push({
            pathname: '/Player/',
            params: { url: item.id },
          });
        }}
        className="mr-4 w-40 overflow-hidden rounded-lg"
        activeOpacity={0.9}>
        <View className="overflow-hidden rounded-lg bg-gray-900 shadow-lg">
          <Image
            source={{ uri: item.bannerUrl }}
            className="h-56 w-40 rounded-t-lg"
            resizeMode="cover"
          />
          <View className="bg-black bg-opacity-80 p-2">
            <Text className="font-semibold text-white" numberOfLines={1}>
              {item.caption}
            </Text>
            <View className="items-left mt-1">
              <Text className="mr-2 text-xs text-gray-400">{item.location}</Text>
              <View className="flex-row items-center">
                <Ionicons name="heart-outline" size={12} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-400">{item.likeCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // Category row component
  const CategoryRow: React.FC<{ title: string; data: MediaItem[] }> = ({ title, data }) => (
    <View className="mb-6">
      <Text className="mb-2 px-4 text-xl font-bold capitalize text-white">{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <MediaCard item={item} />}
        keyExtractor={(item) => item.postId}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4"
      />
    </View>
  );

  return (
    <View className="my-4 flex-1 bg-black">
      {/* Featured Banner */}
      <View className="px-4 pb-4">
        <TouchableOpacity activeOpacity={0.9}>
          <Image
            source={{ uri: data.Music[0].bannerUrl }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black bg-opacity-60 p-3">
            <Text className="text-lg font-bold text-white">{data.Music[0].caption}</Text>
            <Text className="text-xs text-gray-300">{data.Music[0].location}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Render each category */}
      {Object.entries(data).map(([category, items]) => (
        <CategoryRow key={category} title={category} data={items} />
      ))}
    </View>
  );
};

export default EntertainmentApp;
