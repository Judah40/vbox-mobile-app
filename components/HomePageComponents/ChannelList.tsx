import { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Channel {
  channelId: string;
  channelLogo: string;
  channelName: string;
  lastBroadcast: string | null;
}

interface ChannelListProps {
  channels: Channel[];
  onChannelPress?: (channel: Channel) => void;
  isLoading?: boolean;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  onChannelPress,
  isLoading = false,
}) => {
  // Skeleton Loader Component
  const SkeletonCard: React.FC = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View className="mr-4 items-center">
        <Animated.View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            marginBottom: 8,
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: 80,
            height: 16,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity,
          }}
        />
      </View>
    );
  };

  // Empty State Component
  const EmptyState: React.FC = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
        <Text style={{ fontSize: 48, color: '#d4af37' }}>📺</Text>
      </View>
      <Text className="mb-2 text-xl font-bold text-white">No Channels Available</Text>
      <Text className="text-center text-gray-400" style={{ fontSize: 14, lineHeight: 20 }}>
        There are no channels to display at the moment. Please check back later.
      </Text>
    </View>
  );

  // Channel Card Component
  const ChannelCard: React.FC<{ item: Channel }> = ({ item }) => {
    const isLive = item.lastBroadcast !== null;

    return (
      <TouchableOpacity onPress={() => onChannelPress?.(item)} className="mr-4" activeOpacity={0.8}>
        <View className="items-center">
          {/* Channel Logo Container */}
          <View className="relative mb-2">
            <View
              className="overflow-hidden rounded-full"
              style={{
                width: 80,
                height: 80,
                borderWidth: 3,
                borderColor: isLive ? '#d4af37' : 'rgba(255,255,255,0.2)',
              }}>
              <Image
                source={{ uri: item.channelLogo }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>

            {/* Live Indicator */}
            {isLive && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#ff4458',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#000',
                }}>
                <Text className="text-xs font-bold text-white">LIVE</Text>
              </View>
            )}
          </View>

          {/* Channel Name */}
          <Text
            className="text-center font-semibold text-white"
            numberOfLines={1}
            style={{ width: 80, fontSize: 13 }}>
            {item.channelName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      {/* Section Header */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <View
            style={{
              width: 4,
              height: 24,
              backgroundColor: '#d4af37',
              borderRadius: 2,
              marginRight: 12,
            }}
          />
          <Text className="text-2xl font-bold text-white">Channels</Text>
        </View>
        {!isLoading && channels.length > 0 && (
          <TouchableOpacity>
            <Text className="text-sm font-semibold" style={{ color: '#d4af37' }}>
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : channels.length === 0 ? (
        /* Empty State */
        <EmptyState />
      ) : (
        /* Channel List */
        <FlatList
          data={channels}
          renderItem={({ item }) => <ChannelCard item={item} />}
          keyExtractor={(item) => item.channelId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
};

export default ChannelList;
