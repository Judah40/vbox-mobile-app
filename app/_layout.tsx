import { Slot, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
const InitialLayout = () => {
  const { authState, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    router.push('/loading-page');
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(app)';

    if (authState?.authenticated && inAuthGroup) {
      router.replace('/(app)');
    } else if (!authState?.authenticated) {
      router.replace('/(auth)/login');
    }
  }, [authState, initialized]);
  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
        <GestureHandlerRootView>
      <BottomSheetModalProvider>
          <InitialLayout />
      </BottomSheetModalProvider>
        </GestureHandlerRootView>
    </AuthProvider>
  );
}
