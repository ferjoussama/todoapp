import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Statbox = () => {
  const [statistics, setStatistics] = useState({
    completed_tasks: '',
    created_tasks: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const headers = {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      };
      const apiUrl = 'http://127.0.0.1:8000/api/dailystatistics';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        console.error(
          'Error fetching data:',
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.box}>
      {loading ? (
        <View style={{justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <>
          <View>
            <Text style={styles.textbox}>{statistics.completed_tasks}</Text>
            <Text style={styles.textboxtitle}>Completed/daily</Text>
          </View>
          <View>
            <Text style={styles.textbox}>{statistics.created_tasks}</Text>
            <Text style={styles.textboxtitle}>Created/daily</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -70,
    margin: 20,
  },

  textbox: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 22,
    textAlign: 'center',
  },

  textboxtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Statbox;
