import React from 'react';
import { Text, View, FlatList, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

interface CardItem {
  id: string;
  title: string;
  views: number;
  isLive: boolean;
  imageUri: string;
  channelName?: string;
  duration?: string;
}

interface HorizontalCardListProps {
  data: CardItem[];
  onCardPress?: (item: CardItem) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 220;

const LiveStreamScrollView: React.FC<HorizontalCardListProps> = ({ data, onCardPress }) => {
  const formatViewCount = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const renderCard = ({ item }: { item: CardItem }) => {
    return (
      <TouchableOpacity
        onPress={() => onCardPress && onCardPress(item)}
        className="mx-1 overflow-hidden rounded-xl shadow-lg"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <ImageBackground
          source={{ uri: item.imageUri }}
          className="h-full w-full"
          resizeMode="cover">
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />

          {/* Top content */}
          <View className="flex-row justify-between p-3">
            {/* Views count with icon */}
            <View className="flex-row items-center rounded-full bg-black/60 px-3 py-1">
              <FontAwesome name="eye" size={14} color="white" className="mr-1" />
              <Text className="ml-1 text-xs font-medium text-white">
                {formatViewCount(item.views)}
              </Text>
            </View>

            {/* Live indicator */}
            {item.isLive && (
              <View className="flex-row items-center rounded-full bg-red-600 px-3 py-1">
                <View className="mr-1 h-2 w-2 rounded-full bg-white" />
                <Text className="text-xs font-bold text-white">LIVE</Text>
              </View>
            )}

            {/* Duration if not live */}
            {!item.isLive && item.duration && (
              <View className="rounded-full bg-black/60 px-3 py-1">
                <Text className="text-xs font-medium text-white">{item.duration}</Text>
              </View>
            )}
          </View>

          {/* Bottom content */}
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <Text className="mb-1 text-lg font-bold text-white drop-shadow-lg" numberOfLines={2}>
              {item.title}
            </Text>
            {item.channelName && (
              <View className="mt-1 flex-row items-center">
                <View className="mr-2 h-6 w-6 rounded-full bg-gray-300" />
                <Text className="text-xs text-white/80">{item.channelName}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-60 w-full items-center justify-center">
      <Text className="text-white">No Live Videos</Text>
    </View>
    // <FlatList
    //   data={data}
    //   renderItem={renderCard}
    //   keyExtractor={item => item.id}
    //   horizontal
    //   showsHorizontalScrollIndicator={false}
    //   snapToInterval={CARD_WIDTH + 8} // 8 is the sum of horizontal margins
    //   decelerationRate="fast"
    //   className="px-2 py-5"
    //   contentContainerStyle={{ paddingEnd: 10 }}
    // />
  );
};

export default LiveStreamScrollView;
