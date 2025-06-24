// app/updateTask/[taskId].tsx
import CreativeLoader from "@/components/Loading";
import { getTaskById, updateTask } from "@/services/todo-service";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function UpdateTaskId() {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    isImportant: false,
  });
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await getTaskById(taskId as string);
        setTaskData({
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate),
          isImportant: task.isImportant,
        });
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setTaskData((prev) => ({ ...prev, dueDate: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTaskData((prev) => ({
        ...prev,
        dueDate: new Date(
          prev.dueDate.getFullYear(),
          prev.dueDate.getMonth(),
          prev.dueDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        ),
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask(taskId as string, {
        ...taskData,
        dueDate: taskData.dueDate.toISOString(),
      });
      router.back();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return <CreativeLoader />;
  }

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Update Task</Text>

        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={taskData.title}
          onChangeText={(text) =>
            setTaskData((prev) => ({ ...prev, title: text }))
          }
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Description"
          value={taskData.description}
          onChangeText={(text) =>
            setTaskData((prev) => ({ ...prev, description: text }))
          }
          multiline
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#2A3B4D" />
            <Text style={styles.dateTimeText}>
              {taskData.dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#2A3B4D" />
            <Text style={styles.dateTimeText}>
              {taskData.dueDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.importantButton}
          onPress={() =>
            setTaskData((prev) => ({ ...prev, isImportant: !prev.isImportant }))
          }
        >
          <Ionicons
            name={taskData.isImportant ? "radio-button-on" : "radio-button-off"}
            size={20}
            color="#2A3B4D"
          />
          <Text style={styles.importantText}>Mark as important</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>Update Task</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={taskData.dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={taskData.dueDate}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const modalHeight = Dimensions.get("window").height / 2;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: "100%",
    height: modalHeight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A3B4D",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  dateTimeText: {
    color: "#2A3B4D",
    fontSize: 14,
  },
  importantButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  importantText: {
    color: "#2A3B4D",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  addButton: {
    backgroundColor: "#2A3B4D",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A3B4D",
  },
});

export default UpdateTaskId;
