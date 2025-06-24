/* eslint-disable react/no-unescaped-entities */
import AppHeader from "@/components/layout/header";
import CreativeLoader from "@/components/Loading";
import {
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/todo-service";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import "../global.css";
import AddTaskModal from "./../addNew";

const HomeScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTasks();
  }, [showAddModal]);

  const fetchTasks = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks(true);
  };

  useEffect(() => {
    console.log("Tasks updated:");
  }, [tasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "#3B82F6"; // blue
      case "Pending":
        return "#9E9E9E"; //gray
      case "Missed":
        return "#FF6B6B"; // Red
      default:
        return "#2A3B4D";
    }
  };

  useEffect(() => {
    const updatedTasks = () => {
      const availableTasks = tasks.map((task) => {
        if (task.status === "Pending" && new Date(task.date) < new Date()) {
          console.log(task);
          const updatedTask = { ...task, status: "Missed" };
          updateTask(task.id, updatedTask);
          return updatedTask;
        }
        return task;
      });
      setTasks(availableTasks);
    };
    updatedTasks();
  }, []);

  const toggleTaskDone = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map(async (task) => {
        if (task.id === taskId) {
          // Only allow toggling for Pending tasks
          if (task.status === "Pending") {
            const updatedTask = { ...task, status: "Done" };
            updateTask(task.id, updatedTask);
            fetchTasks();
            return updatedTask;
          }
          // Prevent changes for Missed tasks
          if (task.status === "Missed") {
            return task;
          }
          // Allow Done tasks to be reverted (if needed)
          return { ...task, status: "Pending" };
        }

        return task;
      })
    );
  };
  // Format date and time for display
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if it's today, tomorrow, or another date
      if (date.toDateString() === today.toDateString()) {
        return `Today • ${timeStr}`;
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow • ${timeStr}`;
      } else {
        const options: any = { month: "short", day: "numeric" };
        return `${date.toLocaleDateString("en-US", options)} • ${timeStr}`;
      }
    } catch (error) {
      return `${dateStr} • ${timeStr}`;
    }
  };
  // Add this sorting function
  const sortTasksByTimeProximity = (a: any, b: any) => {
    const now = new Date();

    // Create Date objects from task date/time
    const aDate = new Date(`${a.date}T${a.time}`);
    const bDate = new Date(`${b.date}T${b.time}`);

    // Calculate time differences in milliseconds
    const aDiff = aDate.getTime() - now.getTime();
    const bDiff = bDate.getTime() - now.getTime();

    // Handle tasks in the past (negative values)
    const aAbs = Math.abs(aDiff);
    const bAbs = Math.abs(bDiff);

    // Sort by closest time first (whether in past or future)
    // For same timing, future tasks come first
    return aDiff > 0 && bDiff > 0
      ? aDiff - bDiff
      : aDiff > 0
        ? -1
        : bDiff > 0
          ? 1
          : aAbs - bAbs;
  };

  // Counts based on status
  const counts = {
    pending: tasks.filter((t) => t.status === "Pending").length,
    done: tasks.filter((t) => t.status === "Done").length,
    missed: tasks.filter(
      (t) => t.status === "Missed" && new Date(t.date) < new Date()
    ).length,
  };

  const deleteTaskon = (taskId: any) => {
    deleteTask(taskId);
    fetchTasks();
  };

  // Show loading screen
  if (loading) {
    return <CreativeLoader />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title="Home" />

      {/* Body */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2A3B4D"]}
            tintColor="#2A3B4D"
            title="Pull to refresh"
            titleColor="#2A3B4D"
          />
        }
      >
        {/* Count Boxes */}
        <View style={styles.countContainer}>
          <TouchableOpacity
            style={[styles.countBox, styles.pendingBox]}
            onPress={() => {
              router.push("/todo?status=Pending");
            }}
          >
            <Text style={styles.countNumber}>{counts.pending}</Text>
            <Text style={styles.countLabel}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.countBox, styles.doneBox]}
            onPress={() => {
              router.push("/todo?status=Done");
            }}
          >
            <Text style={styles.countNumber}>{counts.done}</Text>
            <Text style={styles.countLabel}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.countBox, styles.missedBox]}
            onPress={() => {
              router.push("/todo?status=Missed");
            }}
          >
            <Text style={styles.countNumber}>{counts.missed}</Text>
            <Text style={styles.countLabel}>Missed</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <Text style={styles.sectionTitle}>Today's Upcoming Tasks</Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={24} color="#FF5722" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchTasks}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color="#9E9E9E" />
            <Text style={styles.emptyText}>No tasks for today</Text>
            <Text style={styles.emptySubText}>You're all caught up!</Text>
          </View>
        ) : (
          tasks
            .filter((task) => task.status === "Pending")
            .sort(sortTasksByTimeProximity)
            .map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  task.status === "Done" && styles.completedTask,
                ]}
              >
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => {
                    if (task.status === "Pending") {
                      toggleTaskDone(task.id);
                    }
                  }}
                  disabled={task.status !== "Pending"}
                >
                  <Ionicons
                    name={
                      task.status === "Missed"
                        ? "close-circle-outline"
                        : task.status === "Done"
                          ? "checkmark-circle"
                          : "ellipse-outline"
                    }
                    size={24}
                    color={getStatusColor(task.status)}
                    opacity={task.status === "Pending" ? 1 : 0.8}
                  />
                </TouchableOpacity>

                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.status === "Done" && styles.completedText,
                    ]}
                  >
                    {task.title}
                  </Text>

                  <Text
                    style={[
                      styles.taskDescription,
                      task.status === "Done" && styles.completedText,
                    ]}
                  >
                    {task.description}
                  </Text>

                  <View style={styles.taskDetails}>
                    <View
                      style={[
                        styles.statusTag,
                        { backgroundColor: getStatusColor(task.status) },
                      ]}
                    >
                      <Text style={styles.tagText}>{task.status}</Text>
                    </View>

                    {/* Enhanced Date/Time Display */}
                    <View
                      className="flex-col justify-center items-center "
                      style={styles.dateTimeContainer}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.timeTextDate}>
                        {formatDateTime(task.date, task.time)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() =>
                      router.push({
                        pathname: "./updateTask/[taskId]",
                        params: { taskId: task.id }, // Make sure `task.id` is a string
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={20} color="#2A3B4D" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      console.log(task.id);
                      deleteTaskon(task.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF5722" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(taskData: any) => {
          console.log("New Task:", taskData);
        }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },

  // Error and Empty States
  errorContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
  },
  errorText: {
    color: "#FF5722",
    fontSize: 16,
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: "#2A3B4D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A3B4D",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2A3B4D",
  },
  completedTask: {
    backgroundColor: "#F8F8F8",
    opacity: 0.8,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  checkButton: {
    marginRight: 12,
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#2A3B4D",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  countBox: {
    borderRadius: 8,
    padding: 16,
    width: "30%",
    alignItems: "center",
  },
  pendingBox: {
    backgroundColor: "#9E9E9E", // Gray for pending
  },
  doneBox: {
    backgroundColor: "#3B82F6", // Blue for done
  },
  missedBox: {
    backgroundColor: "#FF5722", // Red for missed
  },
  countNumber: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  countLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A3B4D",
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // timeText: {
  //   fontSize: 12,
  //   fontWeight: "500",
  //   paddingHorizontal: 0,
  //   paddingBottom: 4,
  //   paddingTop: 0,
  //   borderRadius: 12,
  //   overflow: "hidden",
  // },
  timeUrgent: {
    // Red with opacity
    color: "#FF6B6B",
  },
  timeWarning: {
    backgroundColor: "#FFA72620", // Orange with opacity
    color: "#FFA726",
  },
  timeNormal: {
    backgroundColor: "#3B82F620", // Blue with opacity
    color: "#3B82F6",
  },
  timeNeutral: {
    backgroundColor: "#9E9E9E20", // Gray with opacity
    color: "#9E9E9E",
  },
  taskContent: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A3B4D",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  statusTag: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeTextDate: {
    paddingBottom: 6,
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateText: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },

  timeText: {
    fontSize: 12,
    color: "#666",
  },
});

export default HomeScreen;
