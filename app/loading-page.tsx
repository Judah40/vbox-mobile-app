/* eslint-disable prettier/prettier */
import { View, Text, Image } from 'react-native';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
const Loading = () => {
  return (
    <View className="item-center flex-1 justify-center bg-gray-700">
      <View className="flex-col">
        <Spinner
          color="white"
          size={40}
          animation="slide"
          visible
          textContent="Please Wait"
          textStyle={{ color: 'white' }}
        />
      </View>
    </View>
  );
};

export default Loading;
