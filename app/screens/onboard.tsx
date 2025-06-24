import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, SafeAreaView, Text } from 'react-native';

export default function OnBoard() {

    const router = useRouter();

    const finishOnboarding = async () => {
        console.log('finishOnboarding');

        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push("/(root)/(tabs)")
    };

    return (
        <SafeAreaView>
            <Text>onboard</Text>
            <Button
                title="Get Started"
                onPress={finishOnboarding}
            />
        </SafeAreaView>
    )
}