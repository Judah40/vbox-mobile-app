import { StreamVideoClient, User } from '@stream-io/video-client';
import { createContext, useState, useContext, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiKey = process.env.EXPO_PUBLIC_STREAM_TOKEN_API_KEY ?? '';

type conTextType = {
  client: StreamVideoClient | null;
  chatClient: StreamChat | null;
};
type Provider = {
  children: React.ReactNode;
};
const Streamcontext = createContext<conTextType | null>(null);

export const StreamContextProvider: React.FC<Provider> = ({ children }) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const { userDetails, userProfilePicture } = useAuth();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  useEffect(() => {
    const initClient = async () => {
      const token = await AsyncStorage.getItem('streamToken');

      console.log(token, userDetails?.id, userDetails?.firstName, apiKey);
      if (!token || !userDetails?.id || !userDetails?.firstName || !apiKey) {
        console.error('❌ Missing required data to initialize client.');
        return;
      }

      const user: User = {
        id: userDetails.id.toString(),
        name: userDetails.firstName,
        image: userProfilePicture ?? undefined,
      };

      const streamClient = new StreamVideoClient({
        apiKey,
        token,
        user,
      });
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(
        {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        token
      );

      console.log(chatClient);
      setChatClient(chatClient);
      setClient(streamClient);
    };

    initClient();

    return () => {
      if (client) client.disconnectUser();
      if (chatClient) chatClient.disconnectUser();
    };
  }, [userDetails, userProfilePicture]);
  return <Streamcontext.Provider value={{ client, chatClient }}>{children}</Streamcontext.Provider>;
};

export const useStreamContext = () => {
  const context = useContext(Streamcontext);
  if (context == undefined) {
    throw new Error('useContext must be used within an AuthProvider');
  }

  return context;
};
