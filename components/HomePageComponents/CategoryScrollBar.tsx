import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { data as rawData, renderCategoryIcon } from '~/utils/DummyData/Categories';

// Define the button data type
interface ButtonItem {
  id: string;
  title: string;
  icon: string;
  iconSet:
    | 'MaterialIcons'
    | 'Ionicons'
    | 'FontAwesome5'
    | 'MaterialCommunityIcons'
    | 'AntDesign'
    | 'Entypo'
    | 'FontAwesome'
    | 'Feather';
}

// Define component props
interface HorizontalButtonListProps {
  initialSelectedId?: string;
  onSelectButton?: (id: string) => void;
  showTitle?: boolean;
}

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = 60;
const BUTTON_WIDTH_WITH_TITLE = 150;

const HorizontalButtonList: React.FC<HorizontalButtonListProps> = ({
  initialSelectedId = '1',
  onSelectButton,
  showTitle = true,
}) => {
  // Convert raw data to match ButtonItem type
  const data: ButtonItem[] = rawData.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    icon: item.icon,
    iconSet: item.iconSet,
  }));

  // State to track the selected button
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  
  // Animation value for scale effect
  const animatedScaleValues = useRef<{[key: string]: Animated.Value}>(
    data.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(item.id === initialSelectedId ? 1.05 : 1);
      return acc;
    }, {} as {[key: string]: Animated.Value})
  ).current;

  // Ref for FlatList to scroll to selected item
  const flatListRef = useRef<FlatList>(null);

  // Handle button press with animation
  const handleButtonPress = (id: string) => {
    // Reset previous selected button scale
    Animated.spring(animatedScaleValues[selectedId], {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    
    // Scale up newly selected button
    Animated.spring(animatedScaleValues[id], {
      toValue: 1.05,
      friction: 5,
      useNativeDriver: true,
    }).start();
    
    setSelectedId(id);
    if (onSelectButton) {
      onSelectButton(id);
    }
    
    // Scroll to make the selected button visible
    const index = data.findIndex(item => item.id === id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  // Scroll to initial selected item on mount
  useEffect(() => {
    const index = data.findIndex(item => item.id === initialSelectedId);
    if (index !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5
        });
      }, 500);
    }
  }, [initialSelectedId]);

  // Render each button
  const renderButton = ({ item }: { item: ButtonItem }) => {
    const isSelected = item.id === selectedId;
    
    return (
      <Animated.View
        style={{
          transform: [{ scale: animatedScaleValues[item.id] }],
        }}>
        <TouchableOpacity
          className={`mx-2 items-center justify-center rounded-xl shadow-lg ${
            isSelected 
              ? 'bg-yellow-500' 
              : 'bg-gray-900'
          }`}
          style={{
            width: showTitle ? BUTTON_WIDTH_WITH_TITLE : BUTTON_WIDTH,
            height: showTitle ? 50 : 60,
            borderWidth: isSelected ? 0 : 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
          onPress={() => handleButtonPress(item.id)}>
          <View className={`${showTitle ? 'flex-row items-center' : 'flex-col items-center'} justify-center p-2`}>
            <View className={`${showTitle ? 'mr-3' : 'mb-1'}`}>
              {renderCategoryIcon({ ...item, id: Number(item.id) }, isSelected)}
            </View>
            
            {showTitle && (
              <Text 
                className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-100'}`}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.title}
              </Text>
            )}
          </View>
          
          {!showTitle && (
            <Text 
              className={`text-xs ${isSelected ? 'text-gray-900' : 'text-gray-200'} mb-1`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.title}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Handle scroll to index error
  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ 
        index: info.index, 
        animated: true,
        viewPosition: 0.5
      });
    });
  };

  return (
    <View className="my-4">
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 py-2"
        decelerationRate="fast"
        onScrollToIndexFailed={onScrollToIndexFailed}
        snapToAlignment="center"
        snapToInterval={showTitle ? BUTTON_WIDTH_WITH_TITLE + 16 : BUTTON_WIDTH + 16}
      />
    </View>
  );
};

export default HorizontalButtonList;