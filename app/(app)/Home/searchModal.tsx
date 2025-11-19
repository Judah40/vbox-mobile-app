import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { handleGetAllPosts } from '~/app/api/videos/api';
import { useBottomSheet } from '~/app/contexts/BottomSheetProvider';
import SearchBar from '~/components/HomePageComponents/SearchBar';
import SearchListRender from '~/components/SearchModalComponents/SearchListRender';
import { Video } from '~/components/VideoCard';

export default function Modal() {
  const router = useRouter();
  const [data, setData] = useState<Video[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  // const [filteredData, setFilter]
  const [isLoading, setIsLoading] = useState(false);
  const { openSheetWithId } = useBottomSheet();

  useEffect(() => {
    setIsLoading(true);
    handleGetAllPosts()
      .then((response) => {
        if (search) {
          const filteredData: Video[] = response.posts.filter((post: Video) => {
            if (post.title.toLowerCase().includes(search!.toLowerCase())) return post;
          });
          console.log('');
          setData(filteredData);
        } else {
          setData(response.posts);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [search]);
  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="w-full flex-row items-center">
        <SearchBar
          onSearch={(data) => {
            console.log(data);
            setSearch(data);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="px-2">
          <Text className="text-white underline">Cancel</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <ActivityIndicator />}
      <View className="h-full w-full flex-1">
        <SearchListRender
          data={data}
          onCardPress={(data) => {
            openSheetWithId(data.postId);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
