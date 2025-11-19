import { JSX, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { handleGetAllPosts } from '~/app/api/videos/api';
import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';
import VideoCard, { Video } from '~/components/VideoCard';
import EmptyState from '~/components/EmptyVideo';

// Skeleton Loader Components
const SearchBarSkeleton: React.FC = () => {
  return (
    <View className="mb-6 flex-row items-center rounded-2xl bg-[#1A1A1A] px-4 py-4">
      <View className="h-5 w-5 rounded-full bg-[#2A2A2A]" />
      <View className="ml-3 h-4 flex-1 rounded bg-[#2A2A2A]" />
    </View>
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <View className="mb-6">
      {/* Thumbnail Skeleton */}
      <View className="relative mb-3 h-52 w-full overflow-hidden rounded-3xl bg-[#1A1A1A]">
        <View className="absolute right-3 top-3 h-8 w-16 rounded-lg bg-[#2A2A2A]" />
      </View>

      {/* Info Skeleton */}
      <View className="flex-row">
        <View className="mr-3 h-10 w-10 rounded-full bg-[#1A1A1A]" />
        <View className="flex-1">
          <View className="mb-2 h-5 w-3/4 rounded bg-[#1A1A1A]" />
          <View className="mb-2 h-4 w-1/2 rounded bg-[#1A1A1A]" />
          <View className="h-3 w-2/3 rounded bg-[#1A1A1A]" />
        </View>
      </View>
    </View>
  );
};

// Main Component
export default function VideoScreen(): JSX.Element {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulate API call
  useEffect(() => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      // Replace this with your actual API call
      handleGetAllPosts()
        .then((response) => {
          const data = response?.posts || [];
          setVideos(data);
          setFilteredVideos(data);
        })
        .catch((err) => {
          console.error(err);
        });

      // Mock data for demonstration
      // setVideos([]);
      // setFilteredVideos([]);
      setIsLoading(false);
    }, 2000);
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  const { openSheetWithId } = useBottomSheet();
  const handleVideoPress = (video: Video): void => {
    openSheetWithId(video.postId);
    // Navigate to video player
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0)']} className="px-5 pb-4 pt-14">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-4xl font-bold text-white">Discover</Text>
            <Text className="text-base text-gray-400">
              {isLoading ? 'Loading...' : `${filteredVideos.length} videos available`}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        {isLoading ? (
          <SearchBarSkeleton />
        ) : (
          <View className="flex-row items-center rounded-2xl bg-[#1A1A1A] px-4 py-2">
            <Feather name="search" size={20} color="#666" />
            <TextInput
              className="ml-3 flex-1 py-2 text-base text-white"
              placeholder="Search videos, genres, or locations..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>

      {/* Content */}
      {isLoading ? (
        // Skeleton Loader
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <VideoCardSkeleton />}
          keyExtractor={(item) => `skeleton-${item}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
          }}
        />
      ) : filteredVideos.length > 0 ? (
        <FlatList
          data={filteredVideos}
          renderItem={({ item }) => <VideoCard item={item} onPress={handleVideoPress} />}
          keyExtractor={(item) => item.postId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
          }}
        />
      ) : (
        // Empty State
        // Video List

        <EmptyState />
      )}
    </View>
  );
}
