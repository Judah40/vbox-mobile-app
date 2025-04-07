import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { handleGetAllPostsByGenre } from '~/app/api/videos/api';
import CategoryScrollBar from '~/components/HomePageComponents/CategoryScrollBar';
import HomeMainCard from '~/components/HomePageComponents/HomeMainCard';
import LiveStreamScrollView from '~/components/HomePageComponents/LiveStreamScrollView';
import UpcomingStreamCard from '~/components/HomePageComponents/UpcomingStreamCard';
import EntertainmentApp from '~/components/HomePageComponents/VideosOnDemand';
import cardItems from '~/utils/DummyData/LiveDummyData';

type Data = {
  [tag: string]: {
    id: number;
    postId: string;
    content: string;
    thumbnailUrl: string;
    bannerUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
    location: string;
  }[];
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
        <View className=" w-full  rounded-lg border border-yellow-500">
          <UpcomingStreamCard />
        </View>
      </View>

      {/* VIDEOS ON DEMAND */}
      {posts && <EntertainmentApp data={posts} />}
    </ScrollView>
  );
};

export default Index;
