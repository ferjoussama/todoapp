import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';

const DeleteButton = ({onPress, loading, name}) => {
  return (
    <TouchableOpacity
      style={styles.ButtonDelete}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingIcon}>
          <Animatable.View animation="rotate" iterationCount="infinite">
            <Icon name="spinner" size={20} color="white" />
          </Animatable.View>
        </View>
      ) : (
        <Text style={styles.buttonDeleteText}>{name}</Text>
      )}
    </TouchableOpacity>
  );
};


DeleteButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  ButtonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  buttonDeleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingIcon: {
    marginRight: 5,
  },
});

export default DeleteButton;
