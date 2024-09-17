import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { TaskContext } from '../context/TaskContext'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width* 0.95;
const ListHeight = screenHeight * 0.5;

const DeleteTaskScreen = () => {
  const { tasks, deleteTask } = useContext(TaskContext);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params || {};

  useEffect(() => {
    console.log('Received taskId:', taskId);
    if (taskId) {
      setSelectedTasks([taskId]); 
    }
  }, [taskId]);

  const handleSelectTask = (taskId) => {
    const isSelected = selectedTasks.includes(taskId);
    if (isSelected) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleDelete = () => {
    console.log('Deleting tasks with ids:', selectedTasks);
    deleteTask(selectedTasks);
    setSelectedTasks([]); 
    navigation.navigate('TaskList');  
  };

  const handleEditTask = (task) => {
    navigation.navigate('AddTask', { task, editMode: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => handleSelectTask(item.id)}>
              <Text style={styles.taskText}>Topic: {item.topic}</Text>
              <Text style={styles.taskText}>Description: {item.description}</Text>
              <Text style={styles.taskText}>Category: {item.category}</Text>
              <Text style={styles.taskText}>Date: {item.date}</Text>
              <Text style={styles.taskText}>Priority: {item.priority}</Text>
              {selectedTasks.includes(item.id) && <Text style={styles.selectedText}>Selected</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEditTask(item)}>
              <MaterialIcons name="edit" size={24} color="blue" />
            </TouchableOpacity>
          </View>
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
    width: screenWidth,
    height: ListHeight,
    alignContent: 'space-evenly',
    alignSelf: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
