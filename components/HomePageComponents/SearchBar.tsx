import React, { useState } from 'react';
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
    <View className="flex-row flex-1 items-center bg-gray-100 rounded-lg px-3 py-2 mx-2 my-2 h-12">
      <Ionicons name="search" size={20} color={iconColor} className="mr-2" />
      <TextInput
        className="flex-1 text-base"
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        clearButtonMode="while-editing"
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