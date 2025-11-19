import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useStreamContext } from '~/app/contexts/streamContext';
import { Call, StreamCall, ViewerLivestream } from '@stream-io/video-react-native-sdk';
import { ActivityIndicator } from 'react-native-paper';
import { OverlayProvider } from 'stream-chat-expo';
const index = () => {
  const [call, setCall] = useState<Call | undefined>(undefined);
  const { id } = useLocalSearchParams();

  const { client } = useStreamContext();

  const JoinStream = async () => {
    try {
      // guard against id being undefined or an array of strings
      if (!id || Array.isArray(id)) return;
      const calls = client?.call('livestream', id);
      await call?.join();
      setCall(calls);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    JoinStream();
  }, [id, client]);

  if (!call)
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="white" />
        <Text className="text-white">Please Wait...</Text>
        <Text className="text-white">Loading Live Stream</Text>
      </View>
    );
  return (
    <StreamCall call={call}>
      <ViewerLivestream />
    </StreamCall>
  );
};

export default index;
