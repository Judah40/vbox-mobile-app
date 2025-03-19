/* eslint-disable prettier/prettier */
import { Link, Slot, Stack, useSegments } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const _layout = () => {
  const segments = useSegments();

  return (
    <Stack
      screenOptions={
        // segments[0] === 'Home'
        //   ?
        {
          headerRight: () => (
            <Link href={'/(app)/Home/searchModal'} asChild>
              <TouchableOpacity>
                <FontAwesome name="search" size={24} color="white" />
              </TouchableOpacity>
            </Link>
          ),
          statusBarStyle: 'auto',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerLeft: () => (
            <Image source={require('../../../assets/vbox.png')} style={{ width: 40, height: 40 }} />
          ),
          title: ' ',
        }
        // : { headerShown: false }
      }>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="searchModal"
        options={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
};

export default _layout;
