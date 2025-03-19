import React from 'react';
import { Text, View, FlatList, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardItem {
  id: string;
  title: string;
  views: number;
  isLive: boolean;
  imageUri: string;
}

interface HorizontalCardListProps {
  data: CardItem[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const LiveStreamScrollView: React.FC<HorizontalCardListProps> = ({ data }) => {
  const renderCard = ({ item }: { item: CardItem }) => {
    return (
      <View className="mx-1 overflow-hidden rounded-xl" style={{ width: CARD_WIDTH, height: 200 }}>
        {/* Card Background Image */}
        <ImageBackground resizeMode='contain' source={{ uri: item.imageUri }} className="flex-1 bg-gray-700">
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.8)']}
            className="flex-1 justify-between p-3">
            {/* Top Row with Views and Live Status */}
            <View className="flex-row justify-between">
              {/* Views Count at Top Left */}
              <View className="rounded-full bg-black/60 px-2 py-1">
                <Text className="text-xs font-semibold text-white">{item.views} views</Text>
              </View>

              {/* Live Indicator at Top Right */}
              {item.isLive && (
                <View className="flex-row items-center rounded-full bg-red-500/70 px-2 py-1">
                  <View className="mr-1 h-1.5 w-1.5 rounded-full bg-white" />
                  <Text className="text-xs font-bold text-white">LIVE</Text>
                </View>
              )}
            </View>

            {/* Card Title at Bottom */}
            <View className="w-full">
              <Text className="text-base font-bold text-white" numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 8} // 8 is the sum of the horizontal margins (mx-1 = 4 points on each side)
      decelerationRate="fast"
      className="px-2 py-5"
    />
  );
};

export default LiveStreamScrollView;
