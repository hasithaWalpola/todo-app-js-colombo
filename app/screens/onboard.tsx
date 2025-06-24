import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnBoard() {

    const router = useRouter();

    const finishOnboarding = async () => {
        console.log('finishOnboarding');

        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push("/(root)/(tabs)")
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>

                <Image
                    source={require("../../assets/images/react-logo.png")}
                    style={{ width: 200, height: 300 }}
                    resizeMode="contain"
                />
                <Text style={styles.header}>Code Once, Run Everywhere </Text>
                <Text style={styles.subheader}>A Beginner’s Journey
                    with React Native  </Text>

                <TouchableOpacity
                    onPress={finishOnboarding}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

            </View>


        </SafeAreaView >
    )

}

const styles = StyleSheet.create({

    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subheader: {
        fontSize: 20,
        fontWeight: '200',
        fontStyle: 'italic'
    },
    button: {
        width: 200,
        height: 50,
        backgroundColor: '#000',
        color: '#fff',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderRadius: 25,
        marginTop: '10%'
    },
    buttonText: {
        fontSize: 17,
        textAlign: "center",
        fontWeight: 600,
        color: "#FFFFFF",
    }

})
