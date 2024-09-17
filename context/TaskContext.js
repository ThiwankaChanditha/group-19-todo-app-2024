import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [pinnedTasks, setPinnedTasks] = useState([]);

    const pinTask = (task) => {
        if (pinnedTasks.find(t => t.id === task.id)) {
            setPinnedTasks(pinnedTasks.filter(t => t.id !== task.id));
        } else {
            setPinnedTasks([...pinnedTasks, task]); 
        }
    };

    const unpinTask = (taskId) => {
        setPinnedTasks(pinnedTasks.filter(task => task.id !== taskId)); 
    };

    const deleteTask = (taskIds) => {
        const updatedTasks = tasks.filter((task) => !taskIds.includes(task.id));
        setTasks(updatedTasks);  // Update the task list after deletion
      };

    return (
        <TaskContext.Provider value={{ tasks, setTasks, pinnedTasks, pinTask, unpinTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};