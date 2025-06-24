import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Layout() {
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('hasSeenOnboarding').then(value => {
            console.log(value, 'value');

            setInitialRoute(value === 'true' ? '(root)' : 'onboard');
        });
    }, []);

    if (initialRoute === 'onboard') {
        return <Redirect href="/screens/onboard" />;
    }

    return (
        <Stack>
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
        </Stack>
    );
}