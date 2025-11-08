import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';
import { View } from 'react-native';
import { StreamContextProvider } from '../contexts/streamContext';
import { BottomSheetProvider } from '../contexts/BottomSheetProvider';

export default function TabLayout() {
  return (
    <StreamContextProvider>
      <BottomSheetProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarStyle: {
              backgroundColor: 'black',
            },
            headerShown: false,
          }}>
          <Tabs.Screen
            name="Home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
              headerRight: () => <View></View>,
            }}
          />
          <Tabs.Screen
            name="Channel"
            options={{
              title: 'Channel',
              tabBarIcon: ({ color }) => <TabBarIcon name="tv" color={color} />,
              headerRight: () => <View></View>,
            }}
          />
          <Tabs.Screen
            name="Live"
            options={{
              title: 'Vidoes',
              tabBarIcon: ({ color }) => <TabBarIcon name="video-camera" color={color} />,
              headerRight: () => <View></View>,
            }}
          />
          <Tabs.Screen
            name="Account"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
              headerRight: () => <View></View>,
            }}
          />
        </Tabs>
      </BottomSheetProvider>
    </StreamContextProvider>
  );
}
