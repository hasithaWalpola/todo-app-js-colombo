import axios from "axios";
import Toast from "react-native-toast-message";

const API_URL = "https://60a21a08745cd70017576014.mockapi.io/api/v1/todo";

export const getTasks = async () => {
    try {
        const response = await axios.get(API_URL);

        const tasks = response.data.map((task: any) => {
            if (task.dueDate) {
                const due = new Date(task.dueDate);
                return {
                    ...task,
                    date: due.toISOString().split("T")[0], // "YYYY-MM-DD"
                    time: due.toTimeString().slice(0, 5), // "HH:MM"
                };
            }
            return task;
        });

        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};


export const getTaskById = async (taskId: string) => {
    try {
        const response = await axios.get(`${API_URL}/${taskId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
    }
};


export const updateTask = async (taskId: string, taskData: any) => {
    try {
        const response = await axios.put(`${API_URL}/${taskId}`, taskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};


export const createTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    status: string;
    priority?: string;
    category?: string;
    isImportant?: boolean;
}) => {
    try {
        const response = await axios.post(API_URL, {
            ...taskData,
            createdAt: new Date().toISOString(), // Ensure createdAt is included
        });
        Toast.show({
            type: "success",
            text1: "Task created successfully!",
        });
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    console.log(taskId, 'deleteTask');
    try {
        const response = await axios.delete(`${API_URL}/${taskId}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        Toast.show({
            type: "error",
            text1: "Failed to delete task",
        });
        throw error;
    }
};
