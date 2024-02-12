import React, {useState} from 'react';
import {View, Text, TextInput, Modal} from 'react-native';
import RadioButton from '../Buttons/Radio';
import CreateButton from '../Buttons/Create';
import CancelButton from '../Buttons/Cancel';
import DeleteButton from '../Buttons/Delete';

const UpdateTodoModal = ({
  updateModalVisible,
  setUpdateModalVisible,
  selectedTodo,
  updateTodo,
  deleteTodo,
  loading,
  updatedTitle,
  setUpdatedTitle,
  updatedDescription,
  setUpdatedDescription,
  isTaskCompleted,
  setIsTaskCompleted,
}) => {
  const handleUpdateTodo = async () => {
    updateTodo();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={updateModalVisible}
      onRequestClose={() => setUpdateModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.modalTitle}>Update Todo</Text>
            <DeleteButton
              onPress={() => deleteTodo()}
              loading={false}
              name="Delete"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter updated title"
            value={updatedTitle}
            onChangeText={text => setUpdatedTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter updated description"
            value={updatedDescription}
            onChangeText={text => setUpdatedDescription(text)}
          />

          {selectedTodo.status !== 'COMPLETED' && (
            <View style={{marginBottom: 10}}>
              <RadioButton
                label="Mark as Completed"
                isSelected={isTaskCompleted}
                onPress={() => setIsTaskCompleted(!isTaskCompleted)}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <CancelButton onPress={() => setUpdateModalVisible(false)} />
            <CreateButton
              onPress={handleUpdateTodo}
              loading={loading}
              name="Update"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(128, 128, 128, 0.6)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    elevation: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },

  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 1,
  },
};

export default UpdateTodoModal;
