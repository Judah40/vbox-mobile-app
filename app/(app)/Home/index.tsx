import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { getAllChannel, handleGetAllPostsByGenre, handleGetSinglePost } from '~/app/api/videos/api';
import CategoryScrollBar from '~/components/HomePageComponents/CategoryScrollBar';
import ChannelList from '~/components/HomePageComponents/ChannelList';
import HomeMainCard, { cardProps } from '~/components/HomePageComponents/HomeMainCard';
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
    viewCount: number;
  }[];
};

export interface Channel {
  channelId: string;
  channelLogo: string;
  channelName: string;
  lastBroadcast: string | null;
}

const Index = () => {
  const [posts, setPosts] = useState<Data>();
  const [isLoading, setIsLoading] = useState(true);
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [post, setPost] = useState<cardProps>();
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

    handleGetSinglePost('80acf066-0737-443d-b887-97cac4321d58')
      .then((response) => {
        setPost(response.data.post);
      })
      .catch((error) => {
        console.error('Failed to fetch posts:', error);
      });

    getAllChannel()
      .then((response) => {
        setChannelList(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);
  return (
    <ScrollView className="flex-1 bg-black">
      {/* HOME CARD */}
      <HomeMainCard
        bannerUrl={post?.bannerUrl!}
        duration={post?.duration!}
        genre={post?.genre!}
        likeCount={post?.likeCount!}
        location={post?.location!}
        thumbnailUrl={post?.thumbnailUrl!}
        title={post?.title!}
        postId={post?.postId!}
      />
      {/* CATEGORY SCROLL BAR */}
      {/* <CategoryScrollBar /> */}
      <ChannelList
        channels={channelList}
        onChannelPress={(channel) => {
          console.log('Selected channel:', channel);
          // Navigate to channel or handle press
        }}
      />
      {/* LIVE STREAM */}
      <View className="">
        <View className="px-4 ">
          <Text className="text-xl text-white">Live Now</Text>
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
      <EntertainmentApp data={posts!} />
    </ScrollView>
  );
};

export default Index;
