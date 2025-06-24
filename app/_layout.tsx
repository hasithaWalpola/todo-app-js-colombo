import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then(value => {
      console.log(value, 'value');

      setInitialRoute(value === 'true' ? '(tabs)' : '(root)');
    });
  }, []);

  if (!initialRoute) return; // or splash screen

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false, }} >
      {/* <Stack.Screen name="(root)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
}