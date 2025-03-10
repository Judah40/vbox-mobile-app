/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';
const _layout = () => {
  return (
   <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name='login'/>
    <Stack.Screen name='register'/>
   </Stack>
  )
}

export default _layout