import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { TaskContext } from '../context/TaskContext'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width * 0.95;

const DeleteTaskScreen = () => {
  const { tasks, setTasks } = useContext(TaskContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params || {};

  useEffect(() => {
    if (taskId) {
      const taskToDelete = tasks.find(task => task.id === taskId);
      setSelectedTask(taskToDelete);
    }
  }, [taskId]);

  const handleDelete = () => {
    const updatedTasks = tasks.filter(task => task.id !== selectedTask.id);
    setTasks(updatedTasks);
    navigation.navigate('TaskList'); 
  };

  if (!selectedTask) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Task not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to delete this task?</Text>
      <Text style={styles.taskDetails}>Topic: {selectedTask.topic}</Text>
      <Text style={styles.taskDetails}>Description: {selectedTask.description}</Text>
      <Text style={styles.taskDetails}>Category: {selectedTask.category}</Text>
      <Text style={styles.taskDetails}>Priority: {selectedTask.priority}</Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityLabel="Confirm delete task"
        accessibilityHint="Press to confirm deleting the task"
      >
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Cancel task deletion"
        accessibilityHint="Press to cancel task deletion"
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DeleteTaskScreen;
