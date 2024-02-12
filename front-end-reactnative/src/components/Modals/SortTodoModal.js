import React from 'react';
import { View, Text, Modal, } from 'react-native';
import RadioButton from '../Buttons/Radio';
import CreateButton from '../Buttons/Create';
import CancelButton from '../Buttons/Cancel';

const SortTodoModal = ({
  sortModalVisible,
  setSortModalVisible,
  confirmSort,
  handleRadioButtonPress,
  selectedOption,
  loading,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={sortModalVisible}
      onRequestClose={() => setSortModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitleSort}>Sort By</Text>
          <RadioButton
            label="Name"
            isSelected={selectedOption === 'Name'}
            onPress={() => handleRadioButtonPress('Name')}
          />
          <RadioButton
            label="Status"
            isSelected={selectedOption === 'Status'}
            onPress={() => handleRadioButtonPress('Status')}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <CancelButton onPress={() => setSortModalVisible(false)} />
            <CreateButton
              onPress={() => confirmSort()}
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

  modalTitleSort: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
    paddingTop: 10,
  },
};

export default SortTodoModal;