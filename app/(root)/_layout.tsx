import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Layout() {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('hasSeenOnboarding').then(value => {
            console.log(value, 'value');

            setInitialRoute(value === 'true' ? '/(root)/(tabs)' : '/screens/onboard');
        });
    }, []);

    if (!initialRoute) {
        return <Redirect href="/screens/onboard" />;
    }

    return (
        <Stack>
            <Stack.Screen name="/(root)/(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}