import { View, FlatList, Dimensions } from 'react-native';
import VideoCard, { Video } from '../VideoCard';
import EmptyState from '../EmptyVideo';

interface SearchListRenderProps {
  data: Video[];
  onCardPress?: (item: Video) => void;
}
const SearchListRender: React.FC<SearchListRenderProps> = ({ data, onCardPress }) => {
  return (
    <View className="mt-2 flex-1 px-2">
      <FlatList
        data={data}
        renderItem={({ item }) => <VideoCard item={item} onPress={onCardPress!} />}
        keyExtractor={(item) => item.postId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={() => <EmptyState />}
      />
    </View>
  );
};

export default SearchListRender;
