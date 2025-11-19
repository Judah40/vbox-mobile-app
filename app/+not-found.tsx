import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <View className="item-center flex-1 justify-center bg-black">
      <ActivityIndicator color="white" />
    </View>
  );
}
