// app/appNew.tsx
import { createTask } from "@/services/todo-service";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
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

type AddTaskModalProps = {
  visible?: boolean;
  onClose: () => void;
  onSubmit: (task: {
    createdAt?: string;
    id?: string;
    taskTitle: string;
    description: string;
    dueDate: Date;
    isImportant?: boolean;
  }) => void;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  // / Updated handleSubmit function
  const handleSubmit = () => {
    if (!validateForm()) return;

    const taskData = {
      createdAt: new Date().toISOString(),
      title: taskTitle.trim(),
      description: description.trim(),
      dueDate: dueDate.toISOString(),
      status: "Pending",
      isImportant: isImportant,
    };

    try {
      onSubmit({
        ...taskData,
        dueDate: dueDate,
        taskTitle: taskTitle.trim(),
      });
      createTask(taskData);

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Reset form
      setTaskTitle("");
      setDescription("");
      setDueDate(new Date());
      setIsImportant(false);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleTimeChange = (event: any, selectedTime: any) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setDueDate(
        new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        )
      );
    }
  };
  const validateForm = () => {
    let isValid = true;

    // Title validation
    if (!taskTitle.trim()) {
      setTitleError("Task title is required");
      isValid = false;
    } else if (taskTitle.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Date validation
    const currentDate = new Date();
    if (dueDate < currentDate) {
      setDateError("Due date must be in the future");
      isValid = false;
    } else {
      setDateError("");
    }

    return isValid;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Task</Text>

          {/* Task Title */}
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          {/* After Task Title Input */}
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}

          {/* Description */}
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Date and Time Pickers */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#2A3B4D" />
              <Text style={styles.dateTimeText}>
                {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#2A3B4D" />
              <Text style={styles.dateTimeText}>
                {dueDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          {/* Mark as Important */}
          <TouchableOpacity
            style={styles.importantButton}
            onPress={() => setIsImportant(!isImportant)}
          >
            <Ionicons
              name={isImportant ? "radio-button-on" : "radio-button-off"}
              size={20}
              color="#2A3B4D"
            />
            <Text style={styles.importantText}>Mark as important</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {/* Date/Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dueDate}
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

const { width } = Dimensions.get("window");
const modalHeight = Dimensions.get("window").height / 1.8;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2A3B4D",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  successText: {
    color: "#4BB543",
    marginLeft: 8,
    fontSize: 14,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: "100%",
    height: modalHeight,
  },
  headerDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CCCCCC",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
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
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
  },
  pickerText: {
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

export default AddTaskModal;
