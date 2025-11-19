import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleGetMyWatchList } from '~/app/api/videos/api';
import EmptyState from '~/components/EmptyVideo';
import VideoCard, { Video } from '~/components/VideoCard';
import { VideoCardSkeleton } from '../Live';
import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';

const Watch = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { openSheetWithId } = useBottomSheet();

  const handleVideoPress = (video: Video): void => {
    openSheetWithId(video.postId);
    // Navigate to video player
  };
  useEffect(() => {
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      // Replace this with your actual API call
      handleGetMyWatchList()
        .then((response) => {
          const data = response?.posts || [];
          setVideos(data);
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

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <LinearGradient colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0)']} className="px-5 pb-4 pt-14">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-4xl font-bold text-white">Watched Videos</Text>
          </View>
        </View>
      </LinearGradient>

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
      ) : videos.length > 0 ? (
        <FlatList
          data={videos}
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
    </SafeAreaView>
  );
};

export default Watch;
