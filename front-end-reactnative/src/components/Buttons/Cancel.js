import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CancelButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.ButtonCancel} onPress={onPress}>
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  );
};

CancelButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  ButtonCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
});

export default CancelButton;