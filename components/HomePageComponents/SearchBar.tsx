import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  clearOnSubmit?: boolean;
  iconColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  clearOnSubmit = false,
  iconColor = '#666',
}) => {
  const [searchText, setSearchText] = useState<string>('');

  const handleSubmit = (): void => {
    if (onSearch) {
      onSearch(searchText);
      if (clearOnSubmit) {
        setSearchText('');
      }
    }
  };

  const clearSearch = (): void => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <View className="mx-2 my-2 h-12 flex-1 flex-row items-center rounded-full border border-gray-700 bg-black px-3 py-2">
      <Ionicons name="search" size={20} color={iconColor} className="mr-2" />
      <TextInput
        className="h-12 flex-1 text-base text-white"
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        clearButtonMode="while-editing"
        placeholderTextColor={'white'}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={clearSearch} className="p-1">
          <Ionicons name="close-circle" size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
