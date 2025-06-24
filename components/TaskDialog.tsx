import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: string | Date;
  isImportant: boolean;
}

interface UpdateTaskDialogProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (taskData: Task) => void;
}

const UpdateTaskDialog: React.FC<UpdateTaskDialogProps> = ({
  visible,
  onClose,
  task,
  onUpdate,
}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    isImportant: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTaskData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        isImportant: task.isImportant || false,
      });
    }
  }, [task]);

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

  const handleUpdate = () => {
    if (taskData.title.trim()) {
      onUpdate({
        ...taskData,
        dueDate: taskData.dueDate.toISOString(),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset to original task data
    if (task) {
      setTaskData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        isImportant: task.isImportant || false,
      });
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header with close button */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Update Task</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Ionicons name="close" size={24} color="#2A3B4D" />
            </TouchableOpacity>
          </View>

          {/* Task Title Input */}
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={taskData.title}
            onChangeText={(text) =>
              setTaskData((prev) => ({ ...prev, title: text }))
            }
            placeholderTextColor="#999"
          />

          {/* Task Description Input */}
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={taskData.description}
            onChangeText={(text) =>
              setTaskData((prev) => ({ ...prev, description: text }))
            }
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />

          {/* Date and Time Selectors */}
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

          {/* Important Toggle */}
          <TouchableOpacity
            style={styles.importantButton}
            onPress={() =>
              setTaskData((prev) => ({
                ...prev,
                isImportant: !prev.isImportant,
              }))
            }
          >
            <Ionicons
              name={
                taskData.isImportant ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#2A3B4D"
            />
            <Text style={styles.importantText}>Mark as important</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
              disabled={!taskData.title.trim()}
            >
              <Text style={styles.buttonText}>Update Task</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={taskData.dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Time Picker */}
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
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    width: "100%",
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A3B4D",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#FAFAFA",
    gap: 10,
  },
  dateTimeText: {
    color: "#2A3B4D",
    fontSize: 14,
    fontWeight: "500",
  },
  importantButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
    paddingVertical: 5,
  },
  importantText: {
    color: "#2A3B4D",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  updateButton: {
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

export default UpdateTaskDialog;
