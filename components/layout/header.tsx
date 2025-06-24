// AppHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

type AppHeaderProps = {
  title: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar backgroundColor="#2A3B4D" barStyle="light-content" />
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <Ionicons name="person-circle-outline" size={28} color="white" />
        </View>

        <Text style={styles.titleText}>{title}</Text>

        <View style={styles.rightSection}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
      </View>
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 50 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#2A3B4D",
    paddingTop: STATUSBAR_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60, // Fixed header height
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  titleText: {
    flex: 2,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default AppHeader;
