import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { TaskContext } from '../context/TaskContext';
import { useNavigation } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width * 0.95;
const ListHeight = screenHeight * 0.5;

const IncompleteTask = ({ route }) => {
    const { tasks, setTasks, pinnedTasks, pinTask } = useContext(TaskContext);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const filteredTasks = tasks.filter(task => !task.completed);
        setIncompleteTasks(filteredTasks);

    }, [tasks]);

    const handleEditTask = (task) => {
        navigation.navigate('AddTask', { task, editMode: true });
    };

    const handlePinTask = (task) => {
        pinTask(task);
    };

    const handleDeleteTask = (taskId) => {
        navigation.navigate('DeleteTaskScreen', { taskId });
    };

    const handleToggleComplete = (taskId) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === taskId ? { ...task, completed: true } : task
            )
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Incomplete Tasks</Text>
            <FlatList
                style={{ height: ListHeight }}
                data={incompleteTasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Checkbox
                            style={{ marginRight: 10 }}
                            value={item.completed}
                            onValueChange={() => handleToggleComplete(item.id)}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskText}>Topic: {item.topic}</Text>
                            <Text style={styles.taskText}>Description: {item.description}</Text>
                            <Text style={styles.taskText}>Category: {item.category}</Text>
                            <Text style={styles.taskText}>Date: {item.date ? item.date : 'No date selected'}</Text>
                            <Text style={styles.taskText}>Priority: {item.priority}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleEditTask(item)}
                            accessibilityLabel="Edit this task"
                            accessibilityHint="Press to edit the task"
                        >
                            <MaterialIcons name="edit" size={24} color="blue" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleDeleteTask(item.id)}
                            accessibilityLabel="Delete this task"
                            accessibilityHint="Press to delete the task"
                        >
                            <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handlePinTask(item)}
                            accessibilityLabel="Pin this task"
                            accessibilityHint="Press to Pin the task"
                        >
                            <MaterialIcons
                                name="push-pin"
                                size={24}
                                color={pinnedTasks.find(t => t.id === item.id) ? 'green' : 'blue'}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
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
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    categoryItem: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
    },
    taskItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        color: '#333',
    },
});

export default IncompleteTask;
