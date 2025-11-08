import { JSX, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { handleGetAllPosts } from '~/app/api/videos/api';
import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';
const { width } = Dimensions.get('window');

// Types
interface Video {
  id: number;
  postId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  genre: string[];
  location: string;
  isPartOfMyList: boolean;
}

// Color theme
const THEME = {
  primary: '#FF6B00',
  secondary: '#FF8534',
  accent: '#FFB800',
  background: '#000000',
  card: '#0F0F0F',
  cardHover: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#888888',
  border: '#222222',
};

// Format duration to MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format view count
const formatViews = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Skeleton Loader Components
const SearchBarSkeleton: React.FC = () => {
  return (
    <View className="mb-6 flex-row items-center rounded-2xl bg-[#1A1A1A] px-4 py-4">
      <View className="h-5 w-5 rounded-full bg-[#2A2A2A]" />
      <View className="ml-3 h-4 flex-1 rounded bg-[#2A2A2A]" />
    </View>
  );
};

const VideoCardSkeleton: React.FC = () => {
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

// Video Card Component
interface VideoCardProps {
  item: Video;
  onPress: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={() => onPress(item)} className="mb-6">
      {/* Thumbnail */}
      <View className="relative mb-3 overflow-hidden rounded-3xl bg-[#0F0F0F]">
        <Image source={{ uri: item.thumbnailUrl }} className="h-52 w-full" resizeMode="cover" />

        {/* Duration Badge */}
        <View className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1.5">
          <Text className="text-xs font-bold text-white">{formatDuration(item.duration)}</Text>
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute bottom-0 left-0 right-0 h-20"
        />

        {/* Play Button Overlay */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <LinearGradient
              colors={[THEME.primary, THEME.secondary]}
              style={{
                borderRadius: 9999,
              }}
              className="h-14 w-14 items-center justify-center rounded-full">
              <Ionicons
                name="play"
                size={24}
                color="white"
                style={{ marginLeft: 2 }}
                className="rounded-full"
              />
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Video Info */}
      <View className="flex-row px-1">
        {/* Genre Icon */}
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A]">
          <MaterialIcons
            name={
              item.genre.includes('Music')
                ? 'music-note'
                : item.genre.includes('sports')
                  ? 'sports-soccer'
                  : 'theater-comedy'
            }
            size={20}
            color={THEME.secondary}
          />
        </View>

        {/* Details */}
        <View className="flex-1">
          <Text className="mb-1 text-base font-bold text-white" numberOfLines={2}>
            {item.title}
          </Text>

          <View className="mb-1.5 flex-row items-center">
            <Text className="text-sm text-gray-400">{formatViews(item.viewCount)} views</Text>
            <View className="mx-2 h-1 w-1 rounded-full bg-gray-600" />
            <Text className="text-sm text-gray-400">{item.genre[0]}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text className="ml-1 text-xs text-gray-500">{item.location}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="items-end justify-start">
          <TouchableOpacity className="mb-2 h-8 w-8 items-center justify-center">
            <Ionicons
              name={item.isPartOfMyList ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={item.isPartOfMyList ? THEME.primary : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity className="h-8 w-8 items-center justify-center">
            <Feather name="more-vertical" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <View className="items-center justify-center px-5 py-20">
      <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-[#1A1A1A]">
        <MaterialIcons name="video-library" size={64} color="#333" />
      </View>
      <Text className="mb-2 text-2xl font-bold text-white">No Videos Found</Text>
      <Text className="text-center text-base text-gray-400">
        We couldn't find any videos matching your search. Try adjusting your filters.
      </Text>
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
          console.log(response.posts);
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
      ) : filteredVideos.length === 0 ? (
        // Empty State
        <EmptyState />
      ) : (
        // Video List
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
      )}
    </View>
  );
}
