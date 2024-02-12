import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEn from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';

const Task = props => {
  return (
    <View
      style={
        props.item.status == 'IN PROGRESS'
          ? styles.cardContainer
          : styles.cardContainer2
      }
    >
      <View style={styles.headerCard}>
        <View style={styles.flex}>
          <Icon name="bookmark-o" size={20} color="gray" />
          <Text style={styles.text}>ASSETS</Text>
        </View>
        <View style={styles.flex}>
          <IconEn
            name="dot-single"
            size={30}
            color={props.item.status == 'IN PROGRESS' ? 'green' : 'red'}
          />
          <Text style={styles.text2}>
            {props.item.status == 'IN PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={styles.textcard}>
        {props.item.title}
      </Text>
      <View style={styles.bottomCard}>
        <View style={styles.flex}>
          <Text style={styles.text2}>For</Text>
          <Text style={styles.text2}>{props.username}</Text>
        </View>
      </View>
    </View>
  );
};

Task.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['IN PROGRESS', 'COMPLETED']).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    height: 110,
    backgroundColor: 'white',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: 'green',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column',
    marginBottom: 10,
  },
  cardContainer2: {
    padding: 10,
    height: 110,
    backgroundColor: 'white',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: 'red',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column',
    marginBottom: 10,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 15,
  },
  text2: {
    color: 'black',
    fontSize: 14,
    marginLeft: 5,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textcard: {
    color: 'black',
    fontSize: 15,
    marginTop: 10,
  },
  bottomCard: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Task;
