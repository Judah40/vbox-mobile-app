import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface CustomSelectInputProps {
  label: string;
  value: string;
  onPress: () => void;
  error?: string;
  placeholder?: string;
}

const CustomSelectInput: React.FC<CustomSelectInputProps> = ({
  label,
  value,
  onPress,
  error,
  placeholder,
}) => {
  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-300">{label}</Text>
      <Pressable
        onPress={onPress}
        style={{
          borderWidth: 2,
          borderColor: error ? '#ef4444' : value ? '#d4af37' : '#374151',
          borderRadius: 12,
          backgroundColor: '#1e293b',
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}>
        <View className="flex-row items-center justify-between">
          <Text style={{ color: value ? '#ffffff' : '#64748b', fontSize: 16 }}>
            {value || placeholder}
          </Text>
          <Text style={{ color: '#d4af37', fontSize: 18 }}>▼</Text>
        </View>
      </Pressable>
      {error && <Text className="ml-1 mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default CustomSelectInput;
