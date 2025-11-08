import { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';
// import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';

const { width: screenWidth } = Dimensions.get('window');

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
  viewCount: number;
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
    viewCount: number;
  }>;
};

interface EntertainmentAppProps {
  data: Data;
  isLoading?: boolean;
}

const EntertainmentApp: React.FC<EntertainmentAppProps> = ({ data, isLoading = false }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Skeleton Components
  const SkeletonBanner: React.FC = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <View className="mb-6 px-4">
        <Animated.View
          style={{
            height: 220,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            opacity,
          }}
        />
      </View>
    );
  };

  const SkeletonCard: React.FC = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <View style={{ marginRight: 16, width: 160 }}>
        <Animated.View
          style={{
            width: 160,
            height: 240,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            opacity,
          }}
        />
      </View>
    );
  };

  const SkeletonCategoryRow: React.FC = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <View className="mb-8">
        <View className="mb-4 flex-row items-center px-4">
          <Animated.View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              marginRight: 12,
              opacity,
            }}
          />
          <Animated.View
            style={{
              width: 120,
              height: 24,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              opacity,
            }}
          />
        </View>
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    );
  };

  // Empty State Component
  const EmptyState: React.FC = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
        <Ionicons name="film-outline" size={60} color="#d4af37" />
      </View>
      <Text className="mb-3 text-2xl font-bold text-white">No Content Available</Text>
      <Text
        className="text-center text-gray-400"
        style={{ fontSize: 15, lineHeight: 22, maxWidth: 280 }}>
        There's no entertainment content to display right now. Check back soon for exciting new
        content!
      </Text>
    </View>
  );

  const MediaCard: React.FC<{ item: MediaItem; index: number }> = ({ item, index }) => {
    const router = useRouter();
    const scaleAnim = new Animated.Value(1);
    const { openSheetWithId } = useBottomSheet();
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          marginRight: 16,
          width: 160,
        }}>
        <TouchableOpacity
          onPress={() => {
            openSheetWithId(item.postId);
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}>
          <View className="overflow-hidden rounded-2xl">
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={{ width: 160, height: 240 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 12,
              }}>
              <Text
                className="mb-1 font-bold text-white"
                numberOfLines={2}
                style={{ fontSize: 14, lineHeight: 18 }}>
                {item.caption}
              </Text>
              <View className="mb-2 flex-row items-center">
                <Ionicons name="location-outline" size={12} color="#d4af37" />
                <Text
                  className="ml-1 text-gray-300"
                  numberOfLines={1}
                  style={{ fontSize: 11, flex: 1 }}>
                  {item.location}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="heart" size={14} color="#ff4458" />
                  <Text className="ml-1 font-semibold text-white" style={{ fontSize: 12 }}>
                    {formatNumber(item.likeCount)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="eye" size={13} color="#d4af37" />
                  <Text className="ml-1 font-semibold text-white" style={{ fontSize: 12 }}>
                    {formatNumber(item.viewCount)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const FeaturedBanner: React.FC = () => {
    const router = useRouter();
    const featuredItem = data[Object.keys(data)[0]]?.[0];

    if (!featuredItem) return null;

    return (
      <View className="mb-6 px-4">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/Player',
              params: { url: featuredItem.id },
            });
          }}
          activeOpacity={0.95}>
          <View className="overflow-hidden rounded-3xl" style={{ height: 220 }}>
            <Image
              source={{ uri: featuredItem.bannerUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 140,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: '#d4af37',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
              <Text className="text-xs font-bold" style={{ color: '#000' }}>
                FEATURED
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 20,
              }}>
              <Text
                className="mb-2 font-bold text-white"
                numberOfLines={2}
                style={{ fontSize: 22, lineHeight: 28 }}>
                {featuredItem.caption}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={14} color="#d4af37" />
                  <Text className="ml-1 text-sm text-gray-200">{featuredItem.location}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center">
                    <Ionicons name="heart" size={16} color="#ff4458" />
                    <Text className="ml-1 font-semibold text-white">
                      {formatNumber(featuredItem.likeCount)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="eye" size={14} color="#d4af37" />
                    <Text className="ml-1 font-semibold text-white">
                      {formatNumber(featuredItem.viewCount)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const CategoryRow: React.FC<{ title: string; data: MediaItem[] }> = ({ title, data }) => {
    const getCategoryIcon = (category: string) => {
      const icons: { [key: string]: string } = {
        music: 'musical-notes',
        movies: 'film',
        sports: 'basketball',
        news: 'newspaper',
        comedy: 'happy',
        documentary: 'videocam',
        drama: 'theater',
        action: 'flash',
      };
      return icons[category.toLowerCase()] || 'play-circle';
    };

    return (
      <View className="mb-8">
        <View className="mb-4 flex-row items-center justify-between px-4">
          <View className="flex-row items-center">
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Ionicons name={getCategoryIcon(title) as any} size={20} color="#d4af37" />
            </View>
            <Text className="text-2xl font-bold capitalize text-white">{title}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setActiveCategory(title)}
            className="flex-row items-center">
            <Text className="mr-1 text-sm font-semibold" style={{ color: '#d4af37' }}>
              See All
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#d4af37" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => <MediaCard item={item} index={index} />}
          keyExtractor={(item) => item.postId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <View className="flex-1 bg-black">
        <View style={{ paddingVertical: 16 }}>
          <SkeletonBanner />
          <SkeletonCategoryRow />
          <SkeletonCategoryRow />
          <SkeletonCategoryRow />
        </View>
      </View>
    );
  }

  // Empty State
  const hasData = data && Object.keys(data).length > 0;
  if (!hasData) {
    return (
      <View className="flex-1 bg-black">
        <EmptyState />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={Object.entries(data)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, items] }) => <CategoryRow title={category} data={items} />}
        ListHeaderComponent={<FeaturedBanner />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default EntertainmentApp;
