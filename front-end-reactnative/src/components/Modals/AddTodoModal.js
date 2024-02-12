import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
} from 'react-native';
import CreateButton from '../Buttons/Create';
import CancelButton from '../Buttons/Cancel';


const AddTodoModal = ({
  modalVisible,
  setModalVisible,
  addTodo,
  loading,
  title,
  setTitle,
  description,
  setDescription,
}) => {
  const handleAddTodo = async () => {
    addTodo();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Todo</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={text => setDescription(text)}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <CancelButton onPress={() => setModalVisible(false)} />
            <CreateButton
              onPress={handleAddTodo}
              loading={loading}
              name="Confirm"
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

export default AddTodoModal;
