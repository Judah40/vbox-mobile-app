import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Easing,
  Platform,
  Pressable,
} from 'react-native';
import {
  HeartIcon as HeartOutline,
  BookmarkIcon as BookmarkOutline,
} from 'react-native-heroicons/outline';
import {
  PlayIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  MapPinIcon,
  FireIcon,
  ChevronDownIcon,
} from 'react-native-heroicons/solid';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.65;

const ImmersiveVideoPreview = ({ video, onClose }: any) => {
  const [savedToList, setSavedToList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const animatedValues = useRef({ scale: new Animated.Value(1.05) }).current;

  // Shimmer animation for loading state - corrected
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show animation sequence
    Animated.sequence([
      Animated.timing(animatedValues.scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.delay(200),
    ]).start(() => setShowDetails(true));

    // Shimmer animation - fixed to output numeric values
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Derive animations from scroll position
  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1.2, 1, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0, 0, -40],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, -15, -30],
    extrapolate: 'clamp',
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 80, 120],
    outputRange: [0, 0.5, 0.9],
    extrapolate: 'clamp',
  });

  const toggleSaveToList = () => setSavedToList(!savedToList);
  const toggleLiked = () => setLiked(!liked);

  if (!video) return null;

  // Fixed shimmer effect that uses correct numeric values
  const renderShimmer = () => {
    // Ensure the transform property gets numeric values by using basic Animated.View properties
    return (
      <View className="absolute inset-0 overflow-hidden bg-gray-900">
        <Animated.View
          className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          style={{
            width: width * 3,
            left: -width,
            transform: [
              {
                translateX: shimmerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width], // Guaranteed to be numeric
                }),
              },
            ],
          }}
        />
      </View>
    );
  };

  const relatedVideos = [
    {
      id: 1,
      title: 'ECOFEST 2024',
      thumbnail: video.thumbnailUrl,
      viewCount: '1.2M',
      duration: '3:45',
    },
    {
      id: 2,
      title: 'Sierra Leone Dance',
      thumbnail: video.thumbnailUrl,
      viewCount: '458K',
      duration: '2:18',
    },
    {
      id: 3,
      title: 'West African Stars',
      thumbnail: video.thumbnailUrl,
      viewCount: '912K',
      duration: '4:22',
    },
    {
      id: 4,
      title: 'Beach Front Concert',
      thumbnail: video.thumbnailUrl,
      viewCount: '756K',
      duration: '7:10',
    },
  ];

  const renderRelatedItem = ({ item }: any) => (
    <TouchableOpacity className="mr-4 w-56 overflow-hidden rounded-lg" activeOpacity={0.9}>
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="h-32 w-full rounded-lg"
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          className="absolute inset-0 rounded-lg"
        />
        <View className="absolute bottom-2 left-2 right-2">
          <Text className="text-sm font-bold text-white" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="mt-1 flex-row items-center">
            <FireIcon size={12} color="#E50914" />
            <Text className="ml-1 text-xs text-gray-300">{item.viewCount} views</Text>
            <Text className="ml-2 text-xs text-gray-400">• {item.duration}</Text>
          </View>
        </View>
        <View className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1">
          <Text className="text-xs font-medium text-white">{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Animation helper for content reveal
  const AnimatedContent = ({ delay = 0, children, className }: any) => {
    const [visible, setVisible] = useState(!delay);

    useEffect(() => {
      if (delay) {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
      }
    }, []);

    if (!visible && delay) return null;

    return (
      <Animated.View
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transform: [{ translateY: visible ? 0 : 10 }],
        }}>
        {children}
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Animated Floating Header */}
      <Animated.View
        className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between px-4 pb-4 pt-10"
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          opacity: headerBackgroundOpacity,
        }}>
        <TouchableOpacity onPress={onClose} className="p-2">
          <ArrowLeftIcon size={22} color="white" />
        </TouchableOpacity>

        <Animated.Text
          className="text-lg font-bold text-white"
          style={{ opacity: headerBackgroundOpacity }}
          numberOfLines={1}>
          {video.caption}
        </Animated.Text>

        <TouchableOpacity className="p-2" onPress={() => {}}>
          <InformationCircleIcon size={22} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1">
        {/* Hero Banner Section */}
        <View className="relative" style={{ height: BANNER_HEIGHT }}>
          {loading && renderShimmer()}

          <Animated.Image
            source={{ uri: video.bannerUrl }}
            className="absolute h-full w-full"
            resizeMode="cover"
            style={{
              transform: [{ scale: imageScale }, { translateY: imageTranslateY }],
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

          {/* Gradient Overlays */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent']}
            className="absolute left-0 right-0 top-0 h-40"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
            className="absolute bottom-0 left-0 right-0 h-2/3"
          />

          {/* Back Button */}
          <View className="absolute left-4 right-4 top-10 z-10 flex-row justify-between">
            <TouchableOpacity onPress={onClose} className="rounded-full bg-black/30 p-2">
              <ArrowLeftIcon size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Play Button */}
          <Animated.View
            className="absolute inset-0 mt-20 items-center justify-center"
            style={{ transform: [{ scale: animatedValues.scale }] }}>
            <TouchableOpacity
              className="items-center justify-center rounded-full bg-red-600 p-5"
              style={{
                elevation: 8,
                shadowColor: '#E50914',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
              }}
              activeOpacity={0.8}>
              <PlayIcon size={36} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bottom Content */}
          <Animated.View
            className="absolute bottom-6 left-6 right-6"
            style={{ transform: [{ translateY: titleTranslateY }] }}>
            {/* Location Badge */}
            <AnimatedContent delay={100} className="mb-3 flex-row items-center">
              <View className="mr-3 flex-row items-center rounded-full bg-red-600 px-3 py-1">
                <MapPinIcon size={12} color="white" />
                <Text className="ml-1 text-xs font-bold text-white">LIVE</Text>
              </View>
              <Text className="text-sm font-medium text-gray-300">{video.location}</Text>
            </AnimatedContent>

            {/* Title */}
            <AnimatedContent delay={150}>
              <Text className="mb-1 text-4xl font-extrabold text-white">
                {video.caption.toUpperCase()}
              </Text>
              <View className="flex-row items-center">
                <Text className="mr-3 rounded bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                  MUSIC FESTIVAL
                </Text>
                <View className="flex-row items-center">
                  <CalendarIcon size={14} color="#E50914" />
                  <Text className="ml-1 text-sm text-gray-300">March 2025</Text>
                </View>
              </View>
            </AnimatedContent>

            {/* Action Buttons */}
            <AnimatedContent delay={200} className="mt-6 flex-row justify-between">
              <TouchableOpacity
                className="flex-row items-center rounded-full bg-white px-8 py-3"
                activeOpacity={0.9}>
                <PlayIcon size={18} color="black" />
                <Text className="ml-2 text-base font-bold text-black">Play</Text>
              </TouchableOpacity>

              <View className="flex-row space-x-4">
                <TouchableOpacity
                  onPress={toggleLiked}
                  className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
                  activeOpacity={0.8}>
                  {liked ? (
                    <HeartIcon size={24} color="#E50914" />
                  ) : (
                    <HeartOutline size={24} color="white" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={toggleSaveToList}
                  className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
                  activeOpacity={0.8}>
                  {savedToList ? (
                    <BookmarkIcon size={24} color="#E50914" />
                  ) : (
                    <BookmarkOutline size={24} color="white" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
                  activeOpacity={0.8}>
                  <ShareIcon size={24} color="white" />
                </TouchableOpacity>
              </View>
            </AnimatedContent>
          </Animated.View>
        </View>

        {/* Content Details Section */}
        <AnimatedContent delay={300} className="mt-6 px-6">
          {/* Stats Bar */}
          <View className="mb-5 flex-row justify-between">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-red-600">98%</Text>
              <Text className="ml-2 text-sm text-gray-400">Match</Text>
            </View>

            <View className="flex-row space-x-5">
              <View className="items-center">
                <Text className="font-bold text-white">{video.likeCount + (liked ? 1 : 0)}</Text>
                <Text className="text-xs text-gray-400">Likes</Text>
              </View>
              <View className="items-center">
                <Text className="font-bold text-white">{video.commentCount}</Text>
                <Text className="text-xs text-gray-400">Comments</Text>
              </View>
              <View className="items-center">
                <Text className="font-bold text-white">24K</Text>
                <Text className="text-xs text-gray-400">Views</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text className="mb-6 text-base leading-6 text-white">{video.content}</Text>

          {/* Features */}
          <View className="mb-8 flex-row flex-wrap justify-between">
            <View className="mb-3 w-1/2 flex-row items-center">
              <View className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                <MusicNoteIcon />
              </View>
              <View>
                <Text className="font-medium text-white">Live Music</Text>
                <Text className="text-xs text-gray-400">42 Artists</Text>
              </View>
            </View>

            <View className="mb-3 w-1/2 flex-row items-center">
              <View className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                <GlobeIcon />
              </View>
              <View>
                <Text className="font-medium text-white">Countries</Text>
                <Text className="text-xs text-gray-400">15 Nations</Text>
              </View>
            </View>

            <View className="w-1/2 flex-row items-center">
              <View className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-yellow-600/20">
                <CalendarIcon size={20} color="#FCD34D" />
              </View>
              <View>
                <Text className="font-medium text-white">Duration</Text>
                <Text className="text-xs text-gray-400">3 Days Festival</Text>
              </View>
            </View>

            <View className="w-1/2 flex-row items-center">
              <View className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-green-600/20">
                <UserGroupIcon />
              </View>
              <View>
                <Text className="font-medium text-white">Audience</Text>
                <Text className="text-xs text-gray-400">10K+ Expected</Text>
              </View>
            </View>
          </View>

          {/* Related Content */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Related Events</Text>
              <TouchableOpacity>
                <Text className="text-sm text-red-600">See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={relatedVideos}
              renderItem={renderRelatedItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>

          {/* Comments Preview */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Comments</Text>
              <TouchableOpacity>
                <Text className="text-sm text-red-600">Add Comment</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-3 rounded-xl bg-gray-900 p-4">
              <View className="mb-2 flex-row">
                <View className="mr-3 h-10 w-10 rounded-full bg-gray-700" />
                <View>
                  <Text className="font-medium text-white">Sarah Johnson</Text>
                  <Text className="text-xs text-gray-400">2 days ago</Text>
                </View>
              </View>
              <Text className="text-gray-300">
                Last year's ECOFEST was incredible! Looking forward to the lineup this year. The
                dance performances are always the highlight for me.
              </Text>
            </View>

            <View className="rounded-xl bg-gray-900 p-4">
              <View className="mb-2 flex-row">
                <View className="mr-3 h-10 w-10 rounded-full bg-gray-700" />
                <View>
                  <Text className="font-medium text-white">Michael Osei</Text>
                  <Text className="text-xs text-gray-400">3 days ago</Text>
                </View>
              </View>
              <Text className="text-gray-300">
                Will there be tickets available at the door? I'm traveling from Ghana and would love
                to experience the festival this year!
              </Text>
            </View>
          </View>
        </AnimatedContent>
      </Animated.ScrollView>
    </View>
  );
};

// These are custom icons needed for the UI
const MusicNoteIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F87171"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M9 18V5l12-2v13" />
    <Circle cx="6" cy="18" r="3" />
    <Circle cx="18" cy="16" r="3" />
  </Svg>
);

const GlobeIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#60A5FA"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const UserGroupIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4ADE80"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

// Example usage screen
const VideoDetailScreen = () => {
  const videoData = {
    bannerUrl:
      'https://vbox-esselle-media-new-bucket.s3.eu-north-1.amazonaws.com/10553fb5cb76693f942ed3e8c21c0d76dca5176d189381a8363c37bd43bffe49?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXWMA6CXOZZEUJLZO%2F20250323%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250323T023448Z&X-Amz-Expires=3600&X-Amz-Signature=bb3c2882645532b3d85ba7f4f8fe812d39bc7e14c0abd192c57ae29d22dc59f9&X-Amz-SignedHeaders=host&x-id=GetObject',
    caption: 'Ecofest',
    commentCount: 2,
    content:
      "ECOFEST is short for 'ECOWAS Music Festival', a regular appointment in the Sierra Leone festival scene that sees the participation of musician, dancers and performers from all over West Africa. The festival celebrates cultural diversity through music, dance and traditional performances.",
    id: 1,
    likeCount: 42,
    location: "Africell building Beach Front Bendu's Drive",
    postId: '9a8e99e9-b307-4e79-a0dd-40051a30109b',
    thumbnailUrl:
      'https://vbox-esselle-media-new-bucket.s3.eu-north-1.amazonaws.com/c2241ce27b15f958605a81501a9fbf7d821b56020be45ff288633e6c8ef385fd?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXWMA6CXOZZEUJLZO%2F20250323%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250323T023448Z&X-Amz-Expires=3600&X-Amz-Signature=b8814fc993773f0ea539128f87632e9331524192872a19ac671a02af6962ee6e&X-Amz-SignedHeaders=host&x-id=GetObject',
  };

  return (
    <View className="p flex-1 bg-black">
      <ImmersiveVideoPreview video={videoData} onClose={() => console.log('Close pressed')} />
    </View>
  );
};

export default VideoDetailScreen;
