import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';

const CreateButton = ({onPress, loading, name}) => {
  return (
    <TouchableOpacity
      style={styles.ButtonCreate}
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
        <Text style={styles.buttonCreateText}>{name}</Text>
      )}
    </TouchableOpacity>
  );
};

CreateButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  ButtonCreate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#023AE9',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonCreateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingIcon: {
    marginRight: 5,
  },
});

export default CreateButton;
