import { View, Text, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { handleGetPostByGenre } from '~/app/api/videos/api';
const { width: screenWidth } = Dimensions.get('window');

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

const HomeMainCard = () => {
  const [data, setData] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const CarouselItem = ({ item }: { item: MediaItem }) => {
    return (
      <View className="overflow-hidden rounded-lg bg-white shadow-lg shadow-black/50">
        <Image source={{ uri: item.bannerUrl }} className="h-full w-full"  />
        <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <Text className="text-lg font-bold text-white">{item.caption}</Text>
          <Text className="text-sm text-white">{item.location}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    handleGetPostByGenre('Music')
      .then((response) => {
        setData(response.data.post);
      })
      .catch((error) => {
        console.log(error.response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <View
      className="w-full mt-4 items-center justify-center rounded-lg border p-4"
      style={{
        height: 200,
      }}>
      <Carousel
        data={data}
        renderItem={CarouselItem}
        width={screenWidth*0.96}
        loop
        autoPlay
        autoPlayInterval={5000}
        height={200}
      />
    </View>
  );
};

export default HomeMainCard;
