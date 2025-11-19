import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';

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
// Types
export interface Video {
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
// Video Card Component
interface VideoCardProps {
  item: Video;
  onPress: (video: Video) => void;
}

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

export default VideoCard;
