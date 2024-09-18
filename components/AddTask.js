import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, KeyboardAvoidingView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import { TaskContext } from '../context/TaskContext';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width * 0.95;
const ListHeight = screenHeight * 0.5;

const AddTask = ({ navigation, route }) => {
    const { tasks, setTasks, categories, setCategories } = useContext(TaskContext);
    const [topic, setTopic] = useState(route.params?.task?.topic || '');
    const [description, setDescription] = useState(route.params?.task?.description || '');
    const [category, setCategory] = useState(route.params?.task?.category || '');
    const [date, setDate] = useState(route.params?.task?.date || null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [priority, setPriority] = useState(route.params?.task?.priority || 'Low');


    const handleSaveTask = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Topic cannot be empty');
            return;
        }

        const newTask = {
            id: route.params?.task?.id || Date.now(),
            topic,
            description,
            category: isAddingNewCategory ? newCategory : category,
            date: date ? date.toISOString().split('T')[0] : 'No date selected',
            priority,
        };

        try {
            if (route.params?.editMode) {
                const updatedTasks = tasks.map((task) =>
                    task.id === newTask.id ? newTask : task
                );
                setTasks(updatedTasks); 
            } else {
                setTasks([...tasks, newTask]);
            }

            navigation.navigate('TaskList', { newTask, editMode: route.params?.editMode });
        } catch (error) {
            console.log('Error saving task:', error);
        }
    };

    const handleAddNewCategory = async () => {
        if (newCategory.trim()) {
            const updatedCategories = [...categories, newCategory];
            setCategories(updatedCategories);
            setIsAddingNewCategory(false);
            setCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Task Topic"
                    value={topic}
                    onChangeText={setTopic}
                    accessibilityLabel="Task topic"
                    accessibilityHint="Enter the topic or name of the task here."
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter Task Description"
                    value={description}
                    onChangeText={setDescription}
                    accessibilityLabel="Task description"
                    accessibilityHint="Enter a detailed description of the task here."
                />

                <View style={styles.categoryContainer}>
                    <Text style={styles.label}>Select or Add Category:</Text>

                    {!isAddingNewCategory ? (
                        <>
                            {categories.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setCategory(cat)}
                                    style={[
                                        styles.categoryButton,
                                        category === cat && styles.selectedCategory,
                                    ]}
                                    accessibilityLabel={`Select ${cat} category`}
                                    accessibilityHint={`Select ${cat} as the category`}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            category === cat && styles.selectedCategoryText,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => setIsAddingNewCategory(true)}
                                style={styles.addNewCategoryButton}
                                accessibilityLabel="Add new category"
                                accessibilityHint="Add a new category for tasks."
                            >
                                <Text style={styles.addNewCategoryText}>+ Add New Category</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter New Category"
                                value={newCategory}
                                onChangeText={setNewCategory}
                                accessibilityLabel="New category name"
                                accessibilityHint="Enter the name of the new category here."
                            />
                            <TouchableOpacity
                                onPress={handleAddNewCategory}
                                style={styles.saveCategoryButton}
                                accessibilityLabel="Save new category"
                                accessibilityHint="Save the new category and add it to the list."
                            >
                                <Text style={styles.saveCategoryButtonText}>Save New Category</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setIsAddingNewCategory(false)}
                                style={styles.cancelButton}
                                accessibilityLabel="Cancel new category"
                                accessibilityHint="Cancel adding a new category"
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                
                
                <View style={styles.priorityContainer}>
                    <Text style={styles.label}>Select Priority:</Text>
                    {['Low', 'Medium', 'High'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            onPress={() => setPriority(level)}
                            style={[styles.priorityButton, priority === level && styles.selectedPriority]}
                            accessibilityLabel={`Select ${level} priority`}
                            accessibilityHint={`Set task priority to ${level}`}
                        >
                            <Text style={[styles.priorityText, priority === level && styles.selectedPriorityText]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setShowCalendar(true)}
                    accessibilityLabel="Select date"
                    accessibilityHint="Open the calendar to select a date for the task"
                >
                    <Text style={styles.buttonText}>Select Date: {date ? date.toString() : 'No date selected'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleSaveTask}
                    accessibilityLabel={route.params?.editMode ? 'Save Task' : 'Add Task'}
                    accessibilityHint={route.params?.editMode ? 'Save the changes made to the task.' : 'Add the new task.'}
                >
                    <Text style={styles.addButtonText}>
                        {route.params?.editMode ? 'Save Task' : 'Add Task'}
                    </Text>
                </TouchableOpacity>

                {showCalendar && (
                    <Modal isVisible={showCalendar}>
                        <View style={styles.modalContent}>
                            <CalendarPicker
                                onDateChange={(selectedDate) => {
                                    setDate(selectedDate);
                                    setShowCalendar(false);
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => setShowCalendar(false)}
                                accessibilityLabel="Close calendar"
                                accessibilityHint="Close the calendar and return to the previous screen."
                            >
                                <Text style={styles.modalCloseButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
        height: ListHeight,
        paddingTop: 40,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
        minHeight: screenHeight,
        width: screenWidth,
        alignContent: 'space-evenly',
        alignSelf: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        padding: 10,
        backgroundColor: '#3F51B5',
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryButton: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedCategory: {
        backgroundColor: '#64B5F6',
    },
    categoryText: {
        color: 'black',
    },
    selectedCategoryText: {
        color: 'white',
    },
    addNewCategoryButton: {
        backgroundColor: '#3F51B5',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addNewCategoryText: {
        color: 'white',
        fontSize: 16,
    },
    saveCategoryButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveCategoryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    priorityButton: {
        padding: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        alignItems: 'center',
    },
    selectedPriority: {
        backgroundColor: '#3F51B5',
    },
    priorityText: {
        color: 'black',
    },
    selectedPriorityText: {
        color: 'white',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButton: {
        color: '#F44336',
        marginTop: 10,
    },
});

export default AddTask;
