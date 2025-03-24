import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { View } from 'react-native';

export default function TabLayout() {
  return (
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
          title: 'Live',
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
      <Tabs.Screen name="Preview" options={{ href: null }} />
    </Tabs>
  );
}
