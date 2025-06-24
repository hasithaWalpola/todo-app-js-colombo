import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  useEffect(() => {
    const setFlag = async () => {
      await AsyncStorage.setItem('hasSeenOnboarding', 'false');
    };

    setFlag();
  }, []);


  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false, }} >
    </Stack>
  );
}