import { Slot, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import 'react-native-reanimated';
import { BottomSheetProvider } from './contexts/BottomSheetProvider';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { NetworkProvider } from './contexts/NetworkProvider';
const InitialLayout = () => {
  const { authState, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // router.push('/loading-page');

    // const inAuthGroup = segments[0] === '(app)';

    // if (authState?.authenticated && inAuthGroup) {
    //   router.replace('/(app)/Home');
    // } else if (!authState?.authenticated) {
    //   router.replace('/(auth)/login');
    // }
  }, [authState, initialized, segments, router]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set the navigation bar style
      NavigationBar.setStyle('dark');
    }
  }, []);
  return <Slot />;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NetworkProvider>
          <BottomSheetModalProvider>
            <InitialLayout />
          </BottomSheetModalProvider>
        </NetworkProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
