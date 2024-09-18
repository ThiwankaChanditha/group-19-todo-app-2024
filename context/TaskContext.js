import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [pinnedTasks, setPinnedTasks] = useState([]);
    const [categories, setCategories] = useState(['Personal', 'Urgent']);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            const storedPinnedTasks = await AsyncStorage.getItem('pinnedTasks');

            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedPinnedTasks) setPinnedTasks(JSON.parse(storedPinnedTasks));
        } catch (e) {
            console.error('Failed to load tasks from AsyncStorage', e);
        }
    };

    const saveTasks = async (updatedTasks) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
        } catch (e) {
            console.error('Failed to save tasks to AsyncStorage', e);
        }
    };

    const savePinnedTasks = async (updatedPinnedTasks) => {
        try {
            await AsyncStorage.setItem('pinnedTasks', JSON.stringify(updatedPinnedTasks));
            setPinnedTasks(updatedPinnedTasks);
        } catch (e) {
            console.error('Failed to save pinned tasks to AsyncStorage', e);
        }
    };

    const pinTask = (task) => {
        const isPinned = pinnedTasks.some(t => t.id === task.id);
        const updatedPinnedTasks = isPinned
            ? pinnedTasks.filter(t => t.id !== task.id)
            : [...pinnedTasks, task];

        savePinnedTasks(updatedPinnedTasks);
    };

    const unpinTask = (taskId) => {
        const updatedPinnedTasks = pinnedTasks.filter(task => task.id !== taskId);
        savePinnedTasks(updatedPinnedTasks);
    };

    const deleteTask = (taskIds) => {
        const updatedTasks = tasks.filter(task => !taskIds.includes(task.id));
        saveTasks(updatedTasks);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ 
            tasks, 
            setTasks: saveTasks, 
            pinnedTasks, 
            pinTask, 
            unpinTask, 
            deleteTask, 
            categories, 
            setCategories 
        }}>
            {children}
        </TaskContext.Provider>
    );
};
