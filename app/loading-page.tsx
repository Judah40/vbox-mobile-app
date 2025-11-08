/* eslint-disable prettier/prettier */
import { View, Text, Image } from 'react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
const Loading = () => {
  return (
    <View className="item-center flex-1 justify-center bg-gray-700">
      <View className="flex-col">
        <ActivityIndicator />
      </View>
    </View>
  );
};

export default Loading;
