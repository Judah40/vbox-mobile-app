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
        className="mx-1 rounded-xl overflow-hidden shadow-lg"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <ImageBackground
          source={{ uri: item.imageUri }}
          className="w-full h-full"
          resizeMode="cover"
        >
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            className="absolute inset-0"
          />

          {/* Top content */}
          <View className="flex-row justify-between p-3">
            {/* Views count with icon */}
            <View className="bg-black/60 rounded-full px-3 py-1 flex-row items-center">
              <FontAwesome name="eye" size={14} color="white" className="mr-1" />
              <Text className="text-white text-xs font-medium ml-1">
                {formatViewCount(item.views)}
              </Text>
            </View>

            {/* Live indicator */}
            {item.isLive && (
              <View className="bg-red-600 rounded-full px-3 py-1 flex-row items-center">
                <View className="w-2 h-2 bg-white rounded-full mr-1" />
                <Text className="text-white text-xs font-bold">
                  LIVE
                </Text>
              </View>
            )}
            
            {/* Duration if not live */}
            {!item.isLive && item.duration && (
              <View className="bg-black/60 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-medium">
                  {item.duration}
                </Text>
              </View>
            )}
          </View>

          {/* Bottom content */}
          <View className="absolute bottom-0 left-0 right-0 p-4">
            <Text className="text-white text-lg font-bold mb-1 drop-shadow-lg" numberOfLines={2}>
              {item.title}
            </Text>
            {item.channelName && (
              <View className="flex-row items-center mt-1">
                <View className="w-6 h-6 bg-gray-300 rounded-full mr-2" />
                <Text className="text-white/80 text-xs">
                  {item.channelName}
                </Text>
              </View>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 8} // 8 is the sum of horizontal margins
      decelerationRate="fast"
      className="px-2 py-5"
      contentContainerStyle={{ paddingEnd: 10 }}
    />
  );
};

export default LiveStreamScrollView;