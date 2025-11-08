import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import MasterVideoPlayer from '~/components/MasterVideoPlayer';
import { handleGetSinglePost } from '../api/videos/api';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Post {
  bannerUrl: string;
  caption: string;
  commentCount: number;
  content: string;
  createdAt: string; // ISO date string
  id: number;
  isDeleted: boolean;
  isPublic: boolean;
  likeCount: number;
  location: string;
  postId: string;
  tags: string[]; // Array of strings (even though the example has a stringified array)
  thumbnailUrl: string;
  updatedAt: string; // ISO date string
  userId: number;
  videoUrl: string;
}
const Player = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams();
  const [data, setData] = useState<Post>();
  useEffect(() => {
    console.log(url);
    handleGetSinglePost(String(url)).then((response) => {
      console.log(response.data.post);
      setData(response.data.post);
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MasterVideoPlayer
          onClose={() => {
            router.back();
          }}
          source={{
            uri: data?.videoUrl!,
          }}
          title={data?.caption}
        />
      </View>
    </SafeAreaView>
  );
};

export default Player;
