/* eslint-disable prettier/prettier */
import { Stack, useSegments } from 'expo-router';
const _layout = () => {
  const segments = useSegments();

  return (
    <Stack
      screenOptions={
        // segments[0] === 'Home'
        //   ?
        { headerShown: false }
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
