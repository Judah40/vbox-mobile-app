import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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
}

const HorizontalButtonList: React.FC<HorizontalButtonListProps> = ({
  initialSelectedId = '1',
  onSelectButton,
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

  // Handle button press
  const handleButtonPress = (id: string) => {
    setSelectedId(id);
    if (onSelectButton) {
      onSelectButton(id);
    }
  };

  // Render each button
  const renderButton = ({ item }: { item: ButtonItem }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        className={`mx-1 h-14 w-60 flex-row items-center justify-center gap-4 rounded-lg px-4 py-2.5 shadow ${
          isSelected ? 'bg-yellow-500' : 'bg-gray-700'
        }`}
        onPress={() => handleButtonPress(item.id)}>
        {renderCategoryIcon({ ...item, id: Number(item.id) }, isSelected)}

        <Text className={`text-sm font-medium text-white`}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="my-6">
      <FlatList
        data={data}
        renderItem={renderButton}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2"
      />
    </View>
  );
};

export default HorizontalButtonList;
