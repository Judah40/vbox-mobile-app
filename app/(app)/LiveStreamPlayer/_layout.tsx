import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { OverlayProvider } from 'stream-chat-expo';
import { StreamVideo } from '@stream-io/video-react-native-sdk';
import { useStreamContext } from '~/app/contexts/streamContext';

const _layout = () => {
  const { client } = useStreamContext();
  return (
    <OverlayProvider>
      <StreamVideo client={client!}>
        <Slot />
      </StreamVideo>
    </OverlayProvider>
  );
};

export default _layout;
