import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <View className="items-center justify-center px-5 py-20">
      <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-[#1A1A1A]">
        <MaterialIcons name="video-library" size={64} color="#333" />
      </View>
      <Text className="mb-2 text-2xl font-bold text-white">No Videos Found</Text>
      <Text className="text-center text-base text-gray-400">
        We couldn't find any videos matching your search. Try adjusting your filters.
      </Text>
    </View>
  );
};

export default EmptyState;
