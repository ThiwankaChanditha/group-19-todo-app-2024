import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TaskContext } from '../context/TaskContext'; 

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width* 0.95;
const ListHeight = screenHeight * 0.5;

const PinnedScreen = ({ navigation }) => {
    const { pinnedTasks, unpinTask } = useContext(TaskContext);

    const handleUnpinTask = (taskId) => {
        unpinTask(taskId); 
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={pinnedTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <View style={{ flex: 1 }}>
                        <Text style={styles.taskText}>Topic: {item.topic}</Text>
                            <Text style={styles.taskText}>Description: {item.description}</Text>
                            <Text style={styles.taskText}>Category: {item.category}</Text>
                            <Text style={styles.taskText}>Date: {item.date}</Text>
                            <Text style={styles.taskText}>Priority: {item.priority}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleUnpinTask(item.id)}>
                            <MaterialIcons name="push-pin" size={24} color="red" />
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
    taskItem: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        color: '#333',
    },
});

export default PinnedScreen;
