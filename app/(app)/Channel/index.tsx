import { JSX, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { getAllChannel } from '~/app/api/videos/api';

// Define types
interface Channel {
  channelId: string;
  channelLogo: string;
  channelName: string;
  lastBroadcast: string | null;
  gradient: [string, string];
}

type ChannelCardProps = {
  item: Channel;
  index: number;
  isSelected: boolean;
  onPress: (channelId: string) => void;
};

// Gold color theme
const GOLD_COLORS = {
  primary: '#d4af37',
  secondary: '#b8941f',
  light: '#f4e4a6',
  dark: '#8b6914',
  gradient: ['#d4af37', '#b8941f'] as [string, string],
  gradientLight: ['#f4e4a6', '#d4af37'] as [string, string],
};

// Skeleton Loader Component
const SkeletonCard: React.FC = () => {
  return (
    <View className="mx-5 mb-4">
      <View className="overflow-hidden rounded-3xl bg-[#1A1A1A] p-5">
        <View className="flex-row items-center">
          {/* Skeleton Logo */}
          <View className="h-20 w-20 rounded-xl bg-[#2A2A2A]" />

          {/* Skeleton Info */}
          <View className="ml-4 flex-1">
            <View className="mb-2 h-6 w-3/4 rounded bg-[#2A2A2A]" />
            <View className="h-4 w-1/2 rounded bg-[#2A2A2A]" />
          </View>

          {/* Skeleton Button */}
          <View className="h-14 w-14 rounded-full bg-[#2A2A2A]" />
        </View>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center px-5 py-20">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-[#1A1A1A]">
        <Feather name="radio" size={48} color="#666" />
      </View>
      <Text className="mb-2 text-2xl font-bold text-white">No Channels Available</Text>
      <Text className="text-center text-base text-gray-400">
        There are currently no channels to display. Please check back later.
      </Text>
    </View>
  );
};

const ChannelCard: React.FC<ChannelCardProps> = ({ item, index, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item.channelId)}
      className="mx-5 mb-4"
      style={{
        transform: [{ scale: isSelected ? 1.02 : 1 }],
      }}>
      <LinearGradient
        colors={GOLD_COLORS.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-[2px]">
        <View
          className={`overflow-hidden rounded-3xl bg-[#0A0A0A] ${isSelected ? 'opacity-100' : 'opacity-95'}`}>
          <View className="flex-row items-center p-5">
            {/* Channel Logo */}
            <View className="relative">
              <LinearGradient colors={GOLD_COLORS.gradient} className="rounded-2xl p-[2px]">
                <View className="rounded-2xl bg-[#0A0A0A] p-1">
                  <Image
                    source={{ uri: item.channelLogo && item.channelLogo }}
                    className="h-20 w-20 rounded-xl"
                    resizeMode="cover"
                  />
                </View>
              </LinearGradient>

              {/* Live Indicator */}
              {item.lastBroadcast && (
                <View className="absolute -right-2 -top-2 flex-row items-center rounded-full bg-red-500 px-2 py-1">
                  <View className="mr-1 h-1.5 w-1.5 rounded-full bg-white" />
                  <Text className="text-[10px] font-bold text-white">LIVE</Text>
                </View>
              )}
            </View>

            {/* Channel Info */}
            <View className="ml-4 flex-1">
              <Text className="mb-1 text-xl font-bold text-white">
                {item.channelName && item.channelName}
              </Text>
              <View className="flex-row items-center">
                <Feather name="radio" size={14} color="#888" />
                <Text className="ml-1.5 text-sm text-gray-400">
                  {item.lastBroadcast ? 'Broadcasting now' : 'Ready to stream'}
                </Text>
              </View>
            </View>

            {/* Play Button */}
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: isSelected ? GOLD_COLORS.primary : 'rgba(255,255,255,0.1)',
              }}>
              <AntDesign name="play-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Accent */}
          <LinearGradient
            colors={[...GOLD_COLORS.gradientLight, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-1 w-full opacity-60"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function ChannelListScreen(): JSX.Element {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleChannelPress = (channelId: string): void => {
    // setSelectedChannel(channelId);
    Alert.alert('Unavailable', `Channel ${channelId} is currently unavailable`);
  };

  const renderChannelCard = ({ item, index }: { item: Channel; index: number }): JSX.Element => {
    const isSelected: boolean = selectedChannel === item.channelId;

    return (
      <ChannelCard item={item} index={index} isSelected={isSelected} onPress={handleChannelPress} />
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getAllChannel()
      .then((response) => {
        setChannelList(response.data.data);
      })
      .catch((error) => {
        console.log('Error fetching channels:', error.response?.data || error.message);
        setChannelList([]); // Set empty array on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0)']} className="px-5 pb-6 pt-14">
        <Text className="mb-2 text-4xl font-bold text-white">Channels</Text>
        <Text className="text-base text-gray-400">
          {isLoading ? 'Loading channels...' : `${channelList.length} channels available`}
        </Text>
      </LinearGradient>

      {/* Content */}
      {isLoading ? (
        // Skeleton Loader
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => `skeleton-${item}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 30,
          }}
        />
      ) : channelList.length === 0 ? (
        // Empty State
        <EmptyState />
      ) : (
        // Channel List
        <FlatList
          data={channelList}
          renderItem={renderChannelCard}
          keyExtractor={(item: Channel) => item.channelId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 30,
          }}
        />
      )}
    </View>
  );
}
