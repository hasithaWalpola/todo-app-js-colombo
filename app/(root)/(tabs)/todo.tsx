import AppHeader from "@/components/layout/header";
import CreativeLoader from "@/components/Loading";
import {
  deleteTask,
  getTasks,
  updateTask,
} from "@/services/todo-service";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddTaskModal from "./../addNew";

const TaskScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const route = useRoute();
  const { status } = useLocalSearchParams();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (status === "Done" || status === "Pending" || status === "Missed") {
      setSelectedFilter(status);
    } else {
      setSelectedFilter("ALL");
    }
  }, [route.params]);

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

  const statusFilters = ["ALL", "Done", "Pending", "Missed"];

  const filteredTasks = tasks
    .filter((task) =>
      selectedFilter === "ALL" ? true : task.status === selectedFilter
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // delete task
  const deleteTaskon = (taskId: any) => {
    deleteTask(taskId);
    fetchTasks();
  };

  // automatically mark tasks as Missed
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

  //tick after done tasks
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
          // Allow Done tasks to be reverted
          return { ...task, status: "Pending" };
        }

        return task;
      })
    );
  };

  if (loading) {
    return <CreativeLoader />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader title={"Tasks"} />

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List with Pull-to-Refresh */}
      <ScrollView
        contentContainerStyle={styles.taskList}
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
        {filteredTasks.map((task) => (
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
                <Text style={styles.timeText}>
                  {task.date} | {task.time}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  router.push({
                    pathname: "./updateTask/[taskId]",
                    params: { taskId: task.id },
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
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <View style={styles.container}>
        <AddTaskModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(taskData) => {
            // Handle task creation here
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  filterIndicator: {
    position: "absolute",
    backgroundColor: "#2A3B4D",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  completedTask: {
    backgroundColor: "#F8F8F8",
    opacity: 0.8,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: 75,
    backgroundColor: "white",
  },
  filterButton: {
    paddingHorizontal: 26,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: "#F0F0F0",
    height: 40,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  checkButton: {
    marginRight: 12,
  },
  tagText: {
    color: "white",
    fontSize: 12,
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
  activeFilter: {
    backgroundColor: "#2A3B4D",
  },
  filterText: {
    color: "#666",
    fontSize: 14,
  },
  activeFilterText: {
    color: "white",
  },
  taskList: {
    padding: 16,
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
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusTag: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  timeText: {
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
});

export default TaskScreen;
