import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CategoryScrollBar from '~/components/HomePageComponents/CategoryScrollBar';
import LiveStreamScrollView from '~/components/HomePageComponents/LiveStreamScrollView';
import cardItems from '~/utils/DummyData/LiveDummyData';
import { handleGetAllPostsByGenre } from '~/app/api/videos/api';
import EntertainmentApp from '~/components/HomePageComponents/VideosOnDemand';
import HomeMainCard from '~/components/HomePageComponents/HomeMainCard';

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
  }>;
};

const Index = () => {
  const [posts, setPosts] = useState<Data>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetAllPostsByGenre()
      .then((response) => {
        setPosts(response.data.data);
      })
      .catch((error) => {
        console.error('Failed to fetch posts:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <ScrollView className="flex-1 bg-black">
      {/* HOME CARD */}
      <HomeMainCard />
      {/* CATEGORY SCROLL BAR */}
      <CategoryScrollBar />

      {/* LIVE STREAM */}
      <View className="">
        <View className="px-4 ">
          <Text className="text-xl text-white">Live Stream</Text>
        </View>
        <LiveStreamScrollView data={cardItems} />
      </View>

      {/*UPCOMING LIVE STREAM */}
      <View className="p-4">
        <View className="h-40 w-full items-center justify-center rounded-lg border border-yellow-500">
          <Text className="text-xl text-white">Upcoming Stream</Text>
        </View>
      </View>

      {/* VIDEOS ON DEMAND */}
      {posts && <EntertainmentApp data={posts} />}
    </ScrollView>
  );
};

export default Index;
