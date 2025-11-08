import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { FC, useState, useEffect, useRef } from 'react';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export type cardProps = {
  thumbnailUrl: string;
  bannerUrl: string;
  duration: string;
  location: string;
  likeCount: number;
  genre: string[];
  title: string;
  postId: string;
};

const SkeletonLoader: FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={{ height: screenHeight * 0.7, backgroundColor: '#1a1a1a' }}>
      {/* Header Skeleton */}
      <View className="flex-row items-center justify-between p-4">
        <Animated.View
          style={{
            width: 45,
            height: 45,
            backgroundColor: '#2a2a2a',
            borderRadius: 8,
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: 44,
            height: 44,
            backgroundColor: '#2a2a2a',
            borderRadius: 25,
            opacity,
          }}
        />
      </View>

      {/* Content Skeleton */}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}>
        {/* Genre Pills Skeleton */}
        <View className="mb-3 flex-row flex-wrap gap-2">
          {[80, 100, 90].map((width, index) => (
            <Animated.View
              key={index}
              style={{
                width,
                height: 28,
                backgroundColor: '#2a2a2a',
                borderRadius: 20,
                opacity,
              }}
            />
          ))}
        </View>

        {/* Title Skeleton */}
        <View className="mb-4">
          <Animated.View
            style={{
              width: '90%',
              height: 38,
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              marginBottom: 8,
              opacity,
            }}
          />
          <Animated.View
            style={{
              width: '60%',
              height: 38,
              backgroundColor: '#2a2a2a',
              borderRadius: 8,
              opacity,
            }}
          />
        </View>

        {/* Info Row Skeleton */}
        <View className="mb-6 flex-row items-center gap-4">
          {[60, 80, 50].map((width, index) => (
            <Animated.View
              key={index}
              style={{
                width,
                height: 20,
                backgroundColor: '#2a2a2a',
                borderRadius: 10,
                opacity,
              }}
            />
          ))}
        </View>

        {/* Action Buttons Skeleton */}
        <View className="flex-row gap-3">
          <Animated.View
            style={{
              flex: 1,
              height: 56,
              backgroundColor: '#2a2a2a',
              borderRadius: 12,
              opacity,
            }}
          />
          <Animated.View
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#2a2a2a',
              borderRadius: 12,
              opacity,
            }}
          />
          <Animated.View
            style={{
              width: 56,
              height: 56,
              backgroundColor: '#2a2a2a',
              borderRadius: 12,
              opacity,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const HomeMainCard: FC<cardProps> = (props) => {
  const {
    thumbnailUrl,
    bannerUrl,
    duration = '',
    location = '',
    likeCount = 0,
    genre = [],
    title = '',
    postId,
  } = props;

  const [imageLoaded, setImageLoaded] = useState(false);

  const formatLikes = (count: number) => {
    if (!count && count !== 0) return '0';

    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const backgroundSource = bannerUrl ? { uri: bannerUrl } : null;

  if (!imageLoaded) {
    return (
      <>
        <SkeletonLoader />
        {backgroundSource && (
          <Image
            source={backgroundSource}
            style={{ width: 0, height: 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        )}
      </>
    );
  }

  return (
    <View style={{ height: screenHeight * 0.7 }}>
      <ImageBackground
        source={backgroundSource!}
        style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
        resizeMode="cover">
        {/* Top Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 150, zIndex: 1 }}
        />

        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)', '#000000']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 400, zIndex: 1 }}
        />

        {/* Header */}
        <View className="flex-row items-center justify-between p-4" style={{ zIndex: 2 }}>
          <Image
            source={require('../../assets/vbox.png')}
            style={{
              width: 45,
              height: 45,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />

          <View className="flex-row gap-2">
            <Link href={'/(app)/Home/searchModal'} asChild>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: 10,
                  borderRadius: 25,
                  backdropFilter: 'blur(10px)',
                }}>
                <FontAwesome name="bell" size={22} color="white" />
              </TouchableOpacity>
            </Link>
            <Link href={'/(app)/Home/searchModal'} asChild>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: 10,
                  borderRadius: 25,
                  backdropFilter: 'blur(10px)',
                }}>
                <FontAwesome name="search" size={22} color="white" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Content Container */}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            zIndex: 2,
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}>
          {/* Genre Pills */}
          <View className="mb-3 flex-row flex-wrap gap-2">
            {genre &&
              genre.map((g, index) =>
                g ? (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.3)',
                      borderWidth: 1,
                      borderColor: '#d4af37',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}>
                    <Text className="text-xs font-semibold text-white">{g}</Text>
                  </View>
                ) : null
              )}
          </View>

          {/* Title */}
          <Text
            className="mb-4 font-bold text-white"
            style={{
              fontSize: 32,
              lineHeight: 38,
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              letterSpacing: 0.5,
            }}>
            {title || 'Untitled'}
          </Text>

          {/* Info Row */}
          <View className="mb-6 flex-row items-center gap-4">
            {/* Duration */}
            <View className="flex-row items-center gap-1.5">
              <FontAwesome name="clock-o" size={16} color="#d4af37" />
              <Text className="text-sm font-medium text-gray-300">{duration || 'Unknown'}</Text>
            </View>

            {/* Separator */}
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#d4af37' }} />

            {/* Location */}
            <View className="flex-row items-center gap-1.5">
              <FontAwesome name="map-marker" size={16} color="#d4af37" />
              <Text className="text-sm font-medium text-gray-300">{location || 'Unknown'}</Text>
            </View>

            {/* Separator */}
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#d4af37' }} />

            {/* Likes */}
            <View className="flex-row items-center gap-1.5">
              <FontAwesome name="heart" size={14} color="#d4af37" />
              <Text className="text-sm font-medium text-gray-300">{formatLikes(likeCount)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            {/* Play Button */}
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/Player',
                  params: {
                    url: postId,
                  },
                });
              }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#d4af37',
                paddingVertical: 16,
                borderRadius: 12,
                shadowColor: '#d4af37',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 6,
              }}>
              <FontAwesome name="play" size={18} color="#000" style={{ marginRight: 8 }} />
              <Text className="text-lg font-bold" style={{ color: '#000' }}>
                Play Now
              </Text>
            </TouchableOpacity>

            {/* Info Button */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome name="info-circle" size={22} color="white" />
            </TouchableOpacity>

            {/* Add to List Button */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome name="plus" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HomeMainCard;
