import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';

const DeleteTaskScreen = ({ navigation, route }) => {
  const { tasks, deleteTask } = useContext(TaskContext);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleDelete = () => {
    deleteTask(selectedTasks);
    navigation.navigate('TaskList');
  };

  const handleSelectTask = (taskId) => {
    const isSelected = selectedTasks.includes(taskId);
    if (isSelected) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => handleSelectTask(item.id)}
          >
            <Text style={styles.taskText}>{item.topic}</Text>
            {selectedTasks.includes(item.id) && (
              <Text style={styles.selectedText}>Selected</Text>
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Selected Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 14,
    color: 'green',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DeleteTaskScreen;