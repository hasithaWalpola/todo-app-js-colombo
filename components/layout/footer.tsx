import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
// import "../global.css";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";
const Footer = () => {
  const pathname = usePathname();

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/tasks") return "Tasks";
    if (pathname === "/calendar") return "Calendar"; // Fixed spelling
    return "Home";
  };
  const activeTab = getActiveTab();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-full bg-white border-t border-gray-200 absolute bottom-0 left-0"
      style={{
        height: 64 + insets.bottom, // Total height including safe area
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-row justify-around items-center h-full">
        {/* Home Tab */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.navigate("/")}
        >
          <Ionicons
            name={activeTab === "Home" ? "home" : "home-outline"}
            size={24}
            color={activeTab === "Home" ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Home" ? "text-blue-500" : "text-gray-500"
              }`}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tasks Tab */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.navigate("/todo")}
        >
          <Ionicons
            name={activeTab === "Tasks" ? "list" : "list-outline"}
            size={24}
            color={activeTab === "Tasks" ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Tasks" ? "text-blue-500" : "text-gray-500"
              }`}
          >
            Tasks
          </Text>
        </TouchableOpacity>

        {/* Calendar Tab */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.navigate("/calendar")} // Fixed spelling
        >
          <Ionicons
            name={activeTab === "Calendar" ? "calendar" : "calendar-outline"}
            size={24}
            color={activeTab === "Calendar" ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`text-xs mt-1 ${activeTab === "Calendar" ? "text-blue-500" : "text-gray-500"
              }`}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
