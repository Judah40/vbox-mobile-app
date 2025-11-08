import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { handleGetAllPosts } from '~/app/api/videos/api';
import SearchBar from '~/components/HomePageComponents/SearchBar';
import SearchListRender from '~/components/SearchModalComponents/SearchListRender';

export interface MediaItem {
  id: number;
  postId: string;
  userId: number;
  content: string;
  thumbnailUrl: string;
  bannerUrl: string;
  caption: string;
  location: string;
}

export default function Modal() {
  const router = useRouter();
  const [data, setData] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetAllPosts()
      .then((response) => {
        console.log(response.post);
        setData(response.post);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <View className="flex-1 bg-black">
      <View className="w-full flex-row items-center">
        <SearchBar />
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="px-2">
          <Text className="text-white underline">Cancel</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <ActivityIndicator />}
      <SearchListRender
        data={data}
        onCardPress={(data) => {
          router.push({
            pathname: '/Player',
            params: { url: data },
          });
        }}
      />
    </View>
  );
}
